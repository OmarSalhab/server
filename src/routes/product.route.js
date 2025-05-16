const express = require("express");
const router = express.Router();
// // const {postUser, getUsers} = require('../controllers/user.controller')

// // router.get("/", getUsers);

// // router.post("/", postUser);

// router.delete("/:id", async (req, res) => {
// 	const userId = req.params?.id;
// 	if (!userId) return res.status(400).json({ message: "please provide id" });
// 	try {
// 		await User.deleteOne({ _id: userId });
// 		res.status(200).json({ success: true, message: "user deleted" });
// 	} catch (error) {
// 		res.status(500).json({ success: false });
// 	}
// });

module.exports = router;