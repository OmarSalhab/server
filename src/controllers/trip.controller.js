const Trip = require("../models/Trip");
const Route = require("../models/Route");

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
	const tripId = await Route.findOne({
		from: user.route.from,
		to: user.route.to,
	});

	if (!tripId) {
		return res.status(404).json({
			success: false,
			message: "Driver route not found in User collection.",
		});
	}

	const newTrip = new Trip({
		driverId: user._id,
		tripId,
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

const getAvailableTrips = async (req, res) => {
	// Get passenger's route preference from User model
	const passenger = await User.findById(req.user.id);

	// Find active rides matching passenger's route
	const availableRides = await Trip.find({
		route: passenger.route,
		status: "active",
		availableSeats: { $gt: 0 },
	}).populate("driver", "name phone");

	res.status(200).json({
		success: true,
		data: availableRides,
	});
};

const joinTrip = async (req, res) => {
	try {
		const { tripId } = req.params;
		const { requestedSeats } = req.body;

		const trip = await Trip.findById(tripId);

		if (!trip) {
			return res.status(404).json({
				success: false,
				message: "Ride not found",
			});
		}

		if (trip.availableSeats < requestedSeats) {
			return res.status(400).json({
				success: false,
				message: "Not enough seats available",
			});
		}
		// Add passenger to ride
		trip.passengers.push({
			user: req.user.id,
			requestedSeats,
			status: "pending",
		});

		await trip.save();

		res.status(200).json({
			success: true,
			message: "Join request sent successfully",
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error joining ride",
		});
	}
};
module.exports = {
	createTrip,
	getAvailableTrips,
	joinTrip,
};
