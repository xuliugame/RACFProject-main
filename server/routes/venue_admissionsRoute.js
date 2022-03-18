const express = require('express');
const svdb    = require('../svdb/venue_admissions');
const router  = express.Router();

router.get('/venue-admissions/:id', async (req,res,next)=>{
    try{
        let results = await svdb.getAllAdmissionsForVenue(req.params.id);
        res.json(results);
    }catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

router.post('/venue-admissions/', async (req,res,next)=>{
    try{
        let results = await svdb.insertDependancy(req.body.venue_id, req.body.admissions_id);
        res.json(results);
    }catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

module.exports = router;