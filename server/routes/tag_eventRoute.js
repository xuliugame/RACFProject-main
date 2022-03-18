const express = require('express');
const svdb    = require('../svdb/tags_events');
const router  = express.Router();

router.get('/tags-events/:id', async (req,res,next)=>{
    try{
        let results = await svdb.getAllTagsForEvent(req.params.id);
        res.json(results);
    }catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

router.post('/tags-events/', async (req,res,next)=>{
    try{
        let results = await svdb.insertDependancy(req.body.event_id, req.body.tag_id);
        res.json(results);
    }catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

router.delete('/tags-events/:id', async (req,res,next)=>{
    try{
        let results = await svdb.delete(req.params.id);
        res.json(results);
    }catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

module.exports = router;