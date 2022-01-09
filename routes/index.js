const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const userController = require('../controllers/user.controller');
const { verifyToken } = require('services/verifyToken.service')

// Route d'inscription
router.post('/register', authController.register)

// Route d'authentification
router.post('/login', authController.login)

// Route d'abonnement
router.put('/subscription', verifyToken, userController.subscription)

// Suppression des refreshToken
router.delete('/refreshToken', verifyToken, userController.deleteRefreshToken)

module.exports = router;
