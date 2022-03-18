const express = require('express');
const svdb    = require('../svdb/event_discounts');
const router  = express.Router();

router.get('/event-discounts/:id', async (req,res,next)=>{
    try{
        let results = await svdb.getAllDiscountsForEvent(req.params.id);
        res.json(results);
    }catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

router.post('/event-discounts/', async (req,res,next)=>{
    try{
        let results = await svdb.insertDependancy(req.body.event_id, req.body.discount_id);
        res.json(results);
    }catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

router.delete('/event-discounts/:id', async (req,res,next)=>{
    try{
        let results = await svdb.deleteWhereId(req.params.id);
        res.json(results);
    }catch (err){
        console.log(err);
        res.sendStatus(500);
    }
});

module.exports = router;