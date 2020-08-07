const router = require('express').Router()
const {allArticles, articleScore, trending} = require('../controllers')

router.get('/', async (req, res)=>{
    try{
        const articles = await allArticles();
        res.json(articles);
    }catch(err){
        console.error(err);
        res.status(400);
    }
})

router.get('/name/:name', async (req, res)=>{
    // console.log(req.query);
    try{
        const article = await articleScore(req.params.name);
        res.json(article);
    }catch(err){
        console.error(err);
        res.status(400);
    }
})

router.get('/trending',async(req,res)=>{
    // console.log(req.query);
    try{
        // console.log('route');
        const articles = await trending()
        res.json(articles);
    }catch(err){
        console.error(err);
        res.status(400);
    }
})

module.exports = router