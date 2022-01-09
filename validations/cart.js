const Joi = require('@hapi/joi').extend(require('@hapi/joi-date'))

const addingValidation = (data) => {
	const schema = Joi.object({
		cartNumber: Joi.string().min(16).max(17).required(),
		month: Joi.number().min(1).max(12).required(),
		year: Joi.number().min(1980).required(),
		default: Joi.string().required(),
	});
	return schema.validate(data);
};

module.exports = {
	addingValidation
}
