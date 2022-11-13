var express = require('express');
var app = express()
var bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({extended: false})
var storeDB = require("../model/user.js");
var hostname = 'localhost';
var port = 3000;


app.use(bodyParser.json());
app.use(urlencodedParser);


app.get("/db", (req,res) =>{
    storeDB.getActor((err, result) => {
        if(!err){
            res.send(result);
        } else {
            res.status(500).send(`overcome your lack of skill lol`)
        }
    })    
})

app.listen(port, hostname,() =>{
    console.log(`Store database hosted at http://${hostname}:${port}`)
})