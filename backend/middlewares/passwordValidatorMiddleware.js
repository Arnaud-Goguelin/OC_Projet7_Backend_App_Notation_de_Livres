const validator = require('validator');
const passwordValidator = require('password-validator');

const passwordSchema = new passwordValidator();

passwordSchema
	.is().min(8)
	.is().max(20)
	.has().uppercase()
	.has().lowercase()
	.has().digits(2)
	.oneOf('*','!','%','?','/','$','£', '€', '#', '~', '_', '-','^','¨').symbols()
	.has().not().spaces();


const loginSchema = new passwordValidator();

loginSchema
	.min(3, 'Identifiant trop court')
	.usingPlugin(validator.isEmail, 'L\'identifiant doit être un email');


exports.validateLogins = (req, res, next) => {
	if (passwordSchema.validate(req.body.password) === false) {
		return res.status(500).json({ 
			message: 'Le mot de passe doit faire entre 8 et 20 caratères, avoir des majuscules et minuscules, au moins deux chiffres, au moins un caratère spécial et ne doit pas comporter d\'espace' });
	}
	if (loginSchema.validate(req.body.email) === false) {
		return res.status(500).json({ message: 'L\'identifiant doit être un email' });
	}
	next();
};