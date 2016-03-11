var mongoose = require('mongoose');
var Schema = mongoose.Schema;


/**
 * Tile Schema
 */
var TileSchema = new Schema({
	coord: {
		x: Number,
		y: Number
	},
	owner: {
		id : Schema.ObjectId,
		ref: 'Player'
	},
	field: {
		type: String
	}
});

mongoose.model('Tile', TileSchema);


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
