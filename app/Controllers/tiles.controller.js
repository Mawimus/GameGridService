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


// Create a tile
exports.create = function(req, res) {
	var tile = new Tile(req.body);
	tile.owner = req.owner;

	tile.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(tile);
		}
	});
}

// Read a tile
exports.read = function(req, res) {
	res.jsonp(req.tile);
}

// Update a tile
exports.update = function(req, res) {
	var tile = req.tile;

	tile = _.extend(tile, req.body);

	tile.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(tile);
		}
	});
}

exports.delete = function(req, res) {
	var tile = req.tile;

	tile.remove(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(tile);
		}
	});
}

exports.list = function(req, res) {
	Tile.find().sort('').populate('owner').exec(function(err, tiles) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(tiles);
		}
	});
}
