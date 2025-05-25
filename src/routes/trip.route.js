const express = require("express");
const router = express.Router();
const {
	createTrip,
	getAvailableTrips,
	joinTrip,
	exitTrip,
	kickPassenger,
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
router.delete("/exit/:tripId", protect, isPassenger, asyncHandler(exitTrip));

//Driver Queries
router.post("/", protect, isAuthorizedDriver, asyncHandler(createTrip));
router.delete("/kick/:passengerId", protect, isAuthorizedDriver, asyncHandler(kickPassenger));

module.exports = router;
