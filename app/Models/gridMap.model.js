var mongoose = require('mongoose');
var randomstring = require('randomstring');
var Schema = mongoose.Schema;


/**
 * Tile Schema
 */
var GridMapSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	seed: {
		type: String,
		default: function() {return randomstring.generate()},
		trim: true,
		required: 'Seed is required'
	},
	size: {
		minx: {
			type: Number,
			default: 0,
			required: 'Min x is required'
		},
		miny: {
			type: Number,
			default: 0,
			required: 'Min y is required'
		},
		maxx: {
			type: Number,
			default: 65,
			required: 'Max x is required'
		},
		maxy: {
			type: Number,
			default: 65,
			required: 'Max y is required'
		}
	}
});

module.exports = mongoose.model('GridMap', GridMapSchema);

// Format d'une carte
/*
	{
		id: Number,
		seed: String,
		size: Object {
			minx: Number,
			miny: Number,
			maxx: Number,
			maxy: Number
		},
		tiles: Array<Tile>
	}
*/
