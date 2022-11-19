const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FoodItemSchema = new Schema({
	name: {
		type: String,
		required: true
	},
    canteen: {
        type: String,
        required: true,
    },
	price: {
		type: Number,
		required: true,
	},
	rating:{
		type: Number,
		required: false,
        default: 0
	},
    type: {
        type: String,
        required: true
    },
    orderCount: {
        type: Number,
        required: false,
        default: 0
    },
    tags: {
        type: [String],
        required: false
    },
    addons: {
        type: [Object],
        required: false
    }
});

FoodItemSchema.index({name: 1, canteen: 1}, {unique: true});
module.exports = FoodItem = mongoose.model("FoodItems", FoodItemSchema);