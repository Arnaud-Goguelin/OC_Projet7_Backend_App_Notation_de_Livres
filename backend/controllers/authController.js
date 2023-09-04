const User = require('../models/User');
const JWT = require('jsonwebtoken');

exports.signup = async (req, res) => {
	try{
		const user = {
			email: req.body.email,
			password: req.body.password,
			iv: req.body.iv
		};
		await User.create(user);
		return res.status(201).json({ message: 'Utilisateur créé' });
	}catch (error){
		return res.status(500).json({ message: error });
	}
};

exports.login = (req, res) => {
	User.findOne({ email: req.body.email })
		.then(user => {
			if (user === null) {
				res.status(401).json({ message: 'Identifiant ou mot de passe incorrect(s)' });
			} else {
				bcrypt.compare(req.body.password, user.password)
					.then(valid => {
						if (!valid) {
							res.status(401).json({ message: 'Identifiant ou mot de passe incorrect(s)' });
						} else {
							res.status(200).json({
								userId: user._id,
								token: JWT.sign(
									{ userId: user._id },
									process.env.JWTKEY,
									{ expiresIn: '24h' }
								)
							});
						}
					})
					.catch(error => res.status(500).json({ error }));
			}
		})
		.catch(error => res.status(500).json({ error }));
};