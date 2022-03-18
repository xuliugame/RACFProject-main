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

let tags_events = {};

tags_events.getAllTagsForEvent = (id) =>{
    return new Promise( (resolve,reject) =>{
        pool.query('select tag_id from tags_events where event_id=?', [id], (err,results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
}

tags_events.insertDependancy = (event_id, tag_id) =>{
    let _event_id = parseInt(event_id);
    let _tag_id = parseInt(tag_id);

    return new Promise( (resolve, reject) =>{
        pool.query('insert into tags_events(event_id,tag_id) values(?,?)', [_event_id,_tag_id], (err,results)=>{
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
}

tags_events.delete = (event_id) =>{
    let _event_id = parseInt(event_id);
    return new Promise( (resolve, reject) =>{
        pool.query('delete from tags_events where event_id=?', [_event_id], (err,results)=>{
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
}

module.exports = tags_events;