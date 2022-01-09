const router = require('express').Router();
const songController = require('../controllers/song.controller');
const { verifyToken } = require('services/verifyToken.service')

router.post('/', songController.add);

//Listing des sources audios
router.get('/', verifyToken, songController.getAll);

//Récuperation d'une source audio
router.get('/:id', verifyToken, songController.getById)

module.exports = router;