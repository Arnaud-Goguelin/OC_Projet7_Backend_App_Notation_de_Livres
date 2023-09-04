const express = require('express');
const router = express.Router();

const ERL = require('../middlewares/expressRateLimitMiddleware');
const PWV = require('../middlewares/passwordValidatorMiddleware');
const crypto = require('../middlewares/nodeCryptoMiddleware');

const authController = require('../controllers/authController');

router.post('/signup', ERL.createAccountLimiter, PWV.validateLogins, crypto.secureDatas, authController.signup);

router.post('/login', ERL.limiter, crypto.decryptData, authController.login);

module.exports = router;