const {Schema, db, model} = require('../db')

voteSchema = new Schema({
    up:{
        type:Boolean,
        required:true},
    article:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:'Article'
    },
    oldid:{
        type:String,
        required:true},
    comment:String
},{timestamps:true})

module.exports = model('Vote', voteSchema)