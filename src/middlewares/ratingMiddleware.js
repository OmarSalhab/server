const Trip = require("../models/Trip");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");

const isCompleted = asyncHandler(async (req, res, next) => {
	const trip = await Trip.findOne({ _id: req.params.tripId });
	const user = await User.findById(req.params.userId);
	if (!trip) {
		return res.json({ message: "No trip found" });
	}
	if (!user) {
		return res.json({ message: "No user found" });
	}
	const passengerIndex = trip.joinedPassengers.findIndex(
		(p) => p.passenger.toString() === user._id
	);
	//checking for Passenger
	if (trip.status.toString() === "completed" && passengerIndex !== -1) {
		next();
	}
	//checking for Driver
	else if (
		trip.status.toString() === "completed" &&
		trip.driverId.toString() === user._id
	) {
		next();
	} else {
		return res.json({ message: "you are unable to rate this person" });
	}
});

module.exports = { isCompleted };
