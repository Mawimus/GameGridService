var mongoose = require('mongoose');
var uuid = require('uuid-lib');
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
	token: {
		type: String,
		index: {
			unique: true
		},
		default: function() {return uuid.raw()},
		trim: true,
		required: 'The token is mandatory'
	},	seed: {
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
	},
	world: {
		name: {
			type: String,
			default: '',
			trim: true,
			required: 'The world name is mandatory'
		},
		description: {
			type: String,
			default: '',
			trim: true
		},
		rules: {
			type: Schema.ObjectId,
			ref: 'Rule',
			required: 'Rules are mandatory'
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
