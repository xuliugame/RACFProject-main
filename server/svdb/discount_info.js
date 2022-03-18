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

let discount = {};

/**
 * Get all discount_info rows
 * 
 * @returns {all_events} that are in the DB
 */
discount.all = () => {
    return new Promise( (resolve,reject) => {
        pool.query('select * from discount_info', (err,results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
};

/**
 * Get one singular discount_info row
 * 
 * @param {event_id} id 
 * @returns {event_obj} selected based on it's id.
 */
discount.one = (id) => {
    return new Promise( (resolve,reject) => {
        pool.query('select * from discount_info where id = ?', id, (err,results) => {
            if(err){
                return reject(err);
            }
            return resolve(results[0]);
        });
    });
}


/**
 * Updates a single field of an question, answer or description
 * @param {id} id of the row you're updating.
 * @param {field} field to update.
 * @param {value} value to give the updated row. 
 * 
 * @returns {rows_updated} row that has been updated.
 */
discount.update = (_id,_field,value) => {
    let id = parseInt(_id);
    let field;
    switch(_field){
        default:
            field="";
            break;
        case "descr":
            field="descr";
            break;
        case "question":
            field="image";
            break;
        case "answer":
            field="answer";
            break;
    }
    return new Promise( (resolve,reject) =>{
        pool.query(`update discount_info set ${field}=? where id=?`, [value,id], (err,results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
}

/**
 * Inserts an question and answer into the db
 * @param {event_obj} obj should have all required properties (title,image,address,description,venue_id,date_id)
 * 
 * @returns {rows_updated} number to verify is the row has been entered. If return {value > 0} it worked
 */
discount.insert = (question,answer) => {

    return new Promise( (resolve,reject) =>{
        pool.query('insert into discount_info(question,answer) values(?,?)', [question,answer], (err,results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
}


/**
 * Removes an discount_info given it's id.
 * @param {event_id} id 
 * 
 * @returns {rows_updated} number to verify if the row has been deleted. If return {value > 0} it worked
 */
discount.delete = (id) => {
    return new Promise( (resolve,reject) =>{
        pool.query('delete from discount_info where id=?', [id], (err,results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
}

module.exports = discount;