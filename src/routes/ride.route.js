// const express = require("express");
// const router = express.Router();
// const asyncHandler = require("express-async-handler");
// const { protect, isAuthorizedAdmin, isAuthorizedRider } = require("../middlewares/authMiddleware");
// const {
// 	getAvailableRides,
// 	joinRide,
// 	updatePassengerRoute,
// 	createRide,
// } = require("../controllers/ride.controller");

// /*Passenger Role Queries*/
// // Get available rides matching passenger's route
// router.get("/available",protect, asyncHandler(getAvailableRides));

// // Join a specific ride
// router.post("/join/:rideId",protect, asyncHandler(joinRide));

// // Update passenger's preferred route
// router.patch("/update-route",protect, asyncHandler(updatePassengerRoute));

// //Rider Role Queries
// router.post("/create", protect,isAuthorizedRider, asyncHandler(createRide));


// module.exports = router;
