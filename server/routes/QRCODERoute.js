const express = require('express');
const svdb    = require('../svdb/QRCODE');
const router  = express.Router();

router.get('/qrcode/:email', async (req,res,next)=>{
    try{
        let results = await svdb.all(req.params.email);
        res.json(results);
    }catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

router.get('/qrcode/:email/:venueID/:discId/:discAmt', async (req,res,next)=>{
    try{
        let results = await svdb.one(req.params.email, req.params.discId, req.params.venueID, req.params.discAmt);
        res.json(results);
    }catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});


router.post('/qrcode', async (req,res,next)=>{
    try{
        //_discId, _discAmt, email, _venueID
        let results = await svdb.insert(req.body.discId, req.body.discAmt, req.body.email, req.body.venueID);
        res.json(results);
    }catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

module.exports = router;