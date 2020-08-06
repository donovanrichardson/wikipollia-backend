const Article = require('../models/Article')
const Vote = require('../models/Vote')
const axios = require('axios').default;

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

module.exports = {articleByName, vote, articleScore, allArticles}