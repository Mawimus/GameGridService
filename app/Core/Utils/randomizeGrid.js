
// http://davidbau.com/archives/2010/01/30/random_seeds_coded_hints_and_quintillions.html
var seedrandom = require('seedrandom');

// http://stackoverflow.com/questions/8435183/generate-a-weighted-random-number
function weightedRand(seed, spec) {
	var i, j, table = [];
	for (i in spec) {
		// The constant 10 below should be computed based on the
		// weights in the spec for a correct and optimal table size.
		// E.g. the spec {0:0.999, 1:0.001} will break this impl.
		for (j = 0; j < spec[i]*100; j++) {
			table.push(i);
		}
	}
	return function() {
		rand = seedrandom(seed);
		return table[Math.floor(rand() * table.length)];
	}
}

exports.generateWithSeed = function(seed, x, y, spec) {
	var randomizeGrid = [];
	var random;
	for (j = 0; j < y; j++) {
		for (i = 0; i < x; i++) {
			random = weightedRand(seed+i+j, spec);
			randomizeGrid.push(random());
		}
	}
	return randomizeGrid;
}

exports.generateLocalWithSeed = function(seed, maxx, maxy, currentx, currenty, spec) {
	var randomizeGrid = [];
	var random;
	for (j = currenty; j < maxy + currenty; j++) {
		for (i = currentx; i < maxx + currentx; i++) {
			random = weightedRand(seed+i+j, spec);
			randomizeGrid.push(random());
		}
	}
	return randomizeGrid;
}

