//Dependencies
require("dotenv").config(); //reads .env file environmental variables
const express = require("express"); //Brings in Express Library
const app = express(); //creates express application object
const morgan = require("morgan"); //Brings in Morgan Library
const cors = require("cors"); //Brings in CORS library


//Variables
const PORT = process.env.PORT; //port number for server as defined in environment variables
const NODE_ENV = process.env.NODE_ENV; //"development" or "production"

/////////////////////
// CORS SECURITY CONFIGURATIONS
/////////////////////
// CREATE A WHITELIST OF WHICH WEBSITES CAN MAKE API CALLS TO YOUR SERVER
const whitelist = ["http://localhost:3000/", "http://example2.com"];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(
        new Error("Not allowed by CORS, domain needs to be added to whitelist")
      );
    }
  },
};

/////////////////////
// MIDDLEWARE
////////////////////
//UTILITY FUNCTIONS THAT RUN BEFORE YOUR ROUTES
NODE_ENV === "development" ? app.use(cors()) : app.use(cors(corsOptions)); //ternary operator
// Enables websites in whitelist to make API calls to your server, enables all sites in development
app.use(express.json()); //Turns JSON from post/put/patch requests and converts them into req.body object
app.use(morgan("dev")); // Enables Morgan logging, creating more useful terminal logs while server runs
app.use(express.static("public")); //Allows static serving of files from public folder

//routes
const articleRouter = require('./routes/articleRouter')
const voteRouter = require('./routes/voteRouter')

app.use('/article',articleRouter)
app.use('/vote',voteRouter)

app.get('/',(req, res)=>{
    res.send({hello:'world'})
})

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });