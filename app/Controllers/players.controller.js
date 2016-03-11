var mongoose = require('mongoose');
var Tile = mongoose.model('Tile');
var _ = require('lodash')


// Gestion des erreurs
var getErrorMessage = function(err) {
	var message = '';

	if (err.code) {
		switch (err.code) {
			case 11000:
			case 11001:
				message = 'Tile already exists';
				break;
			default:
				message = 'Something went wrong';
		}
	} else {
		for (var errName in err.errors) {
			if (err.errors[errName].message) message = err.errors[errName].message;
		}
	}
	return message;
}

// Create a player
exports.create = function(req, res) {
	var player = new Player(req.body);
	player.class = req.class;

	player.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(player);
		}
	});
}

// Read a player
exports.read = function(req, res) {
	res.jsonp(req.player);
}

// Update a player
exports.update = function(req, res) {
	var player = req.player;

	player = _.extend(player, req.body);

	player.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(player);
		}
	});
}

exports.delete = function(req, res) {
	var player = req.player;

	player.remove(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(player);
		}
	});
}

exports.list = function(req, res) {
	Player.find().sort('').populate('owner').exec(function(err, players) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(players);
		}
	});
}

exports.playerById = function(req, res, next, id) {
	Player.findById(id).populate('player').exec(function(err, player) {
		if (err) return next(err);
		if (!player) return next(new Error('Failed to load player ' + id));
		req.player = player;
		next();
	});
}

exports.hasAuthorization = function(req, res, next) {
	if (req.tile.owner.id !== req.player.id) {
		return res.send(403, {
			message: 'Player is not authorized'
		});
	}
	next();
}
