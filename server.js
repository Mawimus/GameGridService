var express = require('express');
var mongoose = require('mongoose');
var app = express();

mongoose.connect('mongodb://localhost/gamegride');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {

	// Tile Schema
	var Schema = mongoose.Schema;
	var TileSchema = new Schema({
		coord: {
			x: Number,
			y: Number
		},
		owner: {
			type: String,
			name: String,
			class: String
		},
		field: {
			type: String
		}
	});

	// Tile Model
	var model = mongoose.model;
	var Tile = model('Tile', TileSchema);

});





app.get('/users', function(req, res) {
	res.send([
		{name:'Mawimus'},
		{name:'Poudjik'}
	]);
});

app.get('/user/:id', function(req, res) {
	res.send({id:req.params.id, name:'Mawimus', class:'roman'});
});

app.get('/matrix-tiles/:maxx/:maxy/:x/:y', function(req, res) {

	var maxx, maxy, x, y;
	maxx = req.params.maxx;
	maxy = req.params.maxy;
	x = req.params.x;
	y = req.params.y;

	// format des tuiles :
	/*
		{
			id:number,
			coord:object {
				x:number,
				y:number
			},
			owner:object {
				id:number,
				type:string,
				name:string,
				class:string
			},
			field:object {
				type:string
			},
			movement:object {
				in:list<object> [
					{
						id:number,
						from:object {
							id:number,
							coord:object {
								x:number,
								y:number
							},
							owner:object {
								id:number,
								type:string,
								name:string,
								class:string
							},
						},
						departureDate:datetime,
						eta:datetime,
						speed:number,
						troops:list<object> [
							{
								id:number,
								quantity:number
								unit:object {
									id:number,
									type:string,
									name:string,
									maxspeed:number
								},
								items:list<object> [
									{
										id:number,
										name:string
									}
								]
							}
						],
					}
				],
				out:list [
					id:number,
					to:object {
						id:number,
						coord:object {
							x:number,
							y:number
						},
						owner:object {
							id:number,
							type:string,
							name:string,
							class:string
						},
					},
					departureDate:datetime,
					eta:datetime,
					speed:number,
					troops:list<object> [
						{
							id:number,
							quantity:number
							unit:string
							items:list<object> [
								{
									id:number,
									name:string
								}
							]
						}
					],
				]
			}
		}
	*/
	var matrixTiles = [
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
	];

	res.json({matrixTiles});
});

app.listen(3000);
console.log('Listening on port 3000');
