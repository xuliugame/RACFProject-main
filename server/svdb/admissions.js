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

let admissions = {};

/**
 * Review all special admission name and discount information
 * Ex: If you are from { Golisano Childrens Hospital } your discount is { 20% }
 * 
 * @returns {entries} all entries contained in the table.
 */
admissions.all = () => {
    return new Promise( (resolve,reject) => {
        pool.query('select * from admissions', (err,results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
};

/**
 * Review one special admission entry
 * 
 * @param id 
 * @returns {entry} selected based on it's id.
 */
admissions.one = (id) => {
    return new Promise( (resolve,reject) => {
        pool.query('select * from admissions where id = ?', id, (err,results) => {
            if(err){
                return reject(err);
            }
            return resolve(results[0]);
        });
    });
}

/**
 * Updates a single row of a special admission entry
 * 
 * @param id of the entry you're updating.
 * @param field of the entry you're updating ( name, discount ).
 * @param value to provide the entry you're updating.
 * @returns {rows_updated} number to verify is the row has been entered. If return {value > 0} it worked
 */
admissions.update = (_id,_field,value) => {
    let id = parseInt(_id);
    let field;
    switch(_field){
        default:
            field="";
            break;
        case "name":
            field="name";
            break;
        case "discount":
            field="discount";
            break;
    }
    return new Promise( (resolve,reject) =>{
        pool.query(`update admissions set ${field}=? where id=?`, [value,id], (err,results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
}

/**
 * Inserts a special admission entry into the table
 * 
 * @param name Specified name of the entry you would like to add
 * @param discount numerical value to indicate the entries discount percentage. ( For a 20% discount you should enter 20 in this field )
 * @returns {rows_updated} number to verify is the row has been entered. If return {value > 0} it worked
 */
admissions.insert = (name,discount) => {
    return new Promise( (resolve,reject) =>{
        pool.query('insert into admissions(name,discount) values(?,?)', [name,discount], (err,results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
}

/**
 * Removes an entry from the special admissions table, given it's ID
 * 
 * @param id ID of the entry you would like to delete.
 * @returns {rows_updated} number to verify if the row has been deleted. If return {value > 0} it worked
 */
admissions.delete = (id) => {
    return new Promise( (resolve,reject) =>{
        pool.query('delete from admissions where id=?', [id], (err,results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
}

module.exports = admissions;