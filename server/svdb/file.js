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

let files = {};

/**
 * Shows you all the files users have uploaded, along with their email associated with the account
 * 
 * @returns {all_rows} that are in the DB
 */
 files.all = () => {
    return new Promise( (resolve,reject) => {
        pool.query('select * from files', (err,results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
};


/**
 * Get one usernames documents which will contain a users email and the files associated with the account
 * 
 * @param {email} email_address of the user 
 * @returns {all_rows} associated with the email.
 */
files.one = (email) => {
    return new Promise( (resolve,reject) => {
        pool.query('select * from files where email = ?', email, (err,results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
}

/**
 * Updates the status of the an email and filename
 * 
 * @param {email} email of the row you're updating.
 * @param {field} field to update. ( Status )
 * @param {value} value to give the updated row. ( pending, verified, rejected ) 
 * 
 * @returns {rows_updated} row that has been updated.
 */
 files.update = (email,_field,value) => {
    let field;
    switch(_field){
        default:
            field="";
            break;
        case "status":
            field="status";
            break;
    }
    return new Promise( (resolve,reject) =>{
        pool.query(`update files set ${field}=? where email=? and filename = ?`, [value,email], (err,results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
}

/**
 * Insert a row into the files table
 * 
 * @param {files_obj} obj should have all required properties (email, filename, status, type)
 * 
 * @returns {rows_updated} number to verify is the row has been entered. If return {value > 0} it worked
 */
files.insert = (email, filename, status, type) => {

    return new Promise( (resolve,reject) =>{
        pool.query('insert into files(email, filename, status, type) values(?,?,?,?)', [email, filename, status, type], (err,results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
}

/**
 * Removes a file uploaded by the user
 * 
 * @param {email, status} primary_key of the db 
 * 
 * @returns {rows_updated} number to verify if the row has been deleted. If return {value > 0} it worked
 */
files.delete = (email, status) => {
    return new Promise( (resolve,reject) =>{
        pool.query('delete from files where email=? and status=?', [email, status], (err,results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
}

module.exports = files;