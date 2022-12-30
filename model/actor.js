//Name: Lee Hong Yi
//Admin Number: 2223010
//Class: DAAA/FT/1B/05

var db = require("./databaseConfig.js")

function bodyChecker(var1, var2) { //used in endpoint 3 to check for missing data
    return (var1 == undefined || var1 == "" || var2 == undefined || var2 == "")
}


var storeDB = {
    //endpoint 1
    getActor: (actor_id, callback) => {
        var conn = db.getConnection();
        conn.connect((err) => { //establishes connection with database
            if (err) {
                console.log(err);
                return callback(err, null) //returns null response if error is present
            } else {
                console.log("Connected to database!")
                var sql = `SELECT actor_id, first_name, last_name FROM actor WHERE actor_id = ?` //retreives actor_id, first_name and last_name from the table for specific actor
                conn.query(sql, actor_id, (err, res) => {
                    conn.end(); //ends connection
                    if (err) {
                        console.log(err);
                        return callback(err, null); // returns null response if error is present
                    } else if (res[0] === undefined) {
                        return callback(null, 204) //sends error code 204 back to app.js
                    } else {
                        res[0]['actor_id'] = res[0]['actor_id'].toString() //converts the actor_id to a string 
                        return callback(null, res[0]) //removes the square brackets from the response
                    }
                })
            }
        })
    },

    //endpoint 2
    getActorOrder: (limit, offset, callback) => {
        if (limit == "" || limit == undefined) {
            limit = 20 //sets limit to default (20) if value is empty or not provided
        }

        if (offset == "" || offset == undefined) {
            offset = 0 //sets offset to default (0) if value is empty or not provided
        }

        var conn = db.getConnection()
        conn.connect((err) => { //establishes connection with database
            if (err) {
                console.log(err)
                return callback(err, null) //returns null if error is present
            } else {
                console.log(`Connected to database!`)
                var sql = `SELECT actor_id, first_name, last_name FROM actor ORDER BY first_name LIMIT ? OFFSET ?`; //retreives actor_id, first_name and last_name with a the limit and offset set by the request.
                conn.query(sql, [parseInt(limit), parseInt(offset)], (err, res) => {
                    if (err) {
                        console.log(err)
                        return callback(err, null) // returns null response if error is present
                    } else {
                        for (i = 0; i < res.length; i++) {
                            res[i].actor_id = res[i].actor_id.toString() //converts the actor_id of all actors returned into a string
                        }
                        return callback(null, res) // sends response back to the front end
                    }
                })
            }
        })
    },

    //endpoint 3
    addActor: (actor_details, callback) => {
        var conn = db.getConnection()
        conn.connect((err) => {  //establishes connection with database
            if (err) {
                console.log(err)
                return callback(err, null) //returns null if error is present.
            } else {
                console.log(`Connected to database!`)
                var sql = `INSERT INTO actor (first_name , last_name) VALUES (?, ?)`
                if (bodyChecker(actor_details.first_name, actor_details.last_name)) {
                    return callback(null, 400) //sends error code 400 back to app.js if data is missing.
                } else {
                    conn.query(sql, [actor_details.first_name.toUpperCase(), actor_details.last_name.toUpperCase()], (err, res) => { //standard email SQL query
                        conn.end()
                        if (err) {
                            console.log(err)
                            return callback(err, null) // returns null response if error is present
                        } else {
                            return callback(null, res) // sends response back to the front end
                        }
                    })
                }
            }
        })
    },


    //endpoint 4
    updateActor: (actor_id, actor_details, callback) => { //UPDATE actor SET first_name = ? , last_name = ? WHERE actor_id = ?
        var conn = db.getConnection()
        conn.connect((err) => { //established connection with database.
            if (err) {
                console.log(err)
                return callback(err, null) //returns null if error is present.
            } else if (actor_details.first_name == "" || actor_details.last_name == "") {
                console.log(`Missing data!`)
                return callback(null, 400) //if data is missing, query is not made, and response is sent directly to the front end.
            } else {
                console.log(`Connected to database!`)

                var sql = `UPDATE actor SET ` //constructs SQL statement and variables to parse based on the body request
                if (actor_details.last_name == undefined) { // if the last name is not parsed in, only the first_name is added to the statement.
                    sql += `first_name = ?`
                    varToUse = [actor_details.first_name, actor_id] //consturcts the array of variables to parse.
                } else if (actor_details.first_name == undefined) { //  if the first name if not parsed, only the last_name is added to the statement.
                    sql += `last_name = ?`
                    varToUse = [actor_details.last_name, actor_id]
                } else { 
                    sql += `first_name = ?, last_name = ?` // if both first_name and last_name are present, add both to the sql statement.
                    varToUse = [actor_details.first_name, actor_details.last_name, actor_id]
                }
                sql += ` WHERE actor_id = ?`
                console.log(sql)

                conn.query(sql, varToUse, (err, res) => { //standard SQL query
                    conn.end()
                    if (err) {
                        console.log(err)
                        return callback(err, null) //returns null if error is present.
                    } else if (res.affectedRows == 0) {
                        return callback(err, 204)
                    } else {
                        return callback(null, res) // sends response back to the front end
                    }
                })
            }
        })
    },

    //endpoint 5
    deleteActor: (actor_id, callback) => {
        var conn = db.getConnection()
        conn.connect((err) => { //established connection with database.
            if (err) {
                console.log(err)
                return callback(err, null) //returns null if error is present.
            } else {
                console.log(`Connected to database!`)
                var sql = `DELETE FROM film_actor WHERE actor_id = ? ; DELETE FROM actor WHERE actor_id = ?`
                conn.query(sql, [actor_id, actor_id], (err, res) => { //standard sql query
                    if (err) {
                        console.log(err)
                        return callback(err, null) //returns null if error is present.
                    } else if (res[1].affectedRows == 0){
                        return callback (err, 204) //sends error code 204 back to app.js if actor_id cannot be found.
                    } else {
                        return callback(null, res) //sends response back to the front end.
                    }
                })
            }
        })
    },

    //endpoint 6
    getCategory: (category_id, callback) => {
        var conn = db.getConnection()
        conn.connect((err) => { //established connection with database.
            if (err) {
                console.log(err)
                return callback(err, null) //returns null if error is present.
            } else {
                console.log(`Connected to database!`)
                var sql = `SELECT f.film_id, f.title, cat.name, f.rating, f.release_year, f.length as duration FROM film f, film_category fc, category cat WHERE f.film_id = fc.film_id AND fc.category_id = cat.category_id AND cat.category_id = ? ORDER BY film_id `
                conn.query(sql, category_id, (err, res) => {
                    conn.end()
                    if (err) {
                        console.log(err)
                        return callback(err, null) //returns null if error is present.
                    } else {
                        return callback(null, res) // sends response back to the front end
                    }
                })
            }
        })
    },

    //endpoint 7
    getPaymentDetails: (customer_id, start_date, end_date, callback) => {
        var conn = db.getConnection()
        conn.connect((err) => { //established connection with database.
            if (err) {
                console.log(err)
                return callback(err, null) //returns null if error is present.
            } else {
                console.log(`Connected to database!`)
                var sql = `SELECT f.title, f.rental_rate AS amount, r.rental_date AS payment_date FROM customer c, inventory i, rental r, film f WHERE i.film_id = f.film_id AND r.customer_id = c.customer_id AND r.inventory_id = i.inventory_id AND c.customer_id = ? AND rental_date > ? AND rental_date < ?`
                conn.query(sql, [customer_id, start_date, end_date], (err, res) => {
                    conn.end()
                    if (err) {
                        console.log(err)
                        return callback(err, null) //returns null if error is present.
                    } else {
                        return callback(null, res) // sends response back to the front end
                    }
                })
            }
        })
    },

    //endpoint 8
    postNewCustomer: (details, address, callback) => {
        if (details.store_id == "" || details.first_name == "" || details.last_name == "" || details.email == "" || address.address_line1 == "" || address.district == "" || address.city_id == "" || address.postal_code == "" || address.phone == "" || details.store_id == undefined || details.first_name == undefined || details.last_name == undefined || details.email == undefined || address.address_line1 == undefined || address.district == undefined || address.city_id == undefined || address.postal_code == undefined || address.phone == undefined) {
            console.log(`Missing data!`)
            return callback(null, 400) //sends error code 400 back to app.js if data is missing.
        } else {
            var conn = db.getConnection()
            conn.connect((err) => { //established connection with database.
                if (err) {
                    console.log(err) 
                    return callback(err, null) //returns null if error is present.
                } else {
                    console.log(`Connected to database!`)
                    var sql = `SELECT * FROM customer WHERE email = ? ; SELECT * FROM city WHERE city_id = ?`
                    conn.query(sql, [details.email, address.city_id], (err, res) => { // this query checks if the email is already present in the system.
                        if (err) {
                            console.log(err)
                            return callback(err, null) //returns null if error is present.
                        } else if (res[0].length != 0) { // this executes if the customer email is already present in the database.
                            console.log(`Duplicate email detected!`)
                            return callback(null, 1062)
                        } else if (res[1].length == 0){ // this executs if the city is not present in database.
                            console.log(`City ID does not exist in database!`)
                            return callback(null, 400)
                        } else {
                            var sql = `INSERT INTO address (address, address2, district, city_id, postal_code, phone) VALUES (?,?,?,?,?,?)` // this query inserts address into the system
                            conn.query(sql, [address.address_line1, address.address_line2, address.district, address.city_id, address.postal_code, address.phone], (err, res) => { 
                                if (err) {
                                    console.log(err)
                                    return callback(err, null) //returns null if error is present.
                                } else {
                                    newAddrId = res.insertId //takes address id for the next query
                                    var sql = `INSERT INTO customer (store_id, first_name, last_name, email, address_id) VALUES (?,?,?,?,?)` //this query inserts the customer details into the system.
                                    conn.query(sql, [details.store_id, details.first_name, details.last_name, details.email, newAddrId], (err, res) => {
                                        conn.end()
                                        if (err) {
                                            if (err.errno == 1062) { //this clause executes if the email is already present in the system. (second layer of detection)
                                                return callback(null, 1062) //returns error w/ code 1062.
                                            } else {
                                                return callback(err, null) //returns null if error is present.
                                            }
                                        } else {
                                            return callback(null, res) // sends response back to the front end
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    },

    //endpoint 9
    postNewLocation: (country, city, callback) => {
        if (country == "" || country == undefined || city == "" || country == undefined) { // this if clause checks if there is missing data.
            console.log(`Missing data!`)
            return callback(null, 400)
        } else {
            var conn = db.getConnection()
            conn.connect((err) => { //established connection with database.
                if (err) {
                    console.log(err)
                    return callback(err, null) //returns null if error is present.
                } else {
                    var sql = `SELECT country_id, country FROM country WHERE country = ?; SELECT co.country, ci.city FROM country co, city ci WHERE co.country_id = ci.country_id AND country = ? AND city = ?`
                    conn.query(sql, [country, country, city], (err, res) => { // this query checks if the geographic location is already present in the system.
                        if (res[1].length != 0) {
                            console.log(`Location already present in system!`)
                            return callback(null, 409)  //sends error code 409 to app.js.
                        } else {
                            if (err) {
                                console.log(err)
                                return callback(err, null) //returns null if error is present.
                            } else {
                                console.log(res[0].length)
                                if (res[0].length == 0) { //this statement checks if the country was already present in the system, by taking the index 0 response frm the above multiline query.
                                    sql = `INSERT INTO country (country) VALUES (?)` //this statement inserts a new country if not present.
                                    conn.query(sql, country, (err, res) => {
                                        countryId = res[0].insertId
                                        if (err) {
                                            console.log(err)
                                            return callback(err, null) //returns null if error is present.
                                        } else {
                                            sql = `INSERT INTO city (city, country_id) VALUES (?, ?)` //this statement inserts the city into the database w/ assoc. country_id
                                            conn.query(sql, [city, countryId], (err, res) => {
                                                conn.end()
                                                cityId = res.insertId
                                                if (err) {
                                                    console.log(err)
                                                    return callback(err, null) //returns null if error is present.
                                                } else { 
                                                    return callback(null, [res, cityId, countryId]) // sends response back to the front end
                                                }
                                            })
                                        }
                                    })
                                } else { //this statement executes if the country is not present into the db.
                                    countryId = res[0][0].country_id
                                    sql = `INSERT INTO city (city, country_id) VALUES (?, ?)` //this statement inserts the city into the db w/ assoc. country id
                                    conn.query(sql, [city, countryId], (err, res) => {
                                        conn.end()
                                        cityId = res.insertId
                                        if (err) {
                                            console.log(err)
                                            return callback(err, null) //returns null if error is present.
                                        } else {
                                            return callback(null, [res, cityId, countryId]) // sends response back to the front end
                                        }
                                    })
                                }
                            }
                        }
                    })
                }
            })
        }
    },

    //endpoint 10
    postNewStaff: (details, address, callback) => {
        if (details.first_name == undefined || details.last_name == undefined || details.store_id == undefined || details.active == undefined || details.username == undefined || address.address_line1 == undefined || address.district == undefined || address.city_id == undefined || address.phone == undefined || details.first_name == "" || details.last_name == "" || details.store_id == "" || details.active == "" || details.username == "" || address.address_line1 == "" || address.district == "" || address.city_id == "" || address.phone == ""){
            console.log(`Missing data!`) //this clause checks if there is any missing data.
            return callback (null, 400)
        } else {
        var conn = db.getConnection()
        conn.connect((err) =>{ //established connection with database.
            if (err){
                console.log(err)
                return callback (err, null) //returns null if error is present.
            } else {
                var sql = `SELECT * FROM staff WHERE email = ? `
                conn.query(sql, [details.email], (err, res) =>{ //this query checks if the staff email is already present in the system.
                    if (err){
                        console.log(err)
                        return callback (err, null) //returns null if error is present.
                    } else if (res.length != 0){
                        return callback (err, 409) //returns error 409 to app.js
                    } else {
                        var sql = `SELECT * FROM address WHERE address = ? AND address2 = ? AND district = ? AND city_id = ? AND postal_code = ? AND phone = ?` //this query checks if the address is already present in the database.
                        conn.query(sql, [address.address_line1, address.address_line2, address.district, address.city_id, address.postal_code, address.phone], (err, res) =>{
                            if (err){
                                console.log(err)
                                return callback (err, null) //returns null if error is present.
                            } else {
                                if (res.length == 0){ //this statement executes if the address is NOT present in the system.
                                    sql = `INSERT INTO address (address, address2, district, city_id, postal_code, phone) VALUES (?, ?, ?, ?, ?, ?)` //this query adds the address to the database.
                                    conn.query(sql, [address.address_line1, address.address_line2, address.district, address.city_id, address.postal_code, address.phone], (err, res) =>{
                                        newAddressId = res.insertId //stores the added address id.
                                        if (err){
                                            console.log(err)
                                            return callback(err, null) //returns null if error is present.
                                        } else {
                                            var sql = `INSERT INTO staff (first_name, last_name, address_id, email, store_id, active, username, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)` //this next query adds the staff details to the table.
                                            conn.query(sql, [details.first_name, details.last_name, newAddressId, details.email, details.store_id, details.active, details.username, details.password], (err, res) =>{
                                                conn.end()
                                                if (err){
                                                    console.log(err)
                                                    return callback(err, null) //returns null if error is present.
                                                } else {
                                                    return callback(null, res) // sends response back to the front end
                                                }
                                        })}
                                        }
                                    )
                                } else { //this statement executs if the address is present in the system
                                    var sql = `INSERT INTO staff (first_name, last_name, address_id, email, store_id, active, username, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)` // this next query addsd the staff details into the database.
                                    var addressId = res[0].address_id
                                    conn.query(sql, [details.first_name, details.last_name, addressId, details.email, details.store_id, details.active, details.username, details.password], (err, res) =>{
                                        conn.end()
                                        if (err){
                                            console.log(err)
                                            return callback(err, null) //returns null if error is present.
                                        } else {
                                            return callback(null, res) // sends response back to the front end
                                        }
                                })
                                }
                        }
                        })
                    }
                })
        }
        })
    }}
}


module.exports = storeDB