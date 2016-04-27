var Q = require('q');

var routeUtils = require('../../app/Routes/route.utils');

var Admin = require('../../app/Controllers/admin.controller');

module.exports = function(router) {
router.route('/admin/world/:worldId/')
	.delete(function(req, res) {

		var worldId = req.params.worldId;
		var option = {world: worldId};

		console.log('DELETE: /admin/world/%s/', worldId);

		Admin.delete(option)
			.then(routeUtils.sendResponseTo(res, 200))
			.catch(routeUtils.sendErrorTo(res, 422))
			.finally(routeUtils.answerEnd());
	});
}
