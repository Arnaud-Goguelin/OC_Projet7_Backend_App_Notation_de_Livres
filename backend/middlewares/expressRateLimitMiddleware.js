const { rateLimit } = require('express-rate-limit');

const limiter = rateLimit({
	windowMs: 60 * 60 * 1000,
	max: 100,
	standardHeaders: 'draft-7', 
	legacyHeaders: false,
	statusCode: 429,
	message: '100 requêtes par heure maximum. Patientez 1 heure',
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