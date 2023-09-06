const express = require('express');
const router = express.Router();

const ERL = require('../middlewares/expressRateLimitMiddleware');
const PWV = require('../middlewares/passwordValidatorMiddleware');
const PES = require('../middlewares/perfectExpressSanitizerMiddleware');

const authController = require('../controllers/authController');

router.post('/signup', PES.sanitizer, ERL.createAccountLimiter, PWV.validateLogins, authController.signup);

router.post('/login', PES.sanitizer, authController.login);

module.exports = router;