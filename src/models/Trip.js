const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
	driverId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	tripId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Route",
		required: true,
	},
	route: {
		from: { type: String, required: true },
		to: { type: String, required: true },
	},
	departureTime: { type: Date, required: true },
	price: { type: Number, required: true },
	description: String,
	availableSeats: {
		type: Number,
		required: true,
		min: 1,
		max: 4,
	},
	status: {
		type: String,
		enum: ["active", "completed", "cancelled"],
		default: "active",
	},
	joinedPassengers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
	createdAt: { type: Date, default: Date.now },
});

const Trip = mongoose.model("Trip", tripSchema);
module.exports = Trip;
