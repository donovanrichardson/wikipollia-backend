const Article = require('../models/Article')
const Vote = require('../models/Vote')

exports.articleByName = name=>{
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

exports.vote = obj =>{
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
    }).catch(err=>{
        console.error(err);
    })
}

exports.allArticles = () =>{
    return Article.find().then(a=>{
        return a.map(article=>article.title)
    }).catch(err=>{
        console.error(err);
    })
}

exports.articleScore = name =>{
    return articleByName(name).then(a=>{
        return a.populate('votes')
    }).then(populated=>{
        const score = populated.votes.reduce((total, cur)=>{
            return cur ? total+1 : total-1
        }, 0)
        return {title:populated.title,
        score:score}
    }).catch(err=>{
        console.error(err);
    })
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