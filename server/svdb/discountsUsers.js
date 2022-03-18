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

let discount = {};

/**
 * Retrieves the list of people with discounts
 * 
 * @returns {all_discounts} that are in the DB
 */
discount.all = () => {
    return new Promise( (resolve,reject) => {
        pool.query('select * from discounts_users', (err,results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
};

/**
 * Gets one emails given discounts
 * 
 * @param {email} email 
 * @returns {discount_obj} selected based on it's email.
 */
discount.one = (email) => {
    return new Promise( (resolve,reject) => {
        pool.query('select * from discounts_users where email = ?', email, (err,results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
}

module.exports = discount;