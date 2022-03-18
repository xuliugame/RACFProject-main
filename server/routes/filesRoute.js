const express = require('express');
const svdb    = require('../svdb/file');
const router  = express.Router();

router.get('/files/:email', async (req,res,next)=>{
    try{
        let results = await svdb.one(req.params.email);
        res.json(results);
    }catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

router.get('/files', async (req,res,next)=>{
    try{
        let results = await svdb.all();
        res.json(results);
    }catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

module.exports = router;