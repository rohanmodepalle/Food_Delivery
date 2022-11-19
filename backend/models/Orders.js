const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
	buyeremail: {
		type: String,
		required: true,
	},
	fooditem: {
		type: String,
		required: true
	},
    addons: {
        type: [Object],
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    canteen: {
		type: String,
		required: true
	},
	quantity:{
		type: Number,
		required: true
	},
    time: {
		type: String,
		required: false
	},
	status: {
		type: String,
		required: true,
	},
	isRated: {
		type: Boolean,
		required: false,
		default: false
	}
});

OrderSchema.index({buyeremail: 1, time: 1}, {unique: true});
module.exports = Order = mongoose.model("Orders", OrderSchema);