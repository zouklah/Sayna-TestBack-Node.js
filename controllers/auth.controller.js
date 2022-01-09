const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const User = require('../models/user.model');
const { registerValidation, loginValidation } = require('../validations/auth')

async function register(req, res, next) {
	var firstname = req.body.firstname
	var lastname = req.body.lastname
	var email = req.body.email
	var password = req.body.password
	var sexe = req.body.sexe
	var role = req.body.role
	var dateNaissance = req.body.dateNaissance

	if (firstname == "" || firstname == null || lastname == "" || lastname == null || email == "" || email == null || password == "" || password == null || sexe == "" || sexe == null || dateNaissance == "" || dateNaissance == null) {
		return res.status(400).send({
			error: true,
			status: 400,    
			message: "Une ou plusieurs données obligatoires sont manquantes"
		})
	}

	// Le role de l'utilisateur n'étant pas obligatoire 
	var data = Object.assign({}, req.body)
	delete data.role

	const { error } = registerValidation(data);
	if (error) return res.status(409).send({
		error: true,
		status: 409,
		message: "Une ou plusieurs données sont erronées"
	});
	
	const salt = await bcrypt.genSalt(10)
	const hashedPassword = await bcrypt.hash(req.body.password, salt);

	var user = await User.findOne({ email: email });
	if (!user) {
		if (role != "" || role != null){
			user = new User({
				firstname: firstname,
				lastname: lastname,
				email: email,
				password: hashedPassword,
				sexe: sexe,
				role: role,
				dateNaissance: dateNaissance,
			})
			user.save()
			const wantedKeys =["firstname","lastname", "email", "sexe", "role", "dateNaissance", "createdAt", "updatedAt", "subscription"]
			return res.send({
		        error: false,
		        status: 200,
		        message: "L'utilisateur a bien été créé avec succès",
		        user: Object.fromEntries(Object.entries(user.toJSON()).filter(([key]) => wantedKeys.includes(key))),
	    	})
		}
		else {
			user = new User({
				firstname: firstname,
				lastname: lastname,
				email: email,
				password: hashedPassword,
				sexe: sexe,
				dateNaissance: dateNaissance,
			})
			user.save()
			const wantedKeys =["firstname","lastname", "email", "sexe", "role", "dateNaissance", "createdAt", "updatedAt", "subscription"]
			return res.send({
		        error: false,
		        status: 200,
		        message: "L'utilisateur a bien été créé avec succès",
		        user: Object.fromEntries(Object.entries(user.toJSON()).filter(([key]) => wantedKeys.includes(key))),
	    	})
		}
	}
	else {
		return res.status(409).send({
	        error: true,
	        code: 412,
	        message: "Un compte utilisant cette adresse mail est déjà enregistré",
	    })
	} 
}


async function login(req, res, next) {
	var email = req.body.email
	var password = req.body.password

	if (email == "" || email == null || password == "" || password == null) {
		return res.status(412).send({
			error: true,
			status: 412,
			message: "Email/password manquants"
		})
	} 

	const { error } = loginValidation(req.body);
	if (error) return res.status(412).send({
		error: true,
		status: 412,
		message: "Password trop court"
	});

	const user = await User.findOne({ email: email });
	if (user && await bcrypt.compareSync(password, user.password)) {
	    const access_token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_TOKEN_LIFETIME });    
	    const refresh_token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_REFRESHTOKEN_LIFETIME });
	    const wantedKeys =["firstname","lastname", "email", "sexe", "dateNaissance", "createdAt", "updatedAt" ]
	    return res.send({
	        error: false,
	        status: 200,
	        message: "L'utilisateur a été authentifié avec succès",
	        user: Object.fromEntries(Object.entries(user.toJSON()).filter(([key]) => wantedKeys.includes(key))),
	        access_token,
	        refresh_token
	    })
	}
	else {
	    return res.status(412).send({
	        error: true,
	        code: 412,
	        message: "Email/password incorrect",
	    })
	}
}

module.exports = {
    register,
    login,
};