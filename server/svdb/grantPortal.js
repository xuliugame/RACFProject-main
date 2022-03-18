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

let grant = {};

/**
 * Shows you the grant portal information to be displayed
 * 
 * @returns {all_grantInfo} that are in the DB
 */
grant.all = () => {
    return new Promise( (resolve,reject) => {
        pool.query('select * from grant_portal', (err,results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
};

/**
 * Get one single row of grant portal information ( typically only has one row )
 * 
 * @param {grant_portal_id} id 
 * @returns {grant_portal_obj} selected based on it's id.
 */
grant.one = (id) => {
    return new Promise( (resolve,reject) => {
        pool.query('select * from grant_portal where id = ?', id, (err,results) => {
            if(err){
                return reject(err);
            }
            return resolve(results[0]);
        });
    });
}


/**
 * Updates a single field of a grant information row.
 * 
 * @param {id} id of the row you're updating.
 * @param {field} field to update.
 * @param {value} value to give the updated row. 
 * 
 * @returns {rows_updated} row that has been updated.
 */
grant.update = (_id,_field,value) => {
    let id = parseInt(_id);
    let field;
    switch(_field){
        default:
            field="";
            break;
        case "information":
            field="information";
            break;
    }
    return new Promise( (resolve,reject) =>{
        pool.query(`update grant_portal set ${field}=? where id=?`, [value,id], (err,results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
}

/**
 * Inserts information about the grant portal into the database.
 * 
 * @param {grant_portal_obj} obj should have all required properties (information)
 * 
 * @returns {rows_updated} number to verify is the row has been entered. If return {value > 0} it worked
 */
grant.insert = (information) => {

    return new Promise( (resolve,reject) =>{
        pool.query('insert into grant_portal(information) values(?)', [information], (err,results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
}


/**
 * Removes a row of information pertaining to the grant portal
 * Use this method to replace what information the grant portal provides.
 * 
 * @param {grant_portal_id} id 
 * 
 * @returns {rows_updated} number to verify if the row has been deleted. If return {value > 0} it worked
 */
grant.delete = (id) => {
    return new Promise( (resolve,reject) =>{
        pool.query('delete from grant_portal where id=?', [id], (err,results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
}

module.exports = grant;