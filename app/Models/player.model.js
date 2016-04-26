var mongoose = require('mongoose');
var uuid = require('uuid-lib');

var Schema = mongoose.Schema;

var PlayerSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	sessiontoken: {
		type: String,
		index: {
			unique: true
		},
		default: function() {return uuid.raw()},
		trim: true,
		required: 'The sessiontoken is mandatory'
	},
	email: {
		type: String,
		default: '',
		trim: true,
		required: 'The email is mandatory'
	},
	pseudo: {
		type: String,
		default: '',
		trim: true,
		required: 'Pseudo is mandatory'
	},
	login: {
		type: String,
		default: '',
		trim: true,
		required: 'The login is mandatory'
	},
	password: {
		type: String,
		default: '',
		required: 'Password is mandatory'
	},
	world: {
		type: Schema.ObjectId,
		ref: 'GridMap'
	},
	nation: {
		type: String,
		trim: true
	}
});


PlayerSchema.index({email: 1, world: 1}, {unique: true});
PlayerSchema.index({pseudo: 1, world: 1}, {unique: true});
PlayerSchema.index({login: 1, world: 1}, {unique: true});


module.exports = mongoose.model('Player', PlayerSchema);
