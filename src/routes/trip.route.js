const express = require("express");
const router = express.Router();
const {
	createTrip,
	getAvailableTrips,
	joinTrip,
	exitTrip,
	kickPassenger,
	rateDriver,
	getMyTrips,
	getPassengers,
	ratePassenger,
} = require("../controllers/trip.controller");
const {
	protect,
	isAuthorizedDriver,
	isPassenger,
} = require("../middlewares/authMiddleware");
const asyncHandler = require("express-async-handler");
const { isCompleted } = require("../middlewares/ratingMiddleware");


router.get("/available", protect, asyncHandler(getAvailableTrips));

//Passenger Queries
router.post("/join/:tripId", protect, isPassenger, asyncHandler(joinTrip));
router.post(
	"/rate/:tripId/:userId",
	protect,
	isPassenger,
	isCompleted,
	asyncHandler(rateDriver)
);
router.delete("/exit/:tripId", protect, isPassenger, asyncHandler(exitTrip));

//Driver Queries
router.get("/me", protect, isAuthorizedDriver, asyncHandler(getMyTrips));
router.post("/:tripId", protect, isAuthorizedDriver, asyncHandler(getPassengers));
router.post("/", protect, isAuthorizedDriver, asyncHandler(createTrip));
router.post(
	"/rate/:tripId/:userId",
	protect,
	isAuthorizedDriver,
	isCompleted,
	asyncHandler(ratePassenger)
);
router.delete(
	"/kick/:tripId/:passengerId",
	protect,
	isAuthorizedDriver,
	asyncHandler(kickPassenger)
);

module.exports = router;
