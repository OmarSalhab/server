const Trip = require("../models/Trip");
const Route = require("../models/Route");
const formatTrip = require("./utils/dateFormat");
const User = require("../models/User");
const { getIO } = require("../config/socket");
//driver
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

	const trp = await Trip.findById(newTrip._id )
		.populate("driverId", "name phone gender ratingValue")
		.populate("routeId", "to from roomName");
		
	 getIO().to(routeId._id.toString()).emit("new_ride", formatTrip(trp));
	
	res.status(201).json({ success: true, data: formatTrip(trp) });
};

const getAvailableTrips = async (req, res) => {
	const user = await User.findById(req.user.id);

	const availableRides = await Trip.find({
		routeId: user.routeId,
		status: "active",
		availableSeats: { $gt: 0 },
	})
		.populate("driverId", "name phone gender ratingValue")
		.populate("routeId", "to from roomName");

	const formattedRides = availableRides.map(formatTrip);
	// console.log(formattedRides);

	res.status(200).json({
		success: true,
		data: formattedRides,
	});
};

const getMyTrips = async (req, res) => {
	const user = await User.findById(req.user.id);

	if (!user)
		return res.status(401).json({
			success: false,
			message: "new user found",
		});
	const myTrips = await Trip.find({
		driverId: user._id,
		status: "active",
		availableSeats: { $gt: 0 },
	})
		.populate("driverId", "name phone gender ratingValue")
		.populate("routeId", "to from roomName");

	const formattedRides = myTrips.map(formatTrip);
	// console.log(formattedRides);

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
		const exists = trip.joinedPassengers.findIndex(
			(p) => p.passenger.toString() === req.user.id
		);
		if (exists !== -1) {
			return res.status(400).json({
				success: false,
				message: "the passenger already exists",
			});
		}

		trip.joinedPassengers.push({
			passenger: req.user.id,
			requestedSeats,
		});
		trip.availableSeats -= Number(requestedSeats);

		await trip.save();

		res.status(200).json({
			success: true,
			message: "Joinedsuccessfully",
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error joining ride",
		});
	}
};

const exitTrip = async (req, res) => {
	try {
		const { tripId } = req.params;

		const trip = await Trip.findById(tripId);

		if (!trip) {
			return res.status(404).json({
				success: false,
				message: "Ride not found",
			});
		}

		const passengerIndex = trip.joinedPassengers.findIndex(
			(p) => p.passenger.toString() === req.user.id
		);

		if (passengerIndex === -1) {
			return res.status(400).json({
				success: false,
				message: "No passenger with this id in this trip",
			});
		}

		const requestedSeats = trip.joinedPassengers[passengerIndex].requestedSeats;

		trip.joinedPassengers.splice(passengerIndex, 1);

		trip.availableSeats += Number(requestedSeats);

		await trip.save();

		res.status(200).json({
			success: true,
			message: "You have exited the trip successfully",
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error joining ride",
		});
	}
};

const kickPassenger = async (req, res) => {
	const { passengerId } = req.params;
	const { id } = req.user;
	const trip = await Trip.findOne({ driverId: id });
	if (!trip) {
		return res.json({ success: false, message: "there is no trip" });
	}
	const passengerIndex = trip.joinedPassengers.findIndex(
		(p) => p.passenger.toString() === passengerId
	);
	if (passengerIndex === -1) {
		return res.json({
			success: false,
			message: "there is no passenger in the trip",
		});
	}
	trip.joinedPassengers.splice(passengerIndex, 1);

	await trip.save();
	res.status(200).json({
		success: true,
		message: "You kicked the user successfully",
		data: trip,
	});
};

