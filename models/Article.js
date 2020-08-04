const {Schema, db, model} = require('../db')

const articleSchema = new Schema({
    title:{
        type:String,
        required:true},
    score:{
        type:Number,
        default:0},
    votes:[{
        type:Schema.Types.ObjectId,
        ref: 'Vote'}]
})

module.exports = model('Article', articleSchema)