const express = require('express');
const svdb    = require('../svdb/users');
const router  = express.Router();

router.get('/users/:email', async (req,res,next)=>{
    try{
        let results = await svdb.one(req.params.email);
        res.json(results);
    }catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

module.exports = router;