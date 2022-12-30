//Name: Lee Hong Yi
//Admin Number: 2223010
//Class: DAAA/FT/1B/05

var mysql = require('mysql');

var dbconnect = {
    getConnection: function(){
        var conn = mysql.createConnection({
            host:"localhost",
            user: "bed_dvd_root",
            password: "pa$$woRD123",
            database:"bed_dvd_db",
            multipleStatements: true //allows multiline queries to be made.
        })
        return conn;
    }
};

module.exports = dbconnect