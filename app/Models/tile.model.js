var mongoose = require('mongoose');

var Schema = mongoose.Schema;


/**
 * Tile Schema
 */
var TileSchema = new Schema({
	gridMapId: {
		type: Schema.ObjectId,
		ref: 'GridMap',
		required: 'A GridMap identification is mandatory'
	},
	coord: {
		x: {
			type: Number,
			required: 'Coord x is mandatory'
		},
		y: {
			type: Number,
			required: 'Coord y is mandatory'
		}
	},
	// ownerId: {
	// 	type : Schema.ObjectId,
	// 	ref: 'Player',
	// 	required: 'A Player identification is mandatory'
	// },
	owner: {
		type: String,
		required: 'An owner is mandatory'
	},
	field: {
		type: String,
		required: 'A field is mandatory'
	}
});

module.exports = mongoose.model('Tile', TileSchema);


	// format des tuiles :
	/*
		{
			id:number,
			map: Number,
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
