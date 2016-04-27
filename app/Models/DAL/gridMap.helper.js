var mongoose = require('mongoose');
var GridMap = require('./../gridMap.model.js');

exports.findById = function(id, next) {
	GridMap.findOne({'_id': id})
		.select('_id token seed size world')
		.exec(next);
}

exports.findByWorldName = function(worldName, next) {
	GridMap.findOne({'world.name': worldName})
		.select('_id token seed size world')
		.exec(next);
}

exports.count = function(next) {
	GridMap.count()
		.exec(next);
}

exports.list = function(skip, limit, next) {
	GridMap.find()
		.select('_id token seed size world')
		.skip(skip)
		.limit(limit)
		.sort({
			created: 'asc',
			_id: 'asc'
		})
		.exec(next);
}

exports.save = function(gridmap, next) {
	gridmap.save(next);
}
