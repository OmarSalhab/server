const express = require("express");
const router = express.Router();
const { getChat,getMembers } = require("../controllers/globalChat.controller");
const { protect } = require("../middlewares/authMiddleware");
router.get("/", protect, getChat);
router.get("/members", protect, getMembers);

module.exports = router;
