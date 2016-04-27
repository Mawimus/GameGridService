var Q = require('q');

var routeUtils = require('../../app/Routes/route.utils');

var Players = require('../../app/Controllers/players.controller');

module.exports = function(router) {
router.route('/user/:worldid/')
	.post(function(req, res) {

		var worldId = req.params.worldid,
			email = req.body.email,
			login = req.body.login,
			pseudo = req.body.pseudo,
			hashpassword = req.body.password;
		var data = {email: email, login: login, pseudo: pseudo, password: hashpassword, worldId: worldId};

		console.log('POST: /user/%s/', worldId);
		console.log(req.body);

		Players.create(data)
			.then(routeUtils.sendResponseTo(res, 201))
			.catch(routeUtils.sendErrorTo(res, 422))
			.finally(routeUtils.answerEnd());
	});

router.route('/user/connect/:worldid/')
	.post(function(req, res) {

		var worldId = req.params.worldid,
			login = req.body.login,
			hashpassword = req.body.password;
		var data = {login: login, password: hashpassword, worldId: worldId};

		console.log('POST: /user/connect/%s/', worldId);
		console.log(req.body);

		Players.getByConnection(data)
			.then(routeUtils.sendResponseTo(res, 200))
			.catch(routeUtils.sendErrorTo(res), 422)
			.finally(routeUtils.answerEnd());
	});

}
