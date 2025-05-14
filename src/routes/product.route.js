const express = require("express");
const router = express.Router();
const { User } = require("../models/User");
const asyncHandler = require("express-async-handler");

router.get("/", (req, res) => {
	res.send(`Server is running. ${req.headers.host}`);
});

router.post("/", async (req, res) => {
	const user = req.body;
	if (!user.name || !user.email || !user.password)
		return res
			.status(400)
			.json({ success: false, message: "please provide all feilds" });
	try {
		const newUser = User(user);
		await newUser.save();
		res.status(200).json({ success: true, data: newUser });
	} catch (error) {
		res.status(500).json({ success: false, message: "internal server Error" });
	}
});

router.delete("/:id", async (req, res) => {
	const userId = req.params?.id;
	if (!userId) return res.status(400).json({ message: "please provide id" });
	try {
		await User.deleteOne({ _id: userId });
		res.status(200).json({ success: true, message: "user deleted" });
	} catch (error) {
		res.status(500).json({ success: false });
	}
});

module.exports = router;