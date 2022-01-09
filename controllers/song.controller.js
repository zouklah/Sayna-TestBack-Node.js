const Song = require('../models/song.model');
const User = require('../models/user.model');

async function add(req, res, next) {
	var song = new Song({
		name: req.body.name,
		url: req.body.url,
		cover: req.body.cover,
		time: req.body.time,
		type: req.body.type
	});

	try {
		var savedSong = await song.save();
		res.send({ song: song._id });
	} catch (err) {
		res.status(400).send(err);
	}
}

async function getAll(req, res, next) {
	var id = req.userId

	var user = await User.findById(id);
	if (parseInt(user.subscription, 10) == 0 || user.subscription == "hasUsingTrial" ) {
		return res.status(403).send({
			error: true,
			status: 403,
			message: "Votre abonnement ne permet pas d'accéder à la ressource"
		})
	}

	var songs = await Song.find();
	return res.send({
		error: false,
		status: 200,
		songs: songs
	})
}

async function getById(req, res, next) {
	var id = req.userId

	var user = await User.findById(id);
	if (parseInt(user.subscription, 10) == 0 || user.subscription == "hasUsingTrial" ) {
		return res.status(403).send({
			error: true,
			status: 403,
			message: "Votre abonnement ne permet pas d'accéder à la ressource"
		})
	}

	var song = await Song.findById(req.params.id)
	song.id = song._id
	delete song._id

	return res.send({
		error: false,
		status: 200,
		song: song
	})
}

module.exports = {
    add,
    getAll,
    getById
};