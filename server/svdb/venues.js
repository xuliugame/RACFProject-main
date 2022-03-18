const mysql = require('mysql');

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

let venues = {};

/**
 * Get all venues
 * 
 * @returns {all_venues} that are in the DB
 */
venues.all = () => {
    return new Promise( (resolve,reject) => {
        pool.query('select * from venues', (err,results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
};

/**
 * Get one singular venue
 * @param {venue_id} id 
 * 
 * @returns {venue_obj} selected based on it's id.
 */
venues.one = (id) => {
    return new Promise( (resolve,reject) => {
        pool.query('select * from venues where id = ?', id, (err,results) => {
            if(err){
                return reject(err);
            }
            return resolve(results[0]);
        });
    });
}

/**
 * Get all venues associated with partner ID
 * 
 * @param {partner_id} id 
 * @returns {venue_obj} selected based on it's id.
 */
 venues.partner = (id) => {
    return new Promise( (resolve,reject) => {
        pool.query('select * from venues where partner_id = ?', id, (err,results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
}

/**
 * Updates a single field of an venue
 * @param {venue_id} id of the venue you're updating.
 * @param {venue_field} field to update.
 * @param {venue_value} value to give the updated row. 
 * 
 * @returns {rows_updated} row that has been updated.
 */
venues.update = (_id,_field,value) => {
    let id = parseInt(_id);
    let field;
    switch(_field){
        default:
            field="";
            break;
        case "title":
            field="title";
            break;
        case "image":
            field="image";
            break;
        case "about":
            field="about";
            break;
        case "address":
            field="address";
            break;
        case "description":
            field="description";
            break;
        case "phone_number":
            field="phone_number";
            break;
        case "homepage":
            field="homepage";
            break;
        case "date_id":
            field="date_id";
            break;
        case "motd":
            field="motd";
            break;
        case "partner_id":
            field="partner_id";
            break;
    }
    return new Promise( (resolve,reject) =>{
        pool.query(`update venues set ${field}=? where id=?`, [value,id], (err,results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
}

/**
 * Inserts an venue into the db
 * @param {venue_obj} obj should have all required properties (title,image,about,address,description,phone_number,homepage,date_id,motd)
 * 
 * @returns {rows_updated} number to verify is the row has been entered. If return {value > 0} it worked
 */
venues.insert = (title,image,about,address,description,phone_number,homepage,date_id,motd, _partner_id) => {
    let _date_id       = parseInt(date_id);
    let partner_id    = parseInt(_partner_id);
    return new Promise( (resolve,reject) =>{
        pool.query('insert into venues(title,image,about,address,description,phone_number,homepage,date_id,motd,partner_id) values(?,?,?,?,?,?,?,?,?,?)', [title,image,about,address,description,phone_number,homepage,_date_id,motd,partner_id], (err,results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
}

/**
 * Removes an venue given it's id.
 * @param {venue_id} id 
 * 
 * @returns {rows_updated} number to verify if the row has been deleted. If return {value > 0} it worked
 */
venues.delete = (id) => {
    return new Promise( (resolve,reject) =>{
        pool.query('delete from venues where id=?', [id], (err,results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
}

/**
 * Gets the name of the venue only
 * 
 * @param id 
 */
venues.getOneName = (id) => {
    return new Promise( (resolve,reject) =>{
        pool.query('select title from venues where id=?', [id], (err,results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
}

module.exports = venues;