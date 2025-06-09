const express = require("express");
const router = express.Router();
const { getChat } = require("../controllers/tripChat.controller");
const { protect } = require("../middlewares/authMiddleware");
const asyncHandler = require("express-async-handler");
router.get("/:tripId", protect, asyncHandler(getChat));

module.exports = router;
