const mysql      = require("mysql");
const dotenv = require('dotenv').config({ path: './server/svdb/.env'});

var mysqlConnection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    multipleStatements: true
});


mysqlConnection.connect((err)=>{
    if(!err){
        console.log("Connected");
    }else{
        console.log("Connection failed");
    }
});


module.exports = mysqlConnection;