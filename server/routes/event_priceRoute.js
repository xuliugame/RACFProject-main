const express = require('express');
const svdb    = require('../svdb/event_price');
const router  = express.Router();

router.get('/event-price/:id', async (req,res,next)=>{
    try{
        let results = await svdb.getAllTimesForEvent(req.params.id);
        res.json(results);
    }catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

router.post('/event-price/', async (req,res,next)=>{
    try{
        let results = await svdb.insertDependancy(req.body.event_id, req.body.price_id);
        res.json(results);
    }catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

router.delete('/event-price/:id', async (req,res,next)=>{
    try{
        let results = await svdb.delete(req.params.id);
        res.json(results);
    }catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});


module.exports = router;