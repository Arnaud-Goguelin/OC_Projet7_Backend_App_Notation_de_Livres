const express = require('express');
const router = express.Router();

const ERL = require('../middlewares/expressRateLimitMiddleware');
const PWV = require('../middlewares/passwordValidatorMiddleware');

const authController = require('../controllers/authController');

router.post('/signup', ERL.createAccountLimiter, PWV.validateLogins, authController.signup);

router.post('/login', ERL.limiter, authController.login);

module.exports = router;