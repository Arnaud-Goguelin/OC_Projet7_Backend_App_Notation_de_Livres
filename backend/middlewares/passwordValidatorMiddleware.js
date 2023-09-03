const validator = require('validator');
const passwordValidator = require('password-validator');

const passwordSchema = new passwordValidator();

passwordSchema
	.is().min(8, 'Le mot de passe doit avoir au moins 8 caractères')
	.is().max(20, 'Le mot de passe doit faire maximum 20 caratères')
	.has().uppercase('', 'Le mot de passe doit contenir au moins 1 caractère en majuscule')
	.has().lowercase('', 'Le mot de passe doit contenir au moins 1 caractère en minuscule')
	.has().digits(2, 'Le mot de passe doit contenir au moins 2 chiffres')
	.has().symbols('', 'Le mot de passe doit contenir au moins 1 caractère spéciale')
	.has().not().spaces('', 'Le mot de passe ne doit pas contenir d\'espace');


const loginSchema = new passwordValidator();

loginSchema
	.min(10, 'Identifiant trop court')
	.usingPlugin(validator.isEmail, 'L\'identifiant doit être un email');

exports.validateLogins = (req, res, next) => {
	
	let errorMessage = null;

	function editErrorMessage(validateTest) {
		const passwordFailuresDetails = validateTest;
		const errorMessages = passwordFailuresDetails.map(detail => detail.message);
		return errorMessage = errorMessages.join(', ');	
	}

	if (passwordSchema.validate(req.body.password) === false) {
		editErrorMessage(passwordSchema.validate(req.body.password, { details: true }));
		return res.status(500).json({ 
			message: `Le mot de passe ne respecte pas les règles suivantes: ${ errorMessage }` });
	}

	if ( loginSchema.validate(req.body.email) === false) {
		editErrorMessage(loginSchema.validate(req.body.email, { details: true }));
		return res.status(500).json({ message:  `L'identifiant ne respecte pas les règles suivantes: ${ errorMessage }` });
	}
	next();
};