const express = require('express');
const svdb    = require('../svdb/venue_discounts');
const router  = express.Router();

router.get('/venue-discounts/:id', async (req,res,next)=>{
    try{
        let results = await svdb.getAllDiscountsForVenue(req.params.id);
        res.json(results);
    }catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

router.get('/venue-discounts/amount/:id', async (req,res,next)=>{
    try{
        let results = await svdb.getAllDiscountsAmountsForVenue(req.params.id);
        res.json(results);
    }catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

router.post('/venue-discounts/', async (req,res,next)=>{
    try{
        let results = await svdb.insertDependancy(req.body.venue_id, req.body.discount_id);
        res.json(results);
    }catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

router.delete('/venue-discounts/:id', async (req,res,next)=>{
    try{
        let results = await svdb.deleteWhereId(req.params.id);
        res.json(results);
    }catch (err){
        console.log(err);
        res.sendStatus(500);
    }
});

module.exports = router;