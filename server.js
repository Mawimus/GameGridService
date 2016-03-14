
var express = require('express');
var mongoose = require('mongoose');
var randomizeGrid = require('./app/Core/Utils/randomizeGrid');
var utils = require('./app/Core/Utils/utils');
var beautify = require('js-beautify').js_beautify;
var fs = require('fs');
var app = express();



function getLocalMatrixTiles(maxxTiles, maxyTiles, maxx, maxy, currentx, currenty) {
	// Cast des parametre
	var maxxTiles = parseInt(maxxTiles),
		maxyTiles = parseInt(maxyTiles),
		maxx = parseInt(maxx),
		maxy = parseInt(maxy),
		currentx = parseInt(currentx),
		currenty = parseInt(currenty);

	// Work with nbX, nbY odd !
	var gridSeed = 'GrideLand#1',
		randField = [],
		randbarbarian = [],
		nbX = maxxTiles,
		nbY = maxyTiles,
		fromX = 0; //Math.floor(nbX / 2) * -1,
		toX = nbX; //Math.floor(nbX / 2),
		fromY = 0,
		toY = nbY;

	randField = randomizeGrid.generateLocalWithSeed(gridSeed, maxx, maxy, currentx, currenty, {
		mountain:0.2,
		forest:0.2,
		desert:0.2,
		sea:0.1,
		lowland:0.3,
	});
	randbarbarian = randomizeGrid.generateLocalWithSeed(gridSeed, maxx, maxy, currentx, currenty, {
		nature:0.95,
		barbarian:0.05,
	});
	// for (i in randbarbarian) {
	// 	console.log('i %s', randbarbarian[i]);
	// }

	var mountain = 0,
		forest = 0,
		desert = 0,
		sea = 0,
		lowland = 0
		totalField = 0;

	var nature = 0,
		barbarian = 0,
		totalBarbarian = 0;

	var mountainpc,
		forestpc,
		desertpc,
		seapc,
		lowlandpc,
		totalFieldpc,
		naturepc,
		barbarianpc,
		totalBarbarianpc;

	for (var i in randField) {
		if (randField[i] == 'mountain') mountain++;
		if (randField[i] == 'forest') forest++;
		if (randField[i] == 'desert') desert++;
		if (randField[i] == 'sea') sea++;
		if (randField[i] == 'lowland') lowland++;
		totalField++;
	}
	mountainpc = (mountain * 100) / totalField;
	forestpc = (forest * 100) / totalField;
	desertpc = (desert * 100) / totalField;
	seapc = (sea * 100) / totalField;
	lowlandpc = (lowland * 100) / totalField;
	totalFieldpc = (totalField * 100) / totalField;

	console.log('Type\t\t\t: Total\t%percent');
	console.log('----------------------------------------');

	console.log('mountain\t\t: %s\t%s%', mountain, mountainpc.toFixed(2));
	console.log('forest\t\t\t: %s\t%s%', forest, forestpc.toFixed(2));
	console.log('desert\t\t\t: %s\t%s%', desert, desertpc.toFixed(2));
	console.log('sea\t\t\t: %s\t%s%', sea, seapc.toFixed(2));
	console.log('lowland\t\t\t: %s\t%s%', lowland, lowlandpc.toFixed(2));
	console.log('#totalField#\t\t: %s\t%s%', totalField, totalFieldpc.toFixed(2));

	for (var i in randbarbarian) {
		if (randbarbarian[i] == 'nature') nature++;
		if (randbarbarian[i] == 'barbarian') barbarian++;
		totalBarbarian++;
	}
	naturepc = (nature * 100) / totalBarbarian;
	barbarianpc = (barbarian * 100) / totalBarbarian;
	totalBarbarianpc = (totalBarbarian * 100) / totalBarbarian;

	console.log();
	console.log('nature\t\t\t: %s\t%s%', nature, naturepc.toFixed(2));
	console.log('barbarian\t\t: %s\t%s%', barbarian, barbarianpc.toFixed(2));
	console.log('#totalBarbarian#\t: %s\t%s%', totalBarbarian, totalBarbarianpc.toFixed(2));

	var matrix = [[]],
		f, b, c,
		id = 0,
		ipos = 0, //currentx+32,
		jpos = 0, //currenty+32,
		tabi = 0;

	// for (var j = fromY; j < toY+1; j++) {
	// 	matrix[jpos] = [];
	// 	matrix[jpos] = new Array(nbX);
	// 	for (var i = fromX; i < toX+1; i++) {
	// 		id = tabi; //j.toString() + i.toString();
	// 		f = {type: randField[tabi]};
	// 		b = {id: 0, type: randbarbarian[tabi], name: randbarbarian[tabi].capitalizeFirstLetter(), class: randbarbarian[tabi]};
	// 		c = {x: j, y: i};
	// 		matrix[jpos][ipos] = {id: id, coord: c, owner: b, field: f};
	// 		ipos++;
	// 		tabi++;
	// 	}
	// 	ipos = 0;
	// 	jpos++;
	// }

	console.log();
	console.log('(%s | %s)', currentx, currenty);
	console.log();

	for (var j = 0; j < maxy; j++) {
		id = ((currenty + j) * maxyTiles) + currentx;
		console.log('----------');
		console.log('j %s %s', j, id);
		console.log('----------');
		matrix[jpos] = [];
		matrix[jpos] = new Array(maxx);
		for (var i = 0; i < maxx; i++) {
			id++;
			console.log('i %s %s', i, id);
			f = {type: randField[tabi]};
			b = {id: 0, type: randbarbarian[tabi], name: randbarbarian[tabi].capitalizeFirstLetter(), class: randbarbarian[tabi]};
			c = {x: currentx + i, y: currenty + j};
			matrix[jpos][ipos] = {id: id, coord: c, owner: b, field: f};
			ipos++;
			tabi++;
		}
		// tabi = ipos + (jpos * nbX);
		ipos = 0;
		jpos++;
	}

	// console.log(beautify(JSON.stringify(matrix), {indent_size: 2}));
	return matrix;
}


