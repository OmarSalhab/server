const User = require("../models/User");
const { generateToken } = require("../middlewares/authMiddleware");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
dotenv({ path: "..\\config\\.env" });

const signupUser = async (req, res) => {
	const user = req.body;
	const newUser = new User(user);
	// implement otp email verfiyng
	await newUser.save();
	res
		.status(200)
		.json({ success: true, message: "Succsesfully added new user" });
};

const loginUser = async (req, res) => {
	const { email, passward } = req.body;
	const user = await User.findOne({ email: email });
	if (!user) {
		const err = new Error("User not found, Faild to login");
		err.statusCode = 404;
		throw err;
	}
	const isMatch = await bcrypt.compare(passward, user.password);
	if (!isMatch) {
		{
			const err = new Error("Invalid Password");
			err.statusCode = 401;
			throw err;
		}
	}
	const token = generateToken(user._id);
	res.json({
		success: true,
		token,
		user: {
			id: user._id,
			name: user.name,
			email: user.email,
		},
	});
};
const getUserById = async (req, res) => {
	const userId = req.params.id;
	const user = await User.findById(userId).select("name email");
	if (!user) {
		const err = new Error("User not found");
		err.statusCode = 404;
		throw err;
	}
	res.status(200).json({ success: true, data: user });
};

const getUserName = async (req, res) => {
	const userId = req.params.id;
	const user = await User.findById(userId).select("name");
	if (!user) {
		const err = new Error("User not found");
		err.statusCode = 404;
		throw err;
	}
	res.status(200).json({ success: true, data: user });
};

const getAllUsers = async (req, res) => {
	const allUsers = await User.find().select("name email");
	res.status(200).json({ success: true, data: allUsers });
};

module.exports = { signupUser, getUserById, getAllUsers, getUserName, loginUser };