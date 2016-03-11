var players = require('../../app/Controllers/players');

module.exports = function(app) {
	app.route('/players')
		.get(players.list);

	app.route('/players/:playerId')
		.get(players.read)
		.put()
		.delete();

	app.param('playerId', players.playerById);
}
