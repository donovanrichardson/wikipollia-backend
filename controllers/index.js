const Article = require('../models/Article')
const Vote = require('../models/Vote')

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

const vote = obj =>{
    let voteDoc;
    return articleByName(obj.article).then(a=>{
        obj.article = a._id
        return Vote.create(obj)
    }).then(v=>{
        voteDoc = v;
        console.log(v);
        return Article.findById(v.article)
    }).then(a2=>{
        a2.votes.push(voteDoc._id)
        voteDoc.up ? a2.score++ : a2.score--
        // console.log(a2);
        return a2.save()
    }).then(scored=>{
        return{
            article:{title:scored.title,score:scored.score}, //i do this codee 3 times. refactorr!
            vote:voteDoc
        }
    }).catch(err=>{
        console.error(err);
    })
}

const allArticles = () =>{
    return Article.find({},{title:1,score:1,_id:0}).sort('title').then(a=>{
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