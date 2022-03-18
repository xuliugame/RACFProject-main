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

let venue_price = {};

venue_price.getAllPricesForVenue = (id) =>{
    return new Promise( (resolve,reject) =>{
        pool.query('select price_id from venue_price where venue_id=?', [id], (err,results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
}

venue_price.insertDependancy = (venue_id, price_id) =>{
    let _venue_id = parseInt(venue_id);
    let _price_id = parseInt(price_id);

    return new Promise( (resolve, reject) =>{
        pool.query('insert into venue_price(venue_id,price_id) values(?,?)', [_venue_id,_price_id], (err,results)=>{
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
}

venue_price.deleteWhereId = (id) =>{
    let _id = parseInt(id);
    return new Promise( (resolve, reject) =>{
        pool.query('delete from venue_price where venue_id = ?', [_id], (err,results)=>{
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
}

module.exports = venue_price;