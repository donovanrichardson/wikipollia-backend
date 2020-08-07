const {Schema, db, model} = require('../db')

const articleSchema = new Schema({
    title:{
        type:String,
        required:true},
    score:{
        type:Number,
        default:0},
    pscore:Number,
    votes:[{
        type:Schema.Types.ObjectId,
        ref: 'Vote'}]
},{timestamps:true})

module.exports = model('Article', articleSchema)