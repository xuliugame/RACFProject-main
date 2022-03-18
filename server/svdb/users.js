const mysql = require('mysql');
const dotenv = require('dotenv').config({ path: './server/svdb/.env'});

const pool = mysql.createPool({
    connectionLimit: 10,
    password: process.env.PASSWORD,
    user: process.env.USER,
    database: process.env.DATABASE,
    host: process.env.HOST,
    connectTimeout  : 60 * 60 * 1000,
    acquireTimeout  : 60 * 60 * 1000,
    timeout         : 60 * 60 * 1000
});

let users = {};

/**
 * Review one users information
 * 
 * @param email Email address of selected user.
 * @returns {entry} selected based on it's email.
 */
users.one = (email) => {
    return new Promise( (resolve,reject) => {
        pool.query('select full_name,address,zipcode from user where email = ?', email, (err,results) => {
            if(err){
                return reject(err);
            }
            return resolve(results[0]);
        });
    });
}

module.exports = users;