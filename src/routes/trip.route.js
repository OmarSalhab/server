const express = require("express");
const router = express.Router();
const {
	createTrip,
	getAvailableTrips,
	joinTrip,
	exitTrip,
} = require("../controllers/trip.controller");
const {
	protect,
	isAuthorizedDriver,
	isPassenger,
} = require("../middlewares/authMiddleware");
const asyncHandler = require("express-async-handler");

router.get("/available", protect, asyncHandler(getAvailableTrips));

//Passenger Queries
router.post("/join/:tripId", protect, isPassenger, asyncHandler(joinTrip));
router.post("/exit/:tripId", protect, isPassenger, asyncHandler(exitTrip));

//Driver Queries
router.post("/", protect, isAuthorizedDriver, asyncHandler(createTrip));

module.exports = router;
