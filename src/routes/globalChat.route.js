const express = require("express");
const router = express.Router();
const { getChat,getMembers } = require("../controllers/globalChat.controller");
const { protect } = require("../middlewares/authMiddleware");
const asyncHandler = require("express-async-handler");
router.get("/", protect, asyncHandler(getChat));
router.get("/members", protect, asyncHandler(getMembers));

module.exports = router;
