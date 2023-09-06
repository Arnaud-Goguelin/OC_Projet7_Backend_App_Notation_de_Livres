const crypto = require('crypto');

const key = crypto
	.createHash('sha512')
	.update(process.env.CRYPTOPASSWORD)
	.digest('hex')
	.substring(0, 32);

exports.encryptData = (dataToEncrypt) => {
	try {

		// const randomIV = crypto.randomBytes(8).toString('hex');

		const keyToEncrypt = crypto.createCipheriv(process.env.ALGORITHM, key, process.env.IV);

		let encryptedData = keyToEncrypt.update(dataToEncrypt, 'utf-8', 'hex');
		encryptedData += keyToEncrypt.final('hex');

		return encryptedData;

	} catch (error) {
		return console.log(error);
	}
};

exports.decryptData = async (datatoDecrypt) => {

	try {

		const keyToDecrypt = crypto.createDecipheriv(process.env.ALGORITHM, key, process.env.IV);

		let decryptedData = keyToDecrypt.update(datatoDecrypt, 'hex', 'utf-8');
		decryptedData += keyToDecrypt.final('utf-8');

		return decryptedData;

		// const users = await User.find();
		// const onlyEncryptedData = users.slice(1,users[-1]);
		// const decryptedDatas = [];
		// for(let user of onlyEncryptedData) {
		// 	const keyToDecrypt = crypto.createDecipheriv(process.env.ALGORITHM, key, process.env.IV);
		// 	let decryptedEmails = keyToDecrypt.update(datatoDecrypt, 'hex', 'utf8');
		// 	decryptedEmails += keyToDecrypt.final('utf8');
		// 	decryptedDatas.push({
		// 		_id: user._id,
		// 		email: decryptedEmails,
		// 		password: user.password
		// 	});
		// }
	
		// req.body.decryptedDatas = decryptedDatas;
		// next();
	} catch (error) {
		return console.log(error);
		// res.status(500).json({ error });
	}
};