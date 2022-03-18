const express = require('express');
const svdb    = require('../svdb/admissions');
const router  = express.Router();

router.get('/admissions', async (req,res,next)=>{
    try{
        let results = await svdb.all();
        res.json(results);
    }catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

router.get('/admissions/:id', async (req,res,next)=>{
    try{
        let results = await svdb.one(req.params.id);
        res.json(results);
    }catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

router.post('/admissions', async (req,res,next)=>{
    try{
        let results = await svdb.insert(req.body.name, req.body.discount);
        res.json(results);
    }catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

router.put('/admissions/:id', async (req,res,next)=>{
    try{
        let results = await svdb.update(req.body.id,req.body.field,req.body.value);
        res.json(results);
    }catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

router.delete('/admissions/:id', async (req,res,next)=>{
    try{
        let results = await svdb.delete(req.params.id);
        res.json(results);
    }catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});


module.exports = router;