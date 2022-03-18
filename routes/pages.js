const express = require('express');
const router = express.Router();

router.get('/events', (req,res)=>{
    res.render('events');
});

router.get('/events/:id', (req,res)=>{
    res.render('event', {
        id: req.params.id
    });
});

router.get('/venues', (req,res)=>{
    res.render('venues');
});

router.get('/venues/:id', (req,res)=>{
    res.render('venue', {
        id: req.params.id
    });
});

router.get('/homepage', (req,res)=>{
    res.render('homepage');
});

router.get('/create', (req,res)=>{
    res.render('create');
});

router.get('/signup', (req,res)=>{
    res.render('signup');
});

router.get('/discountInfo', (req,res)=>{
    res.render('discountInfo');
});

router.get('/grant', (req,res)=>{
    res.render('grantPortal');
});

module.exports = router;