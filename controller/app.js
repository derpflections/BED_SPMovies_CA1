//Name: Lee Hong Yi
//Admin Number: 2223010
//Class: DAAA/FT/1B/05


const express = require('express');
const app = express()
const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({extended: false})
const storeDB = require("../model/actor.js");

app.use(bodyParser.json());
app.use(urlencodedParser);


//endpoint 1
app.get("/actors/:actor_id", (req,res) =>{
    var actor_id = req.params.actor_id
    storeDB.getActor(actor_id, (err, result) => {
        if(err){
            res.status(500).json({"error_msg":"Internal Server Error"}); //sends error message in json format
        } else if (result === 204) {
            res.status(204).send(`No content. Record of given actor_id cannot be found.`)
            console.log(`No content. Record of given actor_id cannot be found.`) //prints error message to console
        } else {
            res.status(200).send(result); //sends result to postman/user.
        }
    })    
})

//endpoint 2 
app.get('/actors', (req, res) =>{
    var limit = req.query.limit
    var offset = req.query.offset
    storeDB.getActorOrder(limit, offset, (err, result) =>{
        if(err){
            res.status(500).json({"error_msg":"Internal Server Error"})//sends error message in json format
        } else if (result === 400){
            res.status(500).json({"error_msg":"Internal Server Error"})//sends error message in json format
        } else {
            res.status(200).send(result) //sends result to postman/user
        }
    })
})

//endpoint 3
app.post("/actors", (req, res) =>{
    var actor_details = {'first_name' : req.body.first_name,'last_name': req.body.last_name}
    storeDB.addActor(actor_details, (err, result) =>{
        if (err){
            res.status(500).json({"error_msg":"Internal Server Error"}) //sends error message in json format w/ err 500
        } else if (result == 400){
            res.status(400).json({"error_msg":"missing data"}) //sends error msg in json format w/ err 400
        } else {
            res.status(201).json({"actor_id": result.insertId.toString()}) //sends successful msg
        }
    })

})



module.exports = app