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

let events = {};

/**
 * Get all events
 * 
 * @returns {all_events} that are in the DB
 */
events.all = () => {
    return new Promise( (resolve,reject) => {
        pool.query('select * from events', (err,results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
};

/**
 * Get one singular event
 * 
 * @param {event_id} id 
 * @returns {event_obj} selected based on it's id.
 */
events.one = (id) => {
    return new Promise( (resolve,reject) => {
        pool.query('select * from events where id = ?', id, (err,results) => {
            if(err){
                return reject(err);
            }
            return resolve(results[0]);
        });
    });
}

/**
 * Get all events for a given venue id
 * 
 * @param venue_id
 * @returns {all_events} All events associated with the venue_id
 */
events.getEventsWithVenue = (venue_id) =>{
    return new Promise( (resolve, reject) => {
        pool.query('select * from events where venue_id=?', venue_id, (err,results)=>{
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
}

events.getEventsForPartner = (partner_id) =>{
    return new Promise( (resolve, reject) => {
        pool.query('select events.id,events.title,events.image,events.address,events.description,events.venue_id,events.date_id, events.about from events inner join venues on events.venue_id = venues.id where partner_id=?', partner_id, (err,results)=>{
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
}


/**
 * Updates a single field of an event
 * @param {event_id} id of the event you're updating.
 * @param {event_field} field to update.
 * @param {event_value} value to give the updated row. 
 * 
 * @returns {rows_updated} row that has been updated.
 */
events.update = (_id,_field,value) => {
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
        case "address":
            field="address";
            break;
        case "description":
            field="description";
            break;
        case "venue_id":
            field="venue_id";
            break;
        case "date_id":
            field="date_id";
            break;
        case "about":
            field="about";
            break;
    }
    return new Promise( (resolve,reject) =>{
        pool.query(`update events set ${field}=? where id=?`, [value,id], (err,results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
}

/**
 * Inserts an event into the db
 * @param {event_obj} obj should have all required properties (title,image,address,description,venue_id,date_id)
 * 
 * @returns {rows_updated} number to verify is the row has been entered. If return {value > 0} it worked
 */
events.insert = (title,image,address,description,venue_id,date_id,about) => {
    let _venue_id   = parseInt(venue_id);
    let _date_id    = parseInt(date_id);


    return new Promise( (resolve,reject) =>{
        pool.query('insert into events(title,image,address,description,venue_id,date_id,about) values(?,?,?,?,?,?,?)', [title,image,address,description,_venue_id,_date_id,about], (err,results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
}


/**
 * Removes an event given it's id.
 * @param {event_id} id 
 * 
 * @returns {rows_updated} number to verify if the row has been deleted. If return {value > 0} it worked
 */
events.delete = (id) => {
    return new Promise( (resolve,reject) =>{
        pool.query('delete from events where id=?', [id], (err,results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
}

module.exports = events;