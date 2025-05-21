// const mongoose = require("mongoose");

// const rideSchema = new mongoose.Schema(
// 	{
// 		driver: {
// 			type: mongoose.Schema.Types.ObjectId,
// 			ref: "User",
// 			required: true,
// 		},
// 		route: {
// 			type: String,
// 			required: true,A
// 			enum: [
// 				"Amman-Zarqa",
// 				"Amman-Irbid",
// 				"Amman-Salt",
// 				"Amman-Madaba",
// 				"Zarqa-Irbid",
// 				"Irbid-Ajloun",
// 				"Amman-Aqaba",
// 				"Amman-Jerash",
// 				"Zarqa-Salt",
// 				"Irbid-Jerash",
// 			],
// 		},
// 		departureTime: {
// 			type: Date,
// 			required: true,
// 		},
// 		availableSeats: {
// 			type: Number,
// 			required: true,
// 			min: 1,
// 			max: 4,
// 		},
// 		price: {
// 			type: Number,
// 			required: true,
// 		},
// 		status: {
// 			type: String,
// 			required: true,
// 			enum: ["active", "completed", "cancelled"],
// 			default: "active",
// 		},
// 		passengers: [
// 			{
// 				user: {
// 					type: mongoose.Schema.Types.ObjectId,
// 					ref: "User",
// 				},
// 				requestedSeats: {
// 					type: Number,
// 					required: true,
// 					min: 1,
// 				},
// 				status: {
// 					type: String,
// 					enum: ["pending", "confirmed", "cancelled"],
// 					default: "pending",
// 				},
// 			},
// 		],
// 	},
// 	{ timestamps: true }
// );

// const Ride = mongoose.model("Ride", rideSchema);
// module.exports = Ride;
