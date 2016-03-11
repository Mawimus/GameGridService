var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PlayerSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	displayname: {
		type: String,
		default: '',
		trim: true,
		required: 'The name is mandatory'
	},
	pseudo: {
		type: String,
		default: '',
		trim: true,
		required: 'Pseudo is mandatory'
	},
	password: {
		type: String,
		default: '',
		required: 'Password is mandatory'
	},
	class: {
		type: Schema.ObjectId,
		ref: 'Class'
	}
});

mongoose.model('Player', PlayerSchema);
