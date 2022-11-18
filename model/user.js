var db = require("./databaseConfig.js")


var storeDB = {
    getActor:(actor_id, callback) => {
        var conn = db.getConnection();
        conn.connect((err) => {
            if(err){
                console.log(err);
                return callback(err, null)
            } else {
                console.log("Connected!")
                var sql = `SELECT actor_id, first_name, last_name FROM actor WHERE actor_id = ?`
                conn.query(sql, actor_id, (err,res) =>{
                    conn.end();
                    if(err){
                        console.log(err);
                        return callback(err, null);
                    } else if (res[0] === undefined){
                        return callback (null, null)
                    } else {
                        console.log(res[0])
                        return callback (null, res[0])
                    }
                })
            }
        })
    }
}


module.exports = storeDB