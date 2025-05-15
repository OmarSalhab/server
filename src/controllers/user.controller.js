const { Product } = require("../models/Product");
const asyncHandler = require("express-async-handler");


export const getUsers = (req, res) => {
	res.send(`Server is running. ${req.headers.host}`);
}


export const postUser = async (req, res) => {
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
};