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

let price = {};

/**
 * Review all pricing information
 * Ex: { General Admission } price for entering this venue is { 15 }
 * 
 * @returns {entries} all entries contained in the table.
 */
price.all = () => {
    return new Promise( (resolve,reject) => {
        pool.query('select * from price', (err,results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
};

/**
 * Review one price entry
 * 
 * @param id 
 * @returns {entry} selected based on it's id.
 */
price.one = (id) => {
    return new Promise( (resolve,reject) => {
        pool.query('select * from price where id = ?', id, (err,results) => {
            if(err){
                return reject(err);
            }
            return resolve(results[0]);
        });
    });
}

/**
 * Updates a single row of a price entry
 * 
 * @param id of the entry you're updating.
 * @param field of the entry you're updating ( name,price ).
 * @param value to provide the entry you're updating.
 * @returns {rows_updated} number to verify is the row has been entered. If return {value > 0} it worked
 */
price.update = (_id,_field,value) => {
    let id = parseInt(_id);
    let field;
    switch(_field){
        default:
            field="";
            break;
        case "name":
            field="name";
            break;
        case "price":
            field="price";
            break;
    }
    return new Promise( (resolve,reject) =>{
        pool.query(`update price set ${field}=? where id=?`, [value,id], (err,results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
}

/**
 * Inserts a price entry into the table
 * 
 * @param name Specified name of the entry you would like to add
 * @param price numerical value to indicate the entries price. ( For a $10 entry fee, enter 10 )
 * @returns {rows_updated} number to verify is the row has been entered. If return {value > 0} it worked
 */
price.insert = (name,price) => {
    return new Promise( (resolve,reject) =>{
        pool.query('insert into price(name,price) values(?,?)', [name,price], (err,results) => {
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
price.delete = (id) => {
    return new Promise( (resolve,reject) =>{
        pool.query('delete from price where id=?', [id], (err,results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
}

module.exports = price;