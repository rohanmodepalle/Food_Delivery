const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const BuyerSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		unique: true,
		trim: true
	},
	contact:{
		type: Number,
		required: true,
	},
	age:{
		type: Number,
		required: true
	},
	batch:{
		type: String,
		required: true
	},
	password:{
		type: String,
		required: true
	},
	favs: {
		type: [Object],
		required: false,
		default: []
	},
	balance: {
		type: Number,
		required: false,
		default: 0
	}
});

module.exports = Buyer = mongoose.model("Buyers", BuyerSchema);
