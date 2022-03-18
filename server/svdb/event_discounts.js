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

let event_discounts = {};

event_discounts.getAllDiscountsForEvent = (id) =>{
    return new Promise( (resolve,reject) =>{
        pool.query('select discount_id from event_discounts where event_id=?', [id], (err,results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
}

event_discounts.insertDependancy = (event_id, discount_id, discount_amount) =>{
    let _event_id = parseInt(event_id);
    let _discount_id = parseInt(discount_id);
    let _discount_amount = parseInt(discount_amount);

    return new Promise( (resolve, reject) =>{
        pool.query('insert into event_discounts(event_id,discount_id,discount_amount) values(?,?,?)', [_event_id,_discount_id,_discount_amount], (err,results)=>{
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
}

event_discounts.deleteWhereId = (id) =>{
    let _id = parseInt(id);
    return new Promise( (resolve, reject) =>{
        pool.query('delete from event_discounts where event_id = ?', [_id], (err,results)=>{
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
}

module.exports = event_discounts;