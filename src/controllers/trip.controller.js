const Trip = require("../models/Trip");
const Route = require("../models/Route");
const formatTrip = require("./utils/dateFormat");
const User = require("../models/User");

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
	let parsedDepartureTime = new Date(departureTime);
	if (isNaN(parsedDepartureTime.getTime())) {
		return res.status(400).json({
			success: false,
			message: "Invalid departureTime format. Use ISO 8601 string.",
		});
	}
	const routeId = await Route.findOne(
		{
			_id: user.routeId,
		},
		{ _id: 1 }
	);

	if (!routeId) {
		return res.status(404).json({
			success: false,
			message: "Driver route not found in User collection.",
		});
	}

	const newTrip = new Trip({
		driverId: user._id,
		routeId,
		departureTime: parsedDepartureTime,
		price: Number(price),
		description,
		availableSeats: Number(availableSeats),
		joinedPassengers: [],
	});

	await newTrip.save();

	res.status(201).json({ success: true, data: formatTrip(newTrip) });
};

const getAvailableTrips = async (req, res) => {
	const user = await User.findById(req.user.id);

	const availableRides = await Trip.find({
		routeId: user.routeId,
		status: "active",
		availableSeats: { $gt: 0 },
	}).populate("driverId", "name phone");

	const formattedRides = availableRides.map(formatTrip);
	res.status(200).json({
		success: true,
		data: formattedRides,
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

		if (trip.availableSeats < Number(requestedSeats)) {
			return res.status(400).json({
				success: false,
				message: "Not enough seats available",
			});
		}
		// Add passenger to ride
		trip.joinedPassengers.push({
			passenger: req.user.id,
			requestedSeats,
		});
		trip.availableSeats += requestedSeats;

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
