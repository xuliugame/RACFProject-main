const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

router.post('/register', authController.register );

router.post('/login', authController.login );

router.post('/verify', authController.verify );

router.post('/updateDiscount', authController.updateDiscount );

router.post('/createVenue', authController.createVenue );

router.post('/updateImage', authController.updateImage );

router.post('/createEvent', authController.createEvent );

router.post('/updateEventImage', authController.updateEventImage );

module.exports = router;