const rateDriver = async (req, res) => {
	const { tripId, userId } = req.params;
	const stars = Number(req.query.stars);
	const fromUserId = req.user.id;

	if (!stars || stars < 1 || stars > 5) {
		return res
			.status(400)
			.json({ success: false, message: "Stars must be between 1 and 5" });
	}
	// Find the trip and driver
	const trip = await Trip.findById(tripId);
	if (!trip) {
		return res.status(404).json({ success: false, message: "Trip not found" });
	}
	const driver = await User.findById(userId);
	if (!driver) {
		return res
			.status(404)
			.json({ success: false, message: "Driver not found" });
	}
	// Prevent duplicate rating for the same trip by the same passenger
	const alreadyRated = driver.rating.some(
		(r) =>
			r.fromUserId.toString() === fromUserId && r.tripId.toString() === tripId
	);
	if (alreadyRated) {
		return res.status(400).json({
			success: false,
			message: "You have already rated this driver for this trip",
		});
	}

	// Add the rating
	driver.rating.push({
		fromUserId,
		tripId,
		stars,
	});
	driver.ratingsCount = (driver.ratingsCount || 0) + 1;

	// Calculate new average rating
	const totalStars = driver.rating.reduce((sum, r) => sum + r.stars, 0);
	const avgRating = totalStars / driver.rating.length;
	driver.ratingValue = avgRating; // Optionally store average

	await driver.save();
	res.status(200).json({
		success: true,
		message: "Driver rated successfully",
		rating: {
			stars,
			fromUserId,
			tripId,
		},
		average: avgRating,
	});
};

const ratePassenger = async (req, res) => {
	try {
		const { tripId, userId } = req.params; // userId is the passenger to be rated
		const stars = Number(req.query.stars);
		const driverId = req.user.id;

		if (!stars || stars < 1 || stars > 5) {
			return res
				.status(400)
				.json({ success: false, message: "Stars must be between 1 and 5" });
		}

		// Find the trip
		const trip = await Trip.findById(tripId);
		if (!trip) {
			return res
				.status(404)
				.json({ success: false, message: "Trip not found" });
		}

		// Check if the current user is the driver of the trip
		if (trip.driverId.toString() !== driverId) {
			return res.status(403).json({
				success: false,
				message: "Only the driver can rate passengers",
			});
		}

		// Prevent the passenger from rating themselves
		if (userId === driverId) {
			return res
				.status(400)
				.json({ success: false, message: "You cannot rate yourself" });
		}

		// Check if the passenger was part of the trip
		const passengerInTrip = trip.joinedPassengers.some(
			(p) => p.passenger.toString() === userId
		);
		if (!passengerInTrip) {
			return res.status(400).json({
				success: false,
				message: "Passenger was not part of this trip",
			});
		}

		// Find the passenger user
		const passenger = await User.findById(userId);
		if (!passenger) {
			return res
				.status(404)
				.json({ success: false, message: "Passenger not found" });
		}

		// Prevent duplicate rating for the same trip by the same driver
		const alreadyRated = passenger.rating.some(
			(r) =>
				r.fromUserId.toString() === driverId && r.tripId.toString() === tripId
		);
		if (alreadyRated) {
			return res.status(400).json({
				success: false,
				message: "You have already rated this passenger for this trip",
			});
		}

		// Add the rating
		passenger.rating.push({
			fromUserId: driverId,
			tripId,
			stars,
		});
		passenger.ratingsCount = (passenger.ratingsCount || 0) + 1;

		// Calculate new average rating
		const totalStars = passenger.rating.reduce((sum, r) => sum + r.stars, 0);
		const avgRating = totalStars / passenger.rating.length;
		passenger.ratingValue = avgRating; // Optionally store average

		await passenger.save();
		res.status(200).json({
			success: true,
			message: "Passenger rated successfully",
			rating: {
				stars,
				fromUserId: driverId,
				tripId,
			},
			average: avgRating,
		});
	} catch (error) {
		res.status(500).json({ success: false, message: "Error rating passenger" });
	}
};

module.exports = {
	createTrip,
	getAvailableTrips,
	exitTrip,
	kickPassenger,
	joinTrip,
	getMyTrips,
	rateDriver,
	ratePassenger,
};
