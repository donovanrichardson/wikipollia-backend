const Article = require('../models/Article')
const Vote = require('../models/Vote')
const Trending = require('../models/Trending')
const axios = require('axios').default;
var ttest = require('ttest');
const {db }= require('../db');
const { json } = require('express');

function average(a){
    return a.reduce((total, item)=>{
        return total + (item/a.length)
    },0)
}

function onetailed(a, b){
    // console.log('onetailled', a.length, b.length);
    console.log(a,b);
    const modify = average(a)<average(b)
    const p = ttest(a,b).pValue()
    // console.log(p);
    if(modify){
        return (2-p)/2
    }else{
        return p
    }
}

const articleByName = name=>{
    return Article.findOneAndUpdate({title:name},{},{
        new:true,
        upsert:true
    }).then(a=>{
        return a
    }).catch(err=>{
        console.error(err);
    })
}

const vote = async obj =>{
    try{
        const theArticle = await articleByName(obj.article)
        const encoded = encodeURI(obj.article)
        let thePage = await axios.get(`https://en.wikipedia.org/w/api.php?action=query&prop=info&format=json&titles=${encoded}&origin=*`)
        obj.article = theArticle._id
        thePage = thePage.data.query.pages
        const pageid = Object.keys(thePage)[0]
        obj.oldid = thePage[pageid].lastrevid
        const voteDoc = await Vote.create(obj)
        theArticle.votes.push(voteDoc._id)
        voteDoc.up ? theArticle.score++ : theArticle.score--
        await theArticle.save()
        return {
            title:theArticle.title,
            score:theArticle.score,
            oldid:voteDoc.oldid
        }
    }catch(err){
        console.error(err);
    }
}

const allArticles = () =>{
    return Article.find({},{title:1,score:1,_id:0}).sort({'score':-1}).limit(5).then(a=>{
        return a
    }).catch(err=>{
        console.error(err);
    })
}

const articleScore = async name =>{
    return await Article.findOne({title:name},{title:1,score:1,_id:0})
}

const trending = async () =>{
    const lastTrend = await Trending.findOne().sort({updatedAt:-1})
    // console.log('lasttrend', lastTrend);
    if(!lastTrend || Date.now()- lastTrend.updatedAt > 60000){
        const theArticles = await Article.find().populate('votes')
        const manyvotes = theArticles.filter(a=>{
            return a.votes.length > 3
        })
        // console.log(manyvotes);
        // console.log('manyvotes', manyvotes);
        for(i = 0; i < manyvotes.length;i++){
            // console.log(i);
            // console.log(manyvotes.length);
            const a = manyvotes[i]
            // // console.log('next',a);
            let votediffs = []
            for(j = 1; j < a.votes.length; j++){
                // console.log('nextvote',a.votes[i]);
                votediffs.push(a.votes[j].createdAt - a.votes[j-1].createdAt)
            }
            // console.log(votediffs);
            const half = votediffs.length/2
            firstHalf = votediffs.slice(0,half)
            lastHalf = votediffs.slice(half)
            // console.log('halves', firstHalf, lastHalf);
            a.pscore = onetailed(firstHalf,lastHalf)
            await a.save();
        }
        console.log(await Trending.create({}))
        
    }
    const articl = await Article.find().sort({pscore:1}).limit(5)
    // db.close()
    return articl

}

module.exports = {articleByName, vote, articleScore, allArticles, trending}