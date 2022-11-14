var express = require('express');
var app = express()
var bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({extended: false})
var storeDB = require("../model/user.js");
var hostname = 'localhost';
var port = 3000;
const err = {error_msg:"Internal Server Error"}

app.use(bodyParser.json());
app.use(urlencodedParser);


app.get("/actors/:actor_id", (req,res) =>{
    var actor_id = req.params.actor_id
    storeDB.getActor(actor_id, (err, result) => {
        console.log(result)
        if(err){
            res.status(500).send(`Internal server error`)
        } else if (result === null) {
            res.status(204).send(`No content. Record of given actor_id cannot be found.`)
            console.log(`No content. Record of given actor_id cannot be found.`)
        } else {
            res.send(result);
        }
    })    
})

app.listen(port, hostname,() =>{
    console.log(`Store database hosted at http://${hostname}:${port}`)
})