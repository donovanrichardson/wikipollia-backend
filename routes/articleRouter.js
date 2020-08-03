const router = require('express').Router()
const {allArticles, articleScore} = require('../controllers')

router.get('/', async (req, res)=>{
    try{
        const articles = await allArticles();
        res.json(articles);
    }catch(err){
        console.error(err);
        res.status(400);
    }
})

router.get('/:name', async (req, res)=>{
    try{
        const article = await articleScore(req.params.name);
        res.json(article);
    }catch(err){
        console.error(err);
        res.status(400);
    }
})

module.exports = router