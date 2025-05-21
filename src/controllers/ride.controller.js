// /** IMPLEMENT A LOT OF Ride CONTROLLERS */
// const User = require("../models/User");
// const Ride = require("../models/Ride");


// const getAvailableRides = async (req, res) => {
// 	try {
// 		// Get passenger's route preference from User model
// 		const passenger = await User.findById(req.user.id);

// 		// Find active rides matching passenger's route
// 		const availableRides = await Ride.find({
// 			route: passenger.route,
// 			status: "active",
// 			availableSeats: { $gt: 0 },
// 		}).populate("driver", "name phone");

// 		res.status(200).json({
// 			success: true,
// 			data: availableRides,
// 		});
// 	} catch (error) {
// 		res.status(500).json({
// 			success: false,
// 			message: "Error fetching available rides",
// 		});
// 	}
// };

// const joinRide = async (req, res) => {
// 	try {
// 		const { rideId } = req.params;
// 		const { requestedSeats } = req.body;

// 		const ride = await Ride.findById(rideId);

// 		if (!ride) {
// 			return res.status(404).json({
// 				success: false,
// 				message: "Ride not found",
// 			});
// 		}

// 		if (ride.availableSeats < requestedSeats) {
// 			return res.status(400).json({
// 				success: false,
// 				message: "Not enough seats available",
// 			});
// 		}

// 		// Add passenger to ride
// 		ride.passengers.push({
// 			user: req.user.id,
// 			requestedSeats,
// 			status: "pending",
// 		});

// 		await ride.save();

// 		res.status(200).json({
// 			success: true,
// 			message: "Join request sent successfully",
// 		});
// 	} catch (error) {
// 		res.status(500).json({
// 			success: false,
// 			message: "Error joining ride",
// 		});
// 	}
// };

// const updatePassengerRoute = async (req, res) => {
// 	try {
// 		const { route } = req.body;

// 		const updatedUser = await User.findByIdAndUpdate(
// 			req.user.id,
// 			{ route },
// 			{ new: true }
// 		);

// 		res.status(200).json({
// 			success: true,
// 			message: "Route updated successfully",
// 			data: {
// 				route: updatedUser.route,
// 			},
// 		});
// 	} catch (error) {
// 		res.status(500).json({
// 			success: false,
// 			message: "Error updating route preference",
// 		});
// 	}
// };

// const createRide = async (req, res) => {
// 	try {
// 		// Check if user is a rider
// 		if (req.user.role !== "rider") {
// 			return res.status(403).json({
// 				success: false,
// 				message: "Only riders can create rides",
// 			});
// 		}

// 		// Check if rider is verified
// 		if (!req.user.riderVerification.isVerified) {
// 			return res.status(403).json({
// 				success: false,
// 				message: "Rider must be verified to create rides",
// 			});
// 		}

// 		const { route, departureTime, availableSeats, price } = req.body;

// 		// Create new ride
// 		const newRide = new Ride({
// 			driver: req.user.id,
// 			route,
// 			departureTime,
// 			availableSeats,
// 			price,
// 			status: "active",
// 		});

// 		await newRide.save();

// 		// Add ride to user's rides array
// 		await User.findByIdAndUpdate(req.user.id, {
// 			$push: { rides: newRide._id },
// 		});

// 		res.status(201).json({
// 			success: true,
// 			message: "Ride created successfully",
// 			data: newRide,
// 		});
// 	} catch (error) {
// 		res.status(500).json({
// 			success: false,
// 			message: "Error creating ride",
// 		});
// 	}
// };

// module.exports = {
// 	getAvailableRides,
// 	joinRide,
// 	updatePassengerRoute,
// 	createRide,
// };
