var tiles = require('../../app/Controllers/tiles');

module.exports = function(app) {
	// Tile Routes
	app.route('/tiles')
		.get(tile.list);
}
