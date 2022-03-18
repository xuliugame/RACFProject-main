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

let tags = {};

/**
 * Get all tags
 * 
 * @returns {all_tags} that are in the DB
 */
tags.all = () => {
    return new Promise( (resolve,reject) => {
        pool.query('select * from tags', (err,results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
};

/**
 * Get one singular tag
 * @param {tag_id} id 
 * 
 * @returns {tag_obj} selected based on it's id.
 */
tags.one = (id) => {
    return new Promise( (resolve,reject) => {
        pool.query('select * from tags where id = ?', id, (err,results) => {
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
tags.update = (_id,_field,value) => {
    let id = parseInt(_id);
    let field;
    switch(_field){
        default:
            field="";
            break;
        case "name":
            field="name";
            break;
    }
    return new Promise( (resolve,reject) =>{
        pool.query(`update tags set ${field}=? where id=?`, [value,id], (err,results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
}

/**
 * Inserts an time into the db
 * @param {tag_obj} obj should have all required properties (name)
 * 
 * @returns {rows_updated} number to verify is the row has been entered. If return {value > 0} it worked
 */
tags.insert = (name) => {
    return new Promise( (resolve,reject) =>{
        pool.query('insert into tags(name) values(?)', [name], (err,results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
}

/**
 * Removes an tag given it's id.
 * @param {tag_id} id 
 * 
 * @returns {rows_updated} number to verify if the row has been deleted. If return {value > 0} it worked
 */
tags.delete = (id) => {
    return new Promise( (resolve,reject) =>{
        pool.query('delete from tags where id=?', [id], (err,results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
}

module.exports = tags;