//Name: Lee Hong Yi
//Admin Number: 2223010
//Class: DAAA/FT/1B/05

var db = require("./databaseConfig.js")


var storeDB = {
    getActor:(actor_id, callback) => {
        var conn = db.getConnection();
        conn.connect((err) => {
            if(err){
                console.log(err);
                return callback(err, null)
            } else {
                console.log("Connected to database!")
                var sql = `SELECT actor_id, first_name, last_name FROM actor WHERE actor_id = ?`
                conn.query(sql, actor_id, (err,res) =>{
                    conn.end();
                    if(err){
                        console.log(err);
                        return callback(err, null);
                    } else if (res[0] === undefined){
                        return callback (null, null)
                    } else {
                        res[0]['actor_id'] = res[0]['actor_id'].toString()
                        return callback (null, res[0])
                    }
                })
            }
        })
    },

    getActorOrder: (limit, offset, callback) => {
        var conn = db.getConnection()
        conn.connect((err) => {
            if(err){
                console.log(err)
                return callback(err, null)
            } else {
                console.log(`Connected to database!`)
                var sql = `SELECT actor_id, first_name, last_name FROM actor ORDER BY first_name LIMIT ? OFFSET ?`;
                conn.query (sql, [parseInt(limit), parseInt(offset)], (err, res) =>{
                    if(err){
                        console.log(err)
                        return callback(err, null)
                    } else {
                        for(i = 0 ; i < res.length ; i++){
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
            if(err){ 
                console.log(err)
                return callback(err, null)
            } else {
                console.log(`Connected to database!`)
                var sql = `INSERT INTO actor (first_name , last_name) VALUES (?, ?)`    
                if (actor_details.first_name == '' || actor_details.last_name == '' || actor_details.first_name == undefined || actor_details.last_name == undefined){
                    return callback (null, 400)
                } else {
                    conn.query(sql, [actor_details.first_name.toUpperCase(), actor_details.last_name.toUpperCase()], (err, res) => {
                        conn.end()
                        if(err){
                            console.log(err)
                            return callback (err, null)
                        } else {
                            return callback (null, res)
                        }
                    })
                }
            }
        })
    }
}


module.exports = storeDB