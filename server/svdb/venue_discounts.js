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

let venue_discounts = {};

venue_discounts.getAllDiscountsForVenue = (id) =>{
    return new Promise( (resolve,reject) =>{
        pool.query('select discount_id from venue_discounts where venue_id=?', [id], (err,results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
}

venue_discounts.getAllDiscountsAmountsForVenue = (id) =>{
    return new Promise( (resolve,reject) =>{
        pool.query('select discount_id,discount_amount from venue_discounts where venue_id=?', [id], (err,results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
}

venue_discounts.insertDependancy = (venue_id, discount_id, discount_amount) =>{
    let _venue_id = parseInt(venue_id);
    let _discount_id = parseInt(discount_id);
    let _discount_amount = parseInt(discount_amount);

    return new Promise( (resolve, reject) =>{
        pool.query('insert into venue_discounts(venue_id,discount_id,discount_amount) values(?,?,?)', [_venue_id,_discount_id,_discount_amount], (err,results)=>{
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
}

venue_discounts.deleteWhereId = (id) =>{
    let _id = parseInt(id);
    return new Promise( (resolve, reject) =>{
        pool.query('delete from venue_discounts where venue_id = ?', [_id], (err,results)=>{
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
}

module.exports = venue_discounts;