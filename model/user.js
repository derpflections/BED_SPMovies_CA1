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
                        console.log('1')
                        return callback(err, null);
                    } else if (res[0] === undefined){
                        console.log(`No record of given actor_id`)
                        console.log('2')
                        return callback (null, null)
                    } else {
                        console.log(res[0])
                        console.log('3')
                        return callback (null, res[0])
                    }
                })
            }
        })
    }
}


module.exports = storeDB