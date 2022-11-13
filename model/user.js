var db = require("./databaseConfig.js")


var storeDB = {
    getActor:(callback) => {
        var conn = db.getConnection();
        conn.connect((err) => {
            if(err){
                console.log(err);
                return callback(err, null)
            } else {
                console.log("Connected!")
                var sql = `SELECT * FROM actor`
                conn.query(sql, (err,result) =>{
                    conn.end();
                    if(err){
                        console.log(err);
                        return callback(err, null);
                    } else {
                        console.log(result)
                        return callback (null, result)
                    }
                })
            }
        })
    }
}


module.exports = storeDB