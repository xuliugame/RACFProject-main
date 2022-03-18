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

let qr = {};


qr.insert = (_discId, _discAmt, email, _venueID) => {
    let discId  = parseInt(_discId);
    let discAmt = parseFloat(_discAmt);
    let venueID = parseInt(_venueID);

    return new Promise( (resolve,reject) =>{
        pool.query('insert into QRCODE(discId, discAmt, email, venueID) values(?,?,?,?)', [discId, discAmt, email, venueID], (err,results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
}

qr.all = (email) => {
    return new Promise( (resolve,reject) => {
        pool.query('select * from QRCODE where email = ?', email, (err,results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
}

qr.one = (email,_discId,_venueID,_discAmt) => {
    let discId  = parseInt(_discId);
    let discAmt = parseFloat(_discAmt);
    let venueID = parseInt(_venueID);
    return new Promise( (resolve,reject) => {
        pool.query('select * from QRCODE where email = ? and discId = ? and venueID = ? and discAmt = ?', [email,discId,venueID,discAmt], (err,results) => {
            if(err){
                return reject(err);
            }
            return resolve(results[0]);
        });
    });
}

module.exports = qr;