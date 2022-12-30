//Name: Lee Hong Yi
//Admin Number: 2223010
//Class: DAAA/FT/1B/05


const express = require('express');
const app = express()
const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const storeDB = require("../model/actor.js");

app.use(bodyParser.json());
app.use(urlencodedParser);


//endpoint 1
app.get("/actors/:actor_id", (req, res) => {
    var actor_id = req.params.actor_id
    storeDB.getActor(actor_id, (err, result) => {
        if (err) {
            res.status(500).json({ "error_msg": "Internal Server Error" }); //sends error message in json format
        } else if (result === 204) {
            res.status(204).send(`No content. Record of given actor_id cannot be found.`)
            console.log(`No content. Record of given actor_id cannot be found.`) //prints error message to console
        } else {
            res.status(200).send(result); //sends result to postman/user.
        }
    })
})

//endpoint 2 
app.get('/actors', (req, res) => {
    var limit = req.query.limit
    var offset = req.query.offset
    storeDB.getActorOrder(limit, offset, (err, result) => {
        if (err) {
            res.status(500).json({ "error_msg": "Internal Server Error" })//sends error message in json format
        } else if (result === 400) {
            res.status(500).json({ "error_msg": "Internal Server Error" })//sends error message in json format
        } else {
            res.status(200).send(result) //sends result to postman/user
        }
    })
})

//endpoint 3
app.post("/actors", (req, res) => {
    var actor_details = { 'first_name': req.body.first_name, 'last_name': req.body.last_name }
    storeDB.addActor(actor_details, (err, result) => {
        if (err) {
            res.status(500).json({ "error_msg": "Internal Server Error" }) //sends error message in json format w/ err 500
        } else if (result == 400) {
            res.status(400).json({ "error_msg": "missing data" }) //sends error msg in json format w/ err 400
        } else {
            res.status(201).json({ "actor_id": result.insertId.toString() }) //sends successful msg
        }
    })
})

//endpoint 4
app.put("/actors/:actor_id", (req, res) => {
    var actor_id = req.params.actor_id
    var actor_details = req.body
    console.log(actor_details)
    storeDB.updateActor(actor_id, actor_details, (err, result) => {
        if (err){
            res.status(500).json({ "error_msg": "Internal server error" })
        } else if (result == 400) {
            res.status(400).json({"error_msg":"missing data"})
        } else if (result == 204) {
            res.status(204).send(`No Content. Record of given actor_id cannot be found.`)
        } else {
            res.status(200).json({ "success_msg": "record updated" })
        }
    })
})

//endpoint 5
app.delete("/actors/:actor_id", (req, res) => {
    var actor_id = req.params.actor_id
    storeDB.deleteActor(actor_id, (err, result) => {
        if (err) {
            res.status(500).json({ "error_msg": "Internal server error" })
        } else if (result == 204) {
            res.status(204).send(`No Content. Record of given actor_id cannot be found.`)
        } else {
            res.status(200).json({ "success_msg": "actor deleted" })
        }
    })
})

//endpoint 6 
app.get("/film_categories/:category_id/films", (req, res) => {
    var category_id = req.params.category_id
    storeDB.getCategory(category_id, (err, result) => {
        if (err) {
            res.status(500).json({ "error_msg": "Internal server error" })
        } else {
            for (i = 0; i < result.length; i++) {
                result[i].release_year = result[i].release_year.toString()
                result[i].duration = result[i].duration.toString()
            }
            res.status(200).json(result)
        }
    })
})

//endpoint 7 
app.get("/customer/:customer_id/payment", (req, res) => {
    var customer_id = req.params.customer_id
    var start_date = req.query.start_date
    var end_date = req.query.end_date
    storeDB.getPaymentDetails(customer_id, start_date, end_date, (err, result) => {
        totalSum = 0
        if (err) {
            res.status(500).json({ "error_msg": "Internal server error" })
        } else {
            for (i = 0; i < result.length; i++){
                totalSum += result[i].amount
                result[i].amount = result[i].amount.toString()
            }
            totalSum = totalSum.toFixed(2)
            if(result.length == 0){
                totalSum = "0"
            }
            res.status(200).json({"rental": result, "total":totalSum})
        }
    })
})

//endpoint 8
app.post("/customers", (req, res) =>{
    var details = req.body
    var address = details.address
    storeDB.postNewCustomer(details, address, (err, result) =>{
        if (err){
            res.status(500).json({ "error_msg": "Internal server error" })
        }else if (result == 400){
            res.status(400).json({"error_msg":"missing data"})
        } else if (result == 1062){
            res.status(409).send({"error_msg":"email already exist"})
        } else {
            res.status(201).json({"customer_id":result.insertId.toString()})
        }
    })
})

//endpoint 9
app.post("/country", (req, res) =>{
    var country = req.body.country
    var city = req.body.city
    storeDB.postNewLocation(country, city, (err, result) =>{
        if (err){
            res.status(500).json({ "error_msg": "Internal server error" })
        } else if (result == 400){
            res.status(400).json({"error_msg":"missing data"})
        } else if (result == 409){
            res.status(409).json({"error_msg":"Geographic location already present in system!"})
        } else {
            res.status(201).json({"cityID":result[1].toString(), "countryID":result[2].toString()})
        }
    })
})

//endpoint 10 => post new staff? (link staff to address to store_id)
app.post("/staff", (req, res) =>{
    var details = req.body
    var address = details.address
    storeDB.postNewStaff(details, address, (err, result) =>{
        if (err){
            res.status(500).json({ "error_msg": "Internal server error" })
        } else if (result == 400){
            res.status(400).json({"error_msg":"missing data"})
        } else {
            res.status(201).json({"insertID":result.insertId
        })
        }
    })    
})




module.exports = app