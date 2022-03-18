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

let racf_contact = {};

/**
 * Review all contact information
 * Ex: Phone number, email, etc.
 * 
 * @returns {entries} all entries contained in the table.
 */
racf_contact.all = () => {
    return new Promise( (resolve,reject) => {
        pool.query('select * from racf_contact', (err,results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
};

/**
 * Review one contact entry
 * 
 * @param id 
 * @returns {entry} selected based on it's id.
 */
racf_contact.one = (id) => {
    return new Promise( (resolve,reject) => {
        pool.query('select * from racf_contact where id = ?', id, (err,results) => {
            if(err){
                return reject(err);
            }
            return resolve(results[0]);
        });
    });
}

/**
 * Updates a single row of a contact entry
 * 
 * @param id of the entry you're updating.
 * @param field of the entry you're updating ( phone,email,fax,address ).
 * @param value to provide the entry you're updating.
 * @returns {rows_updated} number to verify is the row has been entered. If return {value > 0} it worked
 */
racf_contact.update = (_id,_field,value) => {
    let id = parseInt(_id);
    let field;
    switch(_field){
        default:
            field="";
            break;
        case "phone":
            field="phone";
            break;
        case "fax":
            field="fax";
            break;
        case "email":
            field="email";
            break;
        case "address":
            field="address";
            break;
    }
    return new Promise( (resolve,reject) =>{
        pool.query(`update racf_contact set ${field}=? where id=?`, [value,id], (err,results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
}

/**
 * Inserts a contact entry into the table
 * 
 * @param name Specified name of the entry you would like to add
 * @param price numerical value to indicate the entries price. ( For a $10 entry fee, enter 10 )
 * @returns {rows_updated} number to verify is the row has been entered. If return {value > 0} it worked
 */
racf_contact.insert = (phone,fax,email,address) => {
    return new Promise( (resolve,reject) =>{
        pool.query('insert into racf_contact(phone,fax,email,address) values(?,?,?,?)', [phone,fax,email,address], (err,results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
}

/**
 * Removes an entry from the price table, given it's ID
 * 
 * @param id ID of the entry you would like to delete.
 * @returns {rows_updated} number to verify if the row has been deleted. If return {value > 0} it worked
 */
racf_contact.delete = (id) => {
    return new Promise( (resolve,reject) =>{
        pool.query('delete from racf_contact where id=?', [id], (err,results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
}

module.exports = racf_contact;