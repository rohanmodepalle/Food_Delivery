const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const VendorSchema = new Schema({
	managerName: {
		type: String,
		required: true
	},
    shopName: {
        type: String,
        required: true,
        unique: true
    },
	email: {
		type: String,
		required: true,
		unique: true,
		trim: true
	},
	contact:{
		type: Number,
		required: true
	},
    openTime: {
        type: String,
        required: true
    },
    closeTime: {
        type: String,
        required: true
    },
	password: {
		type: String,
		required: true
	}
});

module.exports = Vendor = mongoose.model("Vendors", VendorSchema);