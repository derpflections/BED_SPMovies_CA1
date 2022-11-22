var express = require('express');
var app = express()
var bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({extended: false})
var storeDB = require("../model/actor.js");
var hostname = 'localhost';
var port = 3000;
app.use(bodyParser.json());
app.use(urlencodedParser);


//endpoint 1
app.get("/actors/:actor_id", (req,res) =>{
    var actor_id = req.params.actor_id
    storeDB.getActor(actor_id, (err, result) => {
        if(err){
            res.status(500).json({'error_msg':'Internal Server Error'}); //sends error message in json format
        } else if (result === null) {
            res.status(204).send(`No content. Record of given actor_id cannot be found.`)
            console.log(`No content. Record of given actor_id cannot be found.`) //prints error message to console
        } else {
            res.send(result); //sends result to postman/user.
        }
    })    
})


//endpoint 3
app.post("/actors", (req, res) =>{
    var actor_details = {'first_name' : req.body.first_name,'last_name': req.body.last_name}
    storeDB.addActor(actor_details, (err, result) =>{
        if (err){
            res.status(500).json({'error_msg':'Internal Server Error'}) //sends error message in json format w/ err 500
        } else if (result == 400){
            res.status(400).json({'error_msg':'missing data'}) //sends error msg in json format w/ err 400
        } else {
            res.status(201).json({'actor_id': result.insertId}) //sends successful msg
        }
    })

})


app.listen(port, hostname,() =>{
    console.log(`Store database hosted at http://${hostname}:${port}`)
})