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
        // console.log(a2);
        return a2.save()
    }).then(saved=>{
        return articleScore(saved.title)
    }).then(score=>{
        return{
            article:score,
            vote:voteDoc
        }
    }).catch(err=>{
        console.error(err);
    })
}

const allArticles = () =>{
    return Article.find().then(a=>{
        return a.map(article=>article.title)
    }).catch(err=>{
        console.error(err);
    })
}

//make sure this works when there is no article by the name
const articleScore = async name =>{
    let article
    try{
        article = await Article.findOne({title:name}).populate('votes')
    }catch(err){
        console.error(err);
    }

    if(!article){
        return {title:name,
            score:'article not in database'}
    }else{
        console.log(article);
        const score = article.votes.reduce((total, cur)=>{
            const addsub = cur.up ? total+1 : total-1
            console.log(addsub);
            return addsub
        }, 0)
        return {title:article.title,
        score:score}
    }
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