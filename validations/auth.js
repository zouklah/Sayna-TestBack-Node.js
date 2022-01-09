const Joi = require('@hapi/joi').extend(require('@hapi/joi-date'))

const registerValidation = (data) => {
	const schema = Joi.object({
		firstname: Joi.string().min(1).required(),
		lastname: Joi.string().min(1).required(),
		email: Joi.string().min(4).required().email(),
		password: Joi.string().min(6).required(),
		sexe: Joi.string().required(),
		dateNaissance: Joi.date().format('YYYY-MM-DD').required(),
	});
	return schema.validate(data);
};

const loginValidation = (data) => {
	const schema = Joi.object({
		email: Joi.string().required().email(),
		password: Joi.string().min(6).required(),
	});
	return schema.validate(data);
};

module.exports = {
	registerValidation,
	loginValidation
}
