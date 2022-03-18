const express = require('express');
const svdb    = require('../svdb/venue_price');
const router  = express.Router();

router.get('/venue-price/:id', async (req,res,next)=>{
    try{
        let results = await svdb.getAllPricesForVenue(req.params.id);
        res.json(results);
    }catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

router.post('/venue-price/', async (req,res,next)=>{
    try{
        let results = await svdb.insertDependancy(req.body.venue_id, req.body.price_id);
        res.json(results);
    }catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

router.delete('/venue-price/:id', async (req,res,next)=>{
    try{
        let results = await svdb.deleteWhereId(req.params.id);
        res.json(results);
    }catch (err){
        console.log(err);
        res.sendStatus(500);
    }
});


module.exports = router;