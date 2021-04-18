// import express
const express = require("express");
const app = express();
app.use(express.json())

// setup mongo
const mongoose = require("mongoose");
const mongoURL = "mongodb+srv://dbUser:0000@cluster0.1fssi.mongodb.net/db?retryWrites=true&w=majority"
const connectionOptions = {useNewUrlParser: true, useUnifiedTopology: true}

// add Schema
const Schema = mongoose.Schema

const ItemSchema = new Schema({
   name:
    {
      type: String,
      required: true
    },
   rarity:
   {
     type: String,
     required: true
   },
   description:
   {
     type: String
   },
   goldPerTurn:
   {
     type: Number
   }
}, {
    versionKey: false
})
const Item = mongoose.model("items", ItemSchema)

// specify the port that your server will run on
const HTTP_PORT = process.env.PORT || 8080;

// View all items
app.get("/api/items", (req, res) => {
  Item.find().exec().then(
    (results)=>{
      console.log(results)
      res.status(200).send(results)
    }
  ).catch(
    (err) => {
      console.log(error)
      res.status(500).send("Error when getting items from database.")
    }
  )
})

// View a single item
app.get("/api/items/:item_name", (req, res) => {
  console.log(`Searching for: ${req.params.item_name}`)
      // 2. Then you make the query to the database
      // --  this is mongoose syntax, its not express, its not javascript
      Item.findOne({name : req.params.item_name}).exec()
          .then(
              (result) => {
                  if (result === null) {
                      const msg = {
                          statusCode:404,
                          msg: "Record not found"
                      }
                      res.status(404).send(msg)
                  }
                  else {
                      console.log("item found")
                      res.status(200).send(result)
                  }

              }
          ).catch(
              (err) => {
                  console.log(`Error`)
                  console.log(err)
                  const msg = {
                      statusCode:500,
                      msg: "Error when getting item from database."
                  }
                  res.status(500).send(msg)

              }
          )
  })

// Insert
app.post("/api/items", (req, res) => {

    console.log("I received this from the client:")
    console.log(req.body)

    Item.create(req.body).then(
        (result) => {
            res.status(201).send("Insert success!")
        }
    ).catch(
        (err) => {
            console.log(`Error`)
            console.log(err)
            const msg = {
                statusCode:500,
                msg: "Error. 'name' and 'rarity' are required to create an item."
            }
            res.status(500).send(msg)
        }
    )
})

// Delete by Name
app.delete("/api/items/:item_name", (req,res) => {
    Item.findOneAndDelete({name : req.params.item_name}).exec()
      .then(
            (deletedItem) => {
                if (deletedItem === null) {
                    console.log("Could not find the item to delete")
                }
                else {
                    console.log(deletedItem)
                    res.status(200).send(`Delete of the following item successful: ${deletedItem}`)
                }
            }
        ).catch(
            (err) => {
                console.log(err)
                const msg = {
                    statusCode:500,
                    msg: "Error when getting item from database."
                }
                res.status(500).send(msg)
            }
        )
})

// Update by ID
app.put("/api/items/:item_id", (req,res) => {
    res.status(501).send("Not implemented")
})

//This is the default 404 function if the user trys to do something else.
app.use(function (req, res, next) {
  res.status(404).send("Page not found.")
})

const onHttpStart = () => {
 console.log(`Server has started and is listening on port ${HTTP_PORT}`)
}

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
