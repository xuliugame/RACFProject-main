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

let discountCode = {};

discountCode.all = () => {
    return new Promise( (resolve,reject) => {
        pool.query('select * from discount_code', (err,results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
};

discountCode.one = (id) => {
    return new Promise( (resolve,reject) => {
        pool.query('select * from discount_code where venue_id = ?', id, (err,results) => {
            if(err){
                return reject(err);
            }
            return resolve(results[0]);
        });
    });
}

discountCode.venue = (id) =>{
    return new Promise( (resolve,reject) => {
        pool.query('select venues.id from discount_code inner join venues on discount_code.venue_id = venues.id where partner_id=?;', id, (err,results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
}

discountCode.update = (_id,_field,value) => {
    let id = parseInt(_id);
    let field;
    switch(_field){
        default:
            field="";
            break;
        case "code":
            field="code";
            break;
        case "amount":
            field="amount";
            break;
    }
    return new Promise( (resolve,reject) =>{
        pool.query(`update discount_code set ${field}=? where venue_id=?`, [value,id], (err,results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
}

discountCode.insert = (id,code,amount) => {

    return new Promise( (resolve,reject) =>{
        pool.query('insert into discount_code(venue_id, code, amount) values(?,?,?)', [id,code,amount], (err,results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
}

discountCode.delete = (id) => {
    return new Promise( (resolve,reject) =>{
        pool.query('delete from discount_code where venue_id=?', [id], (err,results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
}

discountCode.deleteSpec = (id,code,amount) => {
    return new Promise( (resolve,reject) =>{
        pool.query('delete from discount_code where venue_id=? and code=? and amount =?', [id,code,amount], (err,results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
}

module.exports = discountCode;