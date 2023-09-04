const crypto = require('crypto');
const bcrypt = require('bcrypt');

const User = require('../models/User');

const key = crypto
	.createHash('sha512')
	.update(process.env.CRYPTOPASSWORD)
	.digest('hex')
	.substring(0, 32);

exports.secureDatas = async (req, res, next) => {
	try {

		const hash = await bcrypt.hash(req.body.password, 10);
		const randomIV = crypto.randomBytes(8).toString('hex');

		const keyToCrypt = crypto.createCipheriv(process.env.ALGORITHM, key, randomIV);

		let encryptedEmail = keyToCrypt.update(req.body.email, 'utf-8', 'hex');
		encryptedEmail += keyToCrypt.final('hex');

		req.body.password = hash;
		req.body.iv = randomIV;
		req.body.email = encryptedEmail;

		next();
	} catch (error) {
		res.status(500).json({error});
	}
};

exports.decryptData = async (req, res, next) => {

	try {
		const users = await User.find();
		const onlyEncryptedData = users.slice(1,users[-1]);
		const decryptedDatas = [];
		for(let user of onlyEncryptedData) {
			const keyToDecrypt = crypto.createDecipheriv(process.env.ALGORITHM, key, user.iv);
			let decryptedEmails = keyToDecrypt.update(user.email, 'hex', 'utf8');
			decryptedEmails += keyToDecrypt.final('utf8');
			decryptedDatas.push({
				_id: user._id,
				email: decryptedEmails,
				password: user.password
			});
		}
	
		req.body.decryptedDatas = decryptedDatas;
		next();
	} catch (error) {
		res.status(500).json({ error });
	}
};