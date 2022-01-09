const router = require('express').Router();
const userController = require('../controllers/user.controller');
const { verifyToken } = require('services/verifyToken.service')

// //Modification de l'utilisateur
router.put('/', verifyToken, userController.updateUser);

//Déconnexion de l'utilisateur
router.delete('/off', verifyToken, userController.logout)

// Suppression de l'utilisateur
router.delete('/', verifyToken, userController.deleteUser)

//Ajout de carte bancaire
router.put('/cart', verifyToken, userController.addCart)

module.exports = router;