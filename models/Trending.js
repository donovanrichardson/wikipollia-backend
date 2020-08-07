const {Schema, db, model} = require('../db')

const trendingSchema = new Schema({},{timestamps:true})

module.exports = model('Trending', trendingSchema)