const express = require('express');
const svdb    = require('../svdb/grantPortal');
const router  = express.Router();

router.get('/grantPortal', async (req,res,next)=>{
    try{
        let results = await svdb.all();
        res.json(results);
    }catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

router.get('/grantPortal/:id', async (req,res,next)=>{
    try{
        let results = await svdb.one(req.params.id);
        res.json(results);
    }catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

router.post('/grantPortal', async (req,res,next)=>{
    try{
        let results = await svdb.insert(req.body.information);
        res.json(results);
    }catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

router.put('/grantPortal/:id', async (req,res,next)=>{
    try{
        let results = await svdb.update(req.body.id,req.body.field,req.body.value);
        res.json(results);
    }catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

router.delete('/grantPortal/:id', async (req,res,next)=>{
    try{
        let results = await svdb.delete(req.params.id);
        res.json(results);
    }catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});


module.exports = router;