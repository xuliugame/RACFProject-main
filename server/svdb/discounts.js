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
 * Retrieves the list of available discounts
 * 
 * @returns {all_discounts} that are in the DB
 */
discount.all = () => {
    return new Promise( (resolve,reject) => {
        pool.query('select * from discounts', (err,results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
};

/**
 * Get one singular discount
 * 
 * @param {id} id 
 * @returns {discount_obj} selected based on it's id.
 */
discount.one = (id) => {
    return new Promise( (resolve,reject) => {
        pool.query('select * from discounts where id = ?', id, (err,results) => {
            if(err){
                return reject(err);
            }
            return resolve(results[0]);
        });
    });
}


/**
 * Updates a single field of a type of discount
 * Use this for changing the name of a discount from say 'SNAP' to 'NYS Food Stamps'
 * 
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
        case "name":
            field="name";
            break;
    }
    return new Promise( (resolve,reject) =>{
        pool.query(`update discounts set ${field}=? where id=?`, [value,id], (err,results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
}

/**
 * Inserts a discount into the database
 * 
 * @param {discount_obj} obj should have all required properties (name)
 * @returns {rows_updated} number to verify is the row has been entered. If return {value > 0} it worked
 */
discount.insert = (name) => {

    return new Promise( (resolve,reject) =>{
        pool.query('insert into discounts(name) values(?)', [name], (err,results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
}


/**
 * Removes an discount given it's id
 * 
 * @param {event_id} id 
 * @returns {rows_updated} number to verify if the row has been deleted. If return {value > 0} it worked
 */
discount.delete = (id) => {
    return new Promise( (resolve,reject) =>{
        pool.query('delete from discounts where id=?', [id], (err,results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
}

module.exports = discount;