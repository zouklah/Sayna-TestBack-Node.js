const jwt = require('jsonwebtoken')
const RefreshToken = require('../models/refreshToken.model')

async function verifyToken (req, res, next) {
    var bearerHeader = req.headers['authorization']
    var bearerHeaderRefresh = req.headers['authorizationrefresh']

    var error = {
	   	error: true,
	   	status: 401,
	   	message: "Votre token n'est pas correct"
	}
    
    if (bearerHeader == null) { 
	    return res.status(401).send(error)
	} 
    else { 
        var bearer = bearerHeader.split(' ')
        var bearerToken = bearer[1]
        
        await jwt.verify(bearerToken, process.env.JWT_SECRET, async (err, decoded) => {
	        if (err) {
	        	if (bearerHeaderRefresh != null) {
	        		var bearerRefresh = bearerHeaderRefresh.split(' ')
	        		var bearerTokenRefresh = bearerRefresh[1]

	        		// Verifcation si le refreshToken a déjà été déconnecté
	        		RefreshToken.findOne({ value: bearerTokenRefresh }, async function (err, result) {
	        			if (err) {
	        				return res.status(500).send({ message: "Erreur interne"})
	        			}

	        			if(result) {
	        				return res.status(401).send(error)
	        			} 
	        			else {
	        				await jwt.verify(bearerTokenRefresh, process.env.JWT_SECRET, (err, decoded) => {
			        			if (err)
			        				return res.status(401).send(error)
			        			else {
			        				req.userId = decoded.sub
			        				next();
			        			}
			        		})
	        			}
	        		})
	        	} else {
		        	return res.status(401).send(error)	 
	        	}
	        }
	        else {
	        	req.userId = decoded.sub
	        	next();
	        }
    	})
    }
}

module.exports = {
   verifyToken
};