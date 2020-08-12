const Article = require('../models/Article')
const Vote = require('../models/Vote')
const Trending = require('../models/Trending')
const axios = require('axios').default;
var ttest = require('ttest');
const {db }= require('../db');
const { json } = require('express');

function sum(a){
    return a.reduce((total, item)=>{
        return total + item
    },0)
}

function onetailed(a, b){
    // console.log('onetailled', a.length, b.length);
    console.log(a,b);
    // const modify = average(a)<average(b)
    squaresA= a.map(i=>Math.pow(i,2))
    squaresB= b.map(i=>Math.pow(i,2))
    geomeanA = sum(squaresA)/sum(a)
    geomeanB = sum(squaresB)/sum(b)
    return geomeanB/geomeanA
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
        const manyvotes = await Article.find().populate('votes')
        tempstamp = {createdAt:Date.now()}
        
        // console.log(manyvotes);
        // console.log('manyvotes', manyvotes);
        for(i = 0; i < manyvotes.length;i++){
            // console.log(i);
            // console.log(manyvotes.length);
            const a = manyvotes[i]
            // // console.log('next',a);
            const tempvotes = manyvotes[i].votes.map(v=>v);
            tempvotes.push(tempstamp)
            if (tempvotes.length<3){
                a.pscore = Infinity
                const saved = await a.save()
                console.log(saved);
            }else{
                let votediffs = []
                for(j = 1; j < tempvotes.length; j++){
                    // console.log('nextvote',a.votes[i]);
                    votediffs.push(tempvotes[j].createdAt - tempvotes[j-1].createdAt)
                }
                // console.log(votediffs);
                const half = votediffs.length/2
                firstHalf = votediffs.slice(0,half)
                lastHalf = votediffs.slice(half)
                console.log('halves', firstHalf, lastHalf);
                const newscore = onetailed(firstHalf,lastHalf)
                console.log(newscore);
                a.pscore = newscore
                await a.save();
            }
        }
        console.log(await Trending.create({}))
        
    }
    let articl = await Article.find().sort({pscore:1}).limit(5)
    articl = articl.filter(a=>a.pscore)
    // db.close()
    return articl

}

module.exports = {articleByName, vote, articleScore, allArticles, trending}