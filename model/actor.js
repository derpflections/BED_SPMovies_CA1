//Name: Lee Hong Yi
//Admin Number: 2223010
//Class: DAAA/FT/1B/05

var db = require("./databaseConfig.js")

function bodyChecker(var1, var2) {
    return (var1 == undefined || var1 == "" || var2 == undefined || var2 == "")
}


var storeDB = {
    getActor: (actor_id, callback) => {
        var conn = db.getConnection();
        conn.connect((err) => {
            if (err) {
                console.log(err);
                return callback(err, null)
            } else {
                console.log("Connected to database!")
                var sql = `SELECT actor_id, first_name, last_name FROM actor WHERE actor_id = ?`
                conn.query(sql, actor_id, (err, res) => {
                    conn.end();
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    } else if (res[0] === undefined) {
                        return callback(null, 204)
                    } else {
                        res[0]['actor_id'] = res[0]['actor_id'].toString()
                        return callback(null, res[0])
                    }
                })
            }
        })
    },

    getActorOrder: (limit, offset, callback) => {
        var conn = db.getConnection()
        conn.connect((err) => {
            if (err) {
                console.log(err)
                return callback(err, null)
            } else {
                console.log(`Connected to database!`)
                var sql = `SELECT actor_id, first_name, last_name FROM actor ORDER BY first_name LIMIT ? OFFSET ?`;
                conn.query(sql, [parseInt(limit), parseInt(offset)], (err, res) => {
                    if (err) {
                        console.log(err)
                        return callback(err, null)
                    } else if (bodyChecker(limit, offset)) {
                        return callback(null, 400)
                    } else {
                        for (i = 0; i < res.length; i++) {
                            res[i].actor_id = res[i].actor_id.toString()
                        }
                        return callback(null, res)
                    }
                })
            }
        })
    },

    addActor: (actor_details, callback) => {
        var conn = db.getConnection()
        conn.connect((err) => {
            if (err) {
                console.log(err)
                return callback(err, null)
            } else {
                console.log(`Connected to database!`)
                var sql = `INSERT INTO actor (first_name , last_name) VALUES (?, ?)`
                if (bodyChecker(actor_details.first_name, actor_details.last_name)) {
                    return callback(null, 400)
                } else {
                    conn.query(sql, [actor_details.first_name.toUpperCase(), actor_details.last_name.toUpperCase()], (err, res) => {
                        conn.end()
                        if (err) {
                            console.log(err)
                            return callback(err, null)
                        } else {
                            return callback(null, res)
                        }
                    })
                }
            }
        })
    },

    updateActor: (actor_id, actor_details, callback) => {
        var conn = db.getConnection()
        conn.connect((err) => {
            if (err) {
                console.log(err)
                return callback(err, null)
            } else {
                console.log(`Connected to database!`)
                var sql = `UPDATE actor SET first_name = ? , last_name = ? WHERE actor_id = ?`
                conn.query(sql, [actor_details.first_name, actor_details.last_name, actor_id], (err, res) => {
                    conn.end()
                    if (err) {
                        console.log(err)
                        return callback(err, null)
                    } else if (res.affectedRows == 0){
                        return callback(err, 204)
                    } else {
                        return callback(null, res)
                    }
                })
            }
        })
    },

    deleteActor: (actor_id, callback) => {
        var conn = db.getConnection()
        conn.connect((err) => {
            if (err) {
                console.log(err)
                return callback(err, null)
            } else {
                console.log(`Connected to database!`)
                var sql = `DELETE FROM film_actor WHERE actor_id = ?`
                conn.query(sql, actor_id, (err, res) => {
                    if (err) {
                        console.log(err)
                        return callback(err, null)
                    } else {
                        var sql = `DELETE FROM actor WHERE actor_id = ?`
                        conn.query(sql, actor_id, (err, res) => {
                            conn.end()
                            if (err) {
                                console.log(err)
                                return callback(err, null)
                            } else if (res.affectedRows == 0) {
                                console.log(`Actor not found!`)
                                return callback(null, 204)
                            } else {
                                console.log(res)
                                return callback(null, res)
                            }
                        })
                    }
                })
            }
        })
    },

    getCategory: (category_id, callback) => {
        var conn = db.getConnection()
        conn.connect((err) =>{
            if(err){
                console.log(err)
                return callback(err, null)
            } else {
                console.log(`Connected to database!`)
                var sql = `SELECT f.film_id, f.title, cat.name, f.rating, f.release_year, f.length as duration FROM film f, film_category fc, category cat WHERE f.film_id = fc.film_id AND fc.category_id = cat.category_id AND cat.category_id = ? ORDER BY film_id `
                conn.query(sql, category_id, (err, res) =>{
                    conn.end()
                    if(err){
                        console.log(err)
                        return callback (err, null)
                    } else {
                        return callback(null, res)
                    }
                })
            }
        })
    },

    getPaymentDetails: (customer_id, start_date, end_date, callback) =>{
        var conn = db.getConnection()
        conn.connect((err) =>{
            if(err){
                console.log(err)
                return callback(err, null)
            } else {
                console.log(`Connected to database!`)
                var sql = `SELECT f.title, f.rental_rate AS amount, r.rental_date AS payment_date FROM customer c, inventory i, rental r, film f WHERE i.film_id = f.film_id AND r.customer_id = c.customer_id AND r.inventory_id = i.inventory_id AND c.customer_id = ? AND rental_date > ? AND rental_date < ?`
                conn.query(sql, [customer_id, start_date, end_date], (err, res) =>{
                    conn.end()
                    if(err){
                        console.log(err)
                        return callback(err, null)
                    } else {
                        return callback (null, res)
                    }
                })
            }
        })

    }
}


module.exports = storeDB