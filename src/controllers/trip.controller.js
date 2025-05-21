const Trip = require("../models/Trip");


const createTrip = async (req, res) => {
	const user = req.user;

	if (user.role !== "driver" || !user.isApproved) {
		return res.status(403).json({
			success: false,
			message: "Access denied. Driver not approved.",
		});
	}

	const { departureTime, price, description, availableSeats } = req.body;

	if (!departureTime || !price || !availableSeats) {
		return res.status(400).json({
			success: false,
			message:
				"departureTime, price, description, and availableSeats are required.",
		});
	}

	if (!route) {
		return res.status(404).json({
			success: false,
			message: "Driver route not found in User collection.",
		});
	}

	const newTrip = new Trip({
		driverId: user._id,
		route: user.route,
		departureTime,
		dateOfTrip,
		price: Number(price),
		description,
		availableSeats: Number(availableSeats),
		joinedPassengers: [],
	});

	await newTrip.save();

	res.status(201).json({ success: true, data: newTrip });
};

module.exports = {
	createTrip,
};
