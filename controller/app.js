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
            res.status(500).json({ "error_msg": "Internal Server Error" }); //sends error message in json format w/ err code 500
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
            res.status(500).json({ "error_msg": "Internal Server Error" })//sends error message in json format w/ err 500
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
            res.status(500).json({ "error_msg": "Internal server error" }) //sends error message in json format w/ error 500
        } else if (result == 400) {
            res.status(400).json({"error_msg":"missing data"}) //sends error message in json format w/ error 400
        } else if (result == 204) {
            res.status(204).send(`No Content. Record of given actor_id cannot be found.`) //sends error message in json format w/ error 204
        } else {
            res.status(200).json({ "success_msg": "record updated" }) //sends successful msg
        }
    })
})

//endpoint 5
app.delete("/actors/:actor_id", (req, res) => {
    var actor_id = req.params.actor_id
    storeDB.deleteActor(actor_id, (err, result) => {
        if (err) {
            res.status(500).json({ "error_msg": "Internal server error" }) //sends error message in json format w/ error 500
        } else if (result == 204) {
            res.status(204).send(`No Content. Record of given actor_id cannot be found.`) //sends error message in json format w/ error 204
        } else {
            res.status(200).json({ "success_msg": "actor deleted" }) //sends successful msg
        }
    })
})

//endpoint 6 
app.get("/film_categories/:category_id/films", (req, res) => {
    var category_id = req.params.category_id
    storeDB.getCategory(category_id, (err, result) => {
        if (err) {
            res.status(500).json({ "error_msg": "Internal server error" }) //sends error message in json format w/ error 500
        } else {
            for (i = 0; i < result.length; i++) { //this for loop converts the release_year and duration of the movies into a string.
                result[i].release_year = result[i].release_year.toString()
                result[i].duration = result[i].duration.toString()
            } 
            res.status(200).json(result) //sends successful msg
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
            res.status(500).json({ "error_msg": "Internal server error" }) //sends error message in json format w/ error 500
        } else {
            for (i = 0; i < result.length; i++){ //this for loop adds the result into a variable, and changes it into a string.
                totalSum += result[i].amount
                result[i].amount = result[i].amount.toString()
            }
            totalSum = totalSum.toFixed(2) //rounds the variable to 2 decimal points
            if(result.length == 0){ // if the length of the result is 0, there is no record for the period, hence the sum is 0.
                totalSum = "0"
            }
            res.status(200).json({"rental": result, "total":totalSum}) //sends successful msg
        }
    })
})

//endpoint 8
app.post("/customers", (req, res) =>{
    var details = req.body
    var address = details.address
    storeDB.postNewCustomer(details, address, (err, result) =>{
        if (err){
            res.status(500).json({ "error_msg": "Internal server error" }) //sends error message in json format w/ error 500
        }else if (result == 400){
            res.status(400).json({"error_msg":"missing data"}) //sends error message in json format w/ error 400
        } else if (result == 1062){
            res.status(409).send({"error_msg":"email already exist"}) //sends error message in json format w/ error 409
        } else {
            res.status(201).json({"customer_id":result.insertId.toString()}) //sends successful msg
        }
    })
})

//endpoint 9
app.post("/country", (req, res) =>{
    var country = req.body.country
    var city = req.body.city
    storeDB.postNewLocation(country, city, (err, result) =>{
        if (err){
            res.status(500).json({ "error_msg": "Internal server error" }) //sends error message in json format w/ error 500
        } else if (result == 400){
            res.status(400).json({"error_msg":"Missing Data!"}) //sends error message in json format w/ error 400
        } else if (result == 409){
            res.status(409).json({"error_msg":"Geographic location already present in system!"}) //sends error message in json format w/ error 409
        } else {
            res.status(201).json({"cityID":result[1].toString(), "countryID":result[2].toString()}) //sends successful msg
        }
    })
})

//endpoint 10 => post new staff? (link staff to address to store_id)
app.post("/staff", (req, res) =>{
    var details = req.body
    var address = details.address
    storeDB.postNewStaff(details, address, (err, result) =>{
        if (err){
            res.status(500).json({ "error_msg": "Internal server error!" }) //sends error message in json format w/ error 500
        } else if (result == 409){
            res.status(409).send({"error_msg":"Staff's e-mail already present in system!"}) //sends error message in json format w/ error 409
        } else if (result == 400){
            res.status(400).json({"error_msg":"Missing Data!"}) //sends error message in json format w/ error 400
        } else {
            res.status(201).json({"insertID":result.insertId.toString()}) //sends successful msg
        }
    })    
})




module.exports = app