// mongoose.connect('mongodb://localhost/gamegride');

// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {


// });









app.get('/users', function(req, res) {
	res.send([
		{name:'Mawimus'},
		{name:'Poudjik'}
	]);
});

app.get('/matrix-tiles/:maxxtiles/:maxytiles/:maxx/:maxy/:currentx/:currenty/', function(req, res) {

	var maxxTiles = req.params.maxxtiles,
		maxyTiles = req.params.maxytiles,
		maxx = req.params.maxx,
		maxy = req.params.maxy,
		currentx = req.params.currentx,
		currenty = req.params.currenty,
		matrixTiles = [[]];

	matrixTiles = getLocalMatrixTiles(maxxTiles, maxyTiles, maxx, maxy, currentx, currenty);
	/*matrixTiles = [
		[
			{id:11, coord: {x:0, y:0}, owner: {id:1, type:'player', name:'Mawimus', class:'roman'}, field: {type:'mountain'}},
			{id:21, coord: {x:1, y:0}, owner: {id:0, type:'nature', name:'Nature', class:'nature'}, field: {type:'forest'}},
			{id:31, coord: {x:2, y:0}, owner: {id:0, type:'nature', name:'Nature', class:'nature'}, field: {type:'desert'}},
			{id:41, coord: {x:3, y:0}, owner: {id:0, type:'nature', name:'Nature', class:'nature'}, field: {type:'mountain'}},
			{id:51, coord: {x:4, y:0}, owner: {id:0, type:'ally', name:'Poudjik', class:'egyptien'}, field: {type:'mountain'}},
		],
		[
			{id:12, coord: {x:0, y:1}, owner: {id:0, type:'nature', name:'Nature', class:'nature'}, field: {type:'sea'}},
			{id:22, coord: {x:1, y:1}, owner: {id:0, type:'nature', name:'Nature', class:'nature'}, field: {type:'lowland'}},
			{id:32, coord: {x:2, y:1}, owner: {id:0, type:'nature', name:'Nature', class:'nature'}, field: {type:'forest'}},
			{id:42, coord: {x:3, y:1}, owner: {id:0, type:'nature', name:'Nature', class:'nature'}, field: {type:'desert'}},
			{id:52, coord: {x:4, y:1}, owner: {id:0, type:'nature', name:'Nature', class:'nature'}, field: {type:'desert'}},
		],
		[
			{id:13, coord: {x:0, y:2}, owner: {id:0, type:'nature', name:'Nature', class:'nature'}, field: {type:'desert'}},
			{id:23, coord: {x:1, y:2}, owner: {id:0, type:'nature', name:'Nature', class:'nature'}, field: {type:'desert'}},
			{id:33, coord: {x:2, y:2}, owner: {id:0, type:'barbarian', name:'Barbarian', class:'barbarian'}, field: {type:'forest'}},
			{id:43, coord: {x:3, y:2}, owner: {id:0, type:'nature', name:'Nature', class:'nature'}, field: {type:'forest'}},
			{id:53, coord: {x:4, y:2}, owner: {id:0, type:'nature', name:'Nature', class:'nature'}, field: {type:'forest'}},
		],
		[
			{id:14, coord: {x:0, y:3}, owner: {id:0, type:'nature', name:'Nature', class:'nature'}, field: {type:'sea'}},
			{id:24, coord: {x:1, y:3}, owner: {id:0, type:'nature', name:'Nature', class:'nature'}, field: {type:'sea'}},
			{id:34, coord: {x:2, y:3}, owner: {id:0, type:'nature', name:'Nature', class:'nature'}, field: {type:'lowland'}},
			{id:44, coord: {x:3, y:3}, owner: {id:0, type:'nature', name:'Nature', class:'nature'}, field: {type:'mountain'}},
			{id:55, coord: {x:4, y:3}, owner: {id:0, type:'nature', name:'Nature', class:'nature'}, field: {type:'mountain'}},
		],
		[
			{id:15, coord: {x:0, y:4}, owner: {id:0, type:'neutral', name:'Eowina', class:'germain'}, field: {type:'sea'}},
			{id:25, coord: {x:1, y:4}, owner: {id:0, type:'nature', name:'Nature', class:'nature'}, field: {type:'mountain'}},
			{id:35, coord: {x:2, y:4}, owner: {id:0, type:'nature', name:'Nature', class:'nature'}, field: {type:'forest'}},
			{id:45, coord: {x:3, y:4}, owner: {id:0, type:'nature', name:'Nature', class:'nature'}, field: {type:'desert'}},
			{id:55, coord: {x:4, y:4}, owner: {id:2, type:'enemy',  name:'Ququ', class:'gallic'}, field: {type:'desert'}},
		],
	];*/

	res.json({matrixTiles});
});

app.listen(3000, function() {
	console.log();
	console.log('Listening on port 3000');
});
