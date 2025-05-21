const express = require("express");
const router = express.Router();
const {
	createTrip,
	getAvailableTrips,
	joinTrip,
} = require("../controllers/trip.controller");
const {
	protect,
	isAuthorizedDriver,
} = require("../middlewares/authMiddleware");
const asyncHandler = require("express-async-handler");

//Passenger Queries
router.get("/available", protect, asyncHandler(getAvailableTrips));

router.post("/join/:tripId", protect, asyncHandler(joinTrip));

//Driver Queries
router.post("/", protect, isAuthorizedDriver, asyncHandler(createTrip));

module.exports = router;
