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

let dates = {};

/**
 * Get all times
 * 
 * @returns {all_times} that are in the DB
 */
dates.all = () => {
    return new Promise( (resolve,reject) => {
        pool.query('select * from dates', (err,results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
};

/**
 * Get one singular time
 * @param {time_id} id 
 * 
 * @returns {time_obj} selected based on it's id.
 */
dates.one = (id) => {
    return new Promise( (resolve,reject) => {
        pool.query('select * from dates where id = ?', id, (err,results) => {
            if(err){
                return reject(err);
            }
            return resolve(results[0]);
        });
    });
}

/**
 * Updates a single field of an time
 * @param {time_id} id of the time you're updating.
 * @param {time_field} field to update.
 * @param {time_value} value to give the updated row. 
 * 
 * @returns {rows_updated} row that has been updated.
 */
dates.update = (_id,_field,value) => {
    let id = parseInt(_id);
    let field;
    switch(_field){
        default:
            field="";
            break;
        case "hours":
            field="hours";
            break;
        case "days":
            field="days";
            break;
        case "date":
            field='date';
            break;
    }
    return new Promise( (resolve,reject) =>{
        pool.query(`update dates set ${field}=? where id=?`, [value,id], (err,results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
}

/**
 * Inserts an time into the db
 * @param {time_obj} obj should have all required properties (title,about,date,capacity,tickets_sold,venue_id)
 * 
 * @returns {rows_updated} number to verify is the row has been entered. If return {value > 0} it worked
 */
dates.insert = (hours,days,date) => {
    return new Promise( (resolve,reject) =>{
        pool.query('insert into dates(hours,days,date) values(?,?,?)', [hours,days,date], (err,results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
}

/**
 * Removes an time given it's id.
 * @param {time_id} id 
 * 
 * @returns {rows_updated} number to verify if the row has been deleted. If return {value > 0} it worked
 */
dates.delete = (id) => {
    return new Promise( (resolve,reject) =>{
        pool.query('delete from dates where id=?', [id], (err,results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
}

module.exports = dates;