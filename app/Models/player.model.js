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
		index: {
			unique: true
		},
		default: '',
		trim: true,
		required: 'The email is mandatory'
	},
	login: {
		type: String,
		index: {
			unique: true
		},
		default: '',
		trim: true,
		required: 'The login is mandatory'
	},
	password: {
		type: String,
		default: '',
		required: 'Password is mandatory'
	},
	pseudo: {
		type: String,
		default: '',
		trim: true,
		required: 'Pseudo is mandatory'
	},
	class: {
		type: Schema.ObjectId,
		ref: 'Class'
	}
});

module.exports = mongoose.model('Player', PlayerSchema);
