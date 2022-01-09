const Joi = require('@hapi/joi').extend(require('@hapi/joi-date'))

const updateValidation = (data) => {
	const schema = Joi.object({
		firstname: Joi.string().min(1).required(),
		lastname: Joi.string().min(1).required(),
		sexe: Joi.string().max(1).required(),
		dateNaissance: Joi.date().format('YYYY-MM-DD').required(),
	});
	return schema.validate(data);
};

module.exports = {
	updateValidation,
}
