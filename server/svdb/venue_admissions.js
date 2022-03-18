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

let venue_admissions = {};

venue_admissions.getAllAdmissionsForVenue = (id) =>{
    return new Promise( (resolve,reject) =>{
        pool.query('select admissions_id from venue_admissions where venue_id=?', [id], (err,results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
}

venue_admissions.insertDependancy = (venue_id, admissions_id) =>{
    let _venue_id = parseInt(venue_id);
    let _admissions_id = parseInt(admissions_id);

    return new Promise( (resolve, reject) =>{
        pool.query('insert into venue_admissions(venue_id,admissions_id) values(?,?)', [_venue_id,_admissions_id], (err,results)=>{
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
}

module.exports = venue_admissions;