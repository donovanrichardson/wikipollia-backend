const mongoose = require("mongoose"); //bring in mongoose library
require("dotenv").config(); //reads .env file environmental variables
const mongoConfigObject = { useNewUrlParser: true, useUnifiedTopology: true }; //Config option to eliminate deprecation warnings
const mongoURI = process.env.mongoURI + 'wikipollia'
//from Mongoose-Multi-Models from Alex Merced
///////////////////////////
//CONNECT TO DATABASE
///////////////////////////
// Code for connecting to our mongo database
mongoose.connect(mongoURI, mongoConfigObject, () => {
  console.log("CONNECTED TO MONGO");
});

const db = mongoose.connection

////////////////////////////
//CONNECTION MESSAGING
///////////////////////////
//Building in messages so we know when our database connection changes
db.on("error", (err) => console.error(err));
db.on("connected", () => console.log("mongo connected!"));
db.on("disconnected", () => console.log("mongo disconnected"));

const {Schema, model} = mongoose;

module.exports = {db, Schema, model}