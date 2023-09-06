const { rateLimit } = require('express-rate-limit');

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 250,
	standardHeaders: 'draft-7', 
	legacyHeaders: false,
	statusCode: 429,
	message: '250 requêtes maximum par intervalle de 15 minutes. Patientez 15 minuites',
});

const createAccountLimiter = rateLimit({
	windowMs: 60 * 60 * 1000,
	max: 3,
	standardHeaders: 'draft-7',
	legacyHeaders: false,
	statusCode: 429,
	message: '3 comptes créés par heure maximum. Patientez 1 heure.',
});

module.exports = { limiter, createAccountLimiter };