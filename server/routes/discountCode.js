const express = require('express');
const svdb    = require('../svdb/discount_code');
const router  = express.Router();

router.get('/discount-code', async (req,res,next)=>{
    try{
        let results = await svdb.all();
        res.json(results);
    }catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

router.get('/discount-code/:id', async (req,res,next)=>{
    try{
        let results = await svdb.one(req.params.id);
        res.json(results);
    }catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

// get all discount codes from venues with your partner id
router.get('/discount-code/partner/:id', async (req,res,next)=>{
    try{
        let results = await svdb.venue(req.params.id);
        res.json(results);
    }catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

router.post('/discount-code', async (req,res,next)=>{
    try{
        let results = await svdb.insert(req.body.venue_id, req.body.code, req.body.amount);
        res.json(results);
    }catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

router.put('/discount-code/:id', async (req,res,next)=>{
    try{
        let results = await svdb.update(req.body.id,req.body.field,req.body.value);
        res.json(results);
    }catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

router.delete('/discount-code/:id', async (req,res,next)=>{
    try{
        let results = await svdb.delete(req.params.id);
        res.json(results);
    }catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

router.delete('/discount-code/:id/:code/:amount', async (req,res,next)=>{
    try{
        let results = await svdb.deleteSpec(req.params.id, req.params.code, req.params.amount);
        res.json(results);
    }catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});


module.exports = router;