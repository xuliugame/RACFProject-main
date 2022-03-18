const express = require('express');
const svdb    = require('../svdb/price');
const router  = express.Router();

router.get('/price', async (req,res,next)=>{
    try{
        let results = await svdb.all();
        res.json(results);
    }catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

router.get('/price/:id', async (req,res,next)=>{
    try{
        let results = await svdb.one(req.params.id);
        res.json(results);
    }catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

router.post('/price', async (req,res,next)=>{
    try{
        let results = await svdb.insert(req.body.name, req.body.price);
        res.json(results);
    }catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

router.put('/price/:id', async (req,res,next)=>{
    try{
        let results = await svdb.update(req.body.id,req.body.field,req.body.value);
        res.json(results);
    }catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

router.delete('/price/:id', async (req,res,next)=>{
    try{
        let results = await svdb.delete(req.params.id);
        res.json(results);
    }catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});


module.exports = router;