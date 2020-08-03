const router = require('express').Router()
const {vote} = require('../controllers')

router.post('/', async (req, res)=>{
    try{const inserted = await vote(req.body)
    res.json(inserted)}catch(err){
        console.error(err);
        res.status(400)
    }
})

module.exports = router;