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

let event_price = {};

event_price.getAllTimesForEvent = (id) =>{
    return new Promise( (resolve,reject) =>{
        pool.query('select price_id from event_price where event_id=?', [id], (err,results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
}


event_price.insertDependancy = (event_id, price_id) =>{
    let _event_id = parseInt(event_id);
    let _price_id = parseInt(price_id);

    return new Promise( (resolve, reject) =>{
        pool.query('insert into event_price(event_id,price_id) values(?,?)', [_event_id,_price_id], (err,results)=>{
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
}

event_price.delete = (event_id) =>{
    let _event_id = parseInt(event_id);
    return new Promise( (resolve, reject) =>{
        pool.query('delete from event_price where event_id=?', [_event_id], (err,results)=>{
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
}
module.exports = event_price;