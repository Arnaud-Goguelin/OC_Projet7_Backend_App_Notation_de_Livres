const express = require('express');
const router = express.Router();

const ERL = require('../middlewares/expressRateLimitMiddleware');

const authController = require('../controllers/authController');

router.post('/signup', ERL.createAccountLimiter , authController.signup);

router.post('/login', authController.login);

module.exports = router;