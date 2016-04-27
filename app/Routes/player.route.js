var Q = require('q');

var routeUtils = require('../../app/Routes/route.utils');

var Players = require('../../app/Controllers/players.controller');

module.exports = function(router) {
router.route('/user/')
	.post(function(req, res) {
		console.log('POST: /user/');
		console.log(req.body);

		var email = req.body.email,
			login = req.body.login,
			pseudo = req.body.pseudo,
			hashpassword = req.body.password;
		var data = {email: email, login: login, pseudo: pseudo, password: hashpassword};

		Players.create(data)
			.then(routeUtils.sendResponseTo(res, 201))
			.catch(routeUtils.sendErrorTo(res, 422))
			.finally(routeUtils.answerEnd());
	});

router.route('/user/connect/')
	.post(function(req, res) {
		console.log('POST: /user/connect/');
		console.log(req.body);

		var login = req.body.login,
			hashpassword = req.body.password;
		var data = {login: login, password: hashpassword};

		Players.getByConnection(data)
			.then(routeUtils.sendResponseTo(res, 200))
			.catch(routeUtils.sendErrorTo(res), 422)
			.finally(routeUtils.answerEnd());
	});

}
