const express = require('express');
const auth = require('../midlewares/authMiddliware');
const router = express.Router();


const authController = require('../controllers/authController');

router.post('/signup', auth, authController.signup);

router.post('/login', auth, authController.login);

module.exports = router;