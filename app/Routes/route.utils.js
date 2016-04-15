
var sendErrorTo = function (response, code) {
	return function(err) {
		// var html = '<html><body>erreur dans la récupération de la page : <br>$err</body></html>';
		// response.status(404).json(html.replace('$err', err));
		response.status(code).jsonp({err: err});
	}
}

var sendResponseTo = function (response, code) {
	return function(data) {
		response.status(code).jsonp(data);
	}
}

var answerEnd = function () {
	console.log('response was sent successfully');
	console.log('==============================');
	console.log();
	return true;
}


module.exports.sendErrorTo = sendErrorTo;
module.exports.sendResponseTo = sendResponseTo;
module.exports.answerEnd = answerEnd;
