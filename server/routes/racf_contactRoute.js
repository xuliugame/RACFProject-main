const express = require('express');
const svdb    = require('../svdb/racf_contact');
const router  = express.Router();

router.get('/contact', async (req,res,next)=>{
    try{
        let results = await svdb.all();
        res.json(results);
    }catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

router.get('/contact/:id', async (req,res,next)=>{
    try{
        let results = await svdb.one(req.params.id);
        res.json(results);
    }catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

router.post('/contact', async (req,res,next)=>{
    try{
        let results = await svdb.insert(req.body.phone, req.body.fax, req.body.email, req.body.address);
        res.json(results);
    }catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

router.put('/contact/:id', async (req,res,next)=>{
    try{
        let results = await svdb.update(req.body.id,req.body.field,req.body.value);
        res.json(results);
    }catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

router.delete('/contact/:id', async (req,res,next)=>{
    try{
        let results = await svdb.delete(req.params.id);
        res.json(results);
    }catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});


module.exports = router;