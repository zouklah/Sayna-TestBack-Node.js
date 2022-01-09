const User = require('../models/user.model');
const Cart = require('../models/cart.model');
const RefreshToken = require('../models/refreshToken.model')
const { updateValidation } = require('../validations/user')
const { addingValidation } = require('../validations/cart')

async function addCart(req, res, next) {
	const id = req.userId

	const { error } = addingValidation(req.body);
	if (error) return res.status(409).send({
		error: true,
		status: 409,
		message: "Une ou plusieurs données sont erronées"
	});

	var user = await User.findById(id);
	if (user.role == "SIMPLE_USER") {
		return res.status(403).send({
			error: true,
			status: 403,
			message: "Vos droits d'accès ne permettent pas d'accéder à la ressource"
		})
	}	

	var cart = new Cart({
		cartNumber: req.body.cartNumber,
		month: req.body.month,
		year: req.body.year,
		default: req.body.default,
		userId: id
	});

// *****************************************************************************
	// ENVOI DES DONNEES NECESSAIRE A L'AJOUT D'UNE CARTE BANCAIRE VERS UN API
	// ****************

	// ******** traitement(cart)

	// ****************
	// RECEPTION DE LA REPONSE DE LA PART DE L'API
	// **********************************/

// *****************************************************************************
	// Si c'est un échec : carte eronnée/incomplète - décommencter ce qui suit
	// var responseFromAPI = {
	// 	status: 403,
	// 	error: true
	// }
// *****************************************************************************
	// Si c'est un échec : informations bancaires incorrectes - décommencter ce qui suit
	// var responseFromAPI = {
	// 	status: 402,
	// 	error: true
	// }	
// *******************************************************************************
	// // Si c'est un succès - décommencter ce qui suit
	var responseFromAPI = {
		status: 200,
		error: false
	}
// ********************************************************************************	

	if (responseFromAPI.status == 403) {
		responseFromAPI.message = "Veuillez compléter votre profil avec une carte de crédit"
		return res.status(403).send(responseFromAPI)
	}
	
	if (responseFromAPI.status == 402) {
		responseFromAPI.message = "Informations bancaires incorrectes"
		return res.status(402).send(responseFromAPI)
	}

	var indexCart = cart.cartNumber
	var findCart = await Cart.findOne({ cartNumber: indexCart });
	if (findCart) {
		return res.status(409).send({
			error: true,
			status: 409,
			message: "La carte existe déjà"
		})
	} else {
		await cart.save()
		return res.send({
			error: false,
			status: 200,
			message: "Vos données ont été mises à jour"
		})
	}
}

async function deleteUser(req, res, next) {
	var id = req.userId
	
	await User.findByIdAndRemove(id);
	return res.send({
		error: false,
		status: 200,
		message: "Votre compte et le compte de vos enfants ont été supprimés avec succès"
	});
}

async function deleteRefreshToken(req, res, next) {
	await RefreshToken.deleteMany();
	return res.send({
		error: false,
		status: 200,
		message: "Les refreshToken ont été supprimés avec succès"
	});
}

async function logout(req, res, next) {
	var id = req.userId  

	// On stocke dans la BD les refreshToken pour des raisons de sécurité
	var bearerHeaderRefresh = req.headers['authorizationrefresh']
	var bearer = bearerHeaderRefresh.split(' ')
    var bearerToken = bearer[1]

    var refresh = new RefreshToken ({
    	value: bearerToken
    })

	await refresh.save();
	return res.send({
    	error: false,
    	status: 200,
    	message: "L'utilisateur a été déconnecté avec succès"
    })	
}

async function updateUser(req, res, next) {
	const id = req.userId

	const { error } = updateValidation(req.body);
	if (error) return res.status(409).send({
		error: true,
		status: 409,
		message: "Une ou plusieurs données sont erronées"
	});

	var user = {
		firstname: req.body.firstname,
		lastname: req.body.lastname,
		dateNaissance: req.body.dateNaissance,
		sexe: req.body.sexe,
		updatedAt: new Date()
	}

	await User.findByIdAndUpdate(id, user);
	return res.send({
		error: false,
		status: 200,
		message: "Vos données ont été mises à jour"
	})
}

async function subscription(req, res, next) {
	const id = req.userId
	if (req.body.cartNumber == "" || req.body.cartNumber == null || !req.body.cvc || req.body.cvc == null) {
		return res.status(400).send({
			error: true,
			status: 400,
			message: "Une ou plusieurs données obligatoires sont manquantes"
		})
	}

	var cart = {
		cartNumber: req.body.cartNumber,
		cvc: req.body.cvc
	}
	var carteIndex= cart.cartNumber

	// Vérification du role de l'utilisateur
	var user = await User.findById(id);
	if (user.role == "SIMPLE_USER") {
		return res.status(403).send({
			error: true,
			status: 403,
			message: "Vos droits d'accès ne permettent pas d'accéder à la ressource"
		})
	}

// *****************************************************************************
	// ENVOI DES DONNEES NECESSAIRE AU PAIEMENT VERS UN API
	// ****************

	// ******** traitement(cart)

	// ****************
	// RECEPTION DE LA REPONSE DE LA PART DE L'API
	// **********************************/

// *****************************************************************************
	// Si c'est un échec - décommencter ce qui suit
	// var responseFromAPI = {
	// 	status: 402,
	// 	error: true
	// }
// *******************************************************************************
	// Si c'est un succès - décommencter ce qui suit
	var responseFromAPI = {
		status: 200,
		error: false
	}
// ********************************************************************************	

	// Echec du paiement 
	if (responseFromAPI.error) {
		return res.status(402).send({
			error: true,
			status: 402,
			message: "Echec du paiement de l'offre"
		})
	}

	// Réussite du paiement
	var response = {
		error: false,
		status: 200,
	}

	// Verification si c'est le premier abonnement
	if (parseInt(user.subscription) == 0){
		var user = {
			subscription: "trial",
			updatedAt: new Date()
		}
		await User.findByIdAndUpdate(id, user);
		response.message = "Votre période d'essai viens d'être activé - 5 min"

		setTimeout(async function () {
			user.updatedAt = new Date()
			user.subscription = "hasUsingTrial"
			await User.findByIdAndUpdate(id, user);
		}, 1000*60*5)

		return res.send(response)
	}
	
	else {
		var user = {
			subscription: 1,
			updatedAt: new Date()
		}

		await User.findByIdAndUpdate(id, user);
		response.message = "Votre abonnement a bien été mise à jour"

		res.send(response)
	}	
}

module.exports = {
    addCart,
    deleteUser,
    updateUser,
    subscription,
    logout,
    deleteRefreshToken
};