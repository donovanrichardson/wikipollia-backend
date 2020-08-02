// const mongoConfigObject = { useNewUrlParser: true, useUnifiedTopology: true }; //Config option to eliminate deprecation warnings

// ///////////////////////////
// //CONNECT TO DATABASE
// ///////////////////////////
// // Code for connecting to our mongo database
// mongoose.connect(mongoURI, mongoConfigObject, () => {
//   console.log("CONNECTED TO MONGO");
// });

// ////////////////////////////
// //CONNECTION MESSAGING
// ///////////////////////////
// //Building in messages so we know when our database connection changes
// db.on("error", (err) => console.log(err.message + " is Mongod not running?"));
// db.on("connected", () => console.log("mongo connected!"));
// db.on("disconnected", () => console.log("mongo disconnected"));