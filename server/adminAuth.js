const mysqlConnection = require("./svdb/mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

verifyAdmin = (req, res, next)=>{

    try{
        let cookieStr = req.headers.cookie;
        let token;
        if(req.headers.cookie.includes(';')){
            cookieStr = cookieStr.split(';')[1];
            token = cookieStr.split('=')[1];
        }else{
            token = cookieStr.split('=')[1];
        }
        
        
        mysqlConnection.query('SELECT role FROM user WHERE token=?', [token], async (error, results)=>{
            if( error ){
                return res.json({ name: 'NULL' });
            }
            
            if( results[0].role != 3){
                return res.status('403').send('You must be an admin to access this page.');
            }

            next();
        });
    }
    catch(e){
        console.log(e);
        return res.json('NULL');
    }
}

verifyPartner = (req, res, next)=>{

    try{
        let cookieStr = req.headers.cookie;
        let token;
        if(req.headers.cookie.includes(';')){
            cookieStr = cookieStr.split(';')[1];
            token = cookieStr.split('=')[1];
        }else{
            token = cookieStr.split('=')[1];
        }
        
        
        mysqlConnection.query('SELECT role,user_id FROM user WHERE token=?', [token], async (error, results)=>{
            if( error ){
                return res.json({ name: 'NULL' });
            }
            
            if( results[0].role != 2){
                return res.status('403').send('You must be a partner to access this page.');
            }

            req.user_id = results[0].user_id;
            next();
        });
    }
    catch(e){
        console.log(e);
        return res.json('NULL');
    }
}

module.exports = {
    verifyAdmin,
    verifyPartner
}