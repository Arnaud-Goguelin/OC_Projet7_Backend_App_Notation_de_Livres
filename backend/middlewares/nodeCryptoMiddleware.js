const crypto = require('crypto');
const bcrypt = require('bcrypt');

const key = crypto
	.createHash('sha512')
	.update(process.env.CRYPTOPASSWORD)
	.digest('hex')
	.substring(0, 32);

exports.encryptEmail = async (req, res, next) => {
	try {

		const hash = await bcrypt.hash(req.body.password, 10);
		const randomIV = crypto.randomBytes(8).toString('hex');

		const keyToCrypt = crypto.createCipheriv(process.env.ALGORITHM, key, randomIV);

		let cryptedEmail = keyToCrypt.update(req.body.email, 'utf-8', 'hex');
		cryptedEmail += keyToCrypt.final('hex');

		req.body.password = hash;
		req.body.iv = randomIV;
		req.body.email = cryptedEmail;

		next();
	} catch (error) {
		res.status(500).json({error});
	}
};