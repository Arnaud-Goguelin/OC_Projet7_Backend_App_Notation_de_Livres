const User = require('../models/User');
const JWT = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const secureDatas = require('../utils/secureDatas');

exports.signup = async (req, res) => {
	try{
		if(!req.body.email || !req.body.password){
			return res.status(400).send({
				message: 'Email et mot de passe requis'
			});
		}

		const hashedPassword = await bcrypt.hash(req.body.password, 10);
		const encryptedEmail = secureDatas.encryptData(req.body.email);

		const user = {
			email: encryptedEmail,
			password: hashedPassword
		};
		await User.create(user);
		return res.status(201).json({ message: 'Utilisateur créé' });
	} catch (error) {
		return res.status(500).json({ error });
	}
};

exports.login = async (req, res) => {
	try {
		const emailToFind = secureDatas.encryptData(req.body.email);

		const userToFind = await User.findOne({ email: emailToFind});

		if (userToFind === null) {
			res.status(401).json({ message: 'Identifiant ou mot de passe incorrect(s)' });
		}

		const hasComparison = await	bcrypt.compare(req.body.password, userToFind.password);

		if (hasComparison === false) {
			res.status(401).json({ message: 'Identifiant ou mot de passe incorrect(s)' });
		} else {
			try {
				res.status(200).json({
					userId: userToFind._id,
					token: JWT.sign(
						{ userId: userToFind._id },
						process.env.JWTKEY,
						{ expiresIn: '24h' }
					)
				});
			} catch (error) {
				error => res.status(500).json({ error });
			}
		}
	}
	catch (error) {
		error => res.status(500).json({ error });
	}
};

// let userToFind = null;
// for (let user of req.body.decryptedDatas) { if (user.email === req.body.email) {
// 	userToFind = user;
// 	break;
// }}

// if (userToFind === null) {
// 	res.status(401).json({ message: 'Identifiant ou mot de passe incorrect(s)' });
// }
		
// const hasComparison = await	bcrypt.compare(req.body.password, userToFind.password);

// if (hasComparison === false) {
// 	res.status(401).json({ message: 'Identifiant ou mot de passe incorrect(s)' });
// } else {
// 	try {
// 		res.status(200).json({
// 			userId: userToFind._id,
// 			token: JWT.sign(
// 				{ userId: userToFind._id },
// 				process.env.JWTKEY,
// 				{ expiresIn: '24h' }
// 			)
// 		});
// 	} catch (error) {
// 		error => res.status(500).json({ error });
// 	}
// }