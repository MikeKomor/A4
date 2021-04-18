// import express
const express = require("express");
const app = express();

// setup mongo

const mongoose = require("mongoose");

const mongoURL = "mongodb+srv://dbUser:0000@cluster0.1fssi.mongodb.net/db?retryWrites=true&w=majority"
const connectionOptions = {useNewUrlParser: true, useUnifiedTopology: true}

// add Schema
const Schema = mongoose.Schema

const ItemSchema = new Schema({
   name:String,
   rarity:String,
   description:String,
   goldPerTurn:Number
})
const Item = mongoose.model("items", ItemSchema)

// specify the port that your server will run on
const HTTP_PORT = process.env.PORT || 8080;

// list of url endpoints that your server will respond to
app.get("/", (req, res) => { //this is the homepage
 res.send("Welcome to homepage");
})

//this is the items page for api
app.get("/api/items", (req, res) => {
  Item.find().exec().then(
    (results)=>{
      console.log(results)
      res.send(results)
      //res.status(200).send(results)
    }
  ).catch(
    (err) => {
      console.log(error)
      res.status(500).send("Error when getting items from database.")
    }
  )
})


// INSERT
app.post("/api/students", (req, res) => {
    res.status(501).send("Not implemented")
})


// UPDATE BY ID
app.put("/api/students/:sid", (req,res) => {
    res.status(501).send("Not implemented")
})

// DELETE BY ID
app.delete("/api/students/:sid", (req,res) => {
    res.status(501).send("Not implemented")
})


// start the server and output a message if the server started successfully
const onHttpStart = () => {
 console.log(`Server has started and is listening on port ${HTTP_PORT}`)
}

// 1. connect to the db



// 2. AFTER you connect, then you start the express server.
mongoose.connect(mongoURL, connectionOptions).then(
   () => {
        console.log("This worked")
        app.listen(HTTP_PORT, onHttpStart);
   }
).catch(
   (err) => {
       console.log("Error connecting to database")
       console.log(err)
   }
)
