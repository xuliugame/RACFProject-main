const express = require('express');
const svdb    = require('../svdb/venues');
const router  = express.Router();

router.get('/venues', async (req,res,next)=>{
    try{
        let results = await svdb.all();
        res.json(results);
    }catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

router.get('/venues/:id', async (req,res,next)=>{
    try{
        let results = await svdb.one(req.params.id);
        res.json(results);
    }catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

router.get('/venues/one/:id', async (req,res,next)=>{
    try{
        let results = await svdb.getOneName(req.params.id);
        res.json(results);
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});

router.get('/venues/partner/:id', async (req,res,next)=>{
    try{
        let results = await svdb.partner(req.params.id);
        res.json(results);
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});

router.post('/venues', async (req,res,next)=>{
    try{
        let results = await svdb.insert(req.body.title, req.body.image, req.body.about, req.body.address, req.body.description, req.body.phone_number, req.body.homepage, req.body.date_id, req.body.motd, req.body.partner_id);
        res.json(results);
    }catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

router.put('/venues/:id', async (req,res,next)=>{
    try{
        let results = await svdb.update(req.body.id,req.body.field,req.body.value);
        res.json(results);
    }catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

router.delete('/venues/:id', async (req,res,next)=>{
    try{
        let results = await svdb.delete(req.params.id);
        res.json(results);
    }catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});


module.exports = router;