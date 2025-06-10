const mongoose = require("mongoose");

const joinedPassengerSchema = new mongoose.Schema(
	{
		passenger: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
		seatId: { type: Number, required: true },
	},
	{ _id: false }
);

const tripSchema = new mongoose.Schema({
	driverId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	routeId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Route",
		required: true,
	},

	departureTime: { type: Date, required: true },
	price: { type: Number, required: true },
	description: String,
	availableSeats: {
		type: Number,
		required: true,
		min: 0,
		max: 4,
	},
	status: {
		type: String,
		enum: ["active", "completed", "cancelled"],
		default: "active",
	},
	joinedPassengers: [joinedPassengerSchema],
	createdAt: { type: Date, default: Date.now },
});

const Trip = mongoose.model("Trip", tripSchema);
module.exports = Trip;
