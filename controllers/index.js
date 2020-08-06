const Article = require('../models/Article')
const Vote = require('../models/Vote')
const axios = require('axios').default;

const articleByName = name=>{
    return Article.findOneAndUpdate({title:name},{},{
        new:true,
        upsert:true
    }).then(a=>{
        // console.log(a);
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
        console.log(obj,'theobject');
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
        console.log(a);
        return a
    }).catch(err=>{
        console.error(err);
    })
}

//make sure this works when there is no article by the name
const articleScore = async name =>{
    return await Article.findOne({title:name},{title:1,score:1,_id:0})
}

// articleByName("Wikipedia").then(a=>{
//     console.log(a);
// })

/* vote({
    up:true,
    article:'Wiktionary',
    oldid:1,
    comment:'cool'
}).then(a2=>{
    console.log(a2);
}) */

/* articleScore('Wiktionary').then(score=>{
    console.log(score)
}) */

module.exports = {articleByName, vote, articleScore, allArticles}