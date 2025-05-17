const User = require("../models/User");
const { generateToken } = require("../middlewares/authMiddleware");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config({ path: "..\\config\\.env" });

const signupUser = async (req, res) => {
	const { name, email, password } = req.body;
	const user = { name, email, password };
	// implement otp email verfiyng
	user.role = "user";
	const newUser = new User(user);
	await newUser.save();
	res
		.status(200)
		.json({ success: true, message: "Succsesfully added new user" });
};

const loginUser = async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email: email });
	if (!user) {
		const err = new Error("User not found, Faild to login");
		err.statusCode = 404;
		throw err;
	}
	const isMatch = await bcrypt.compare(password, user.password);
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
			role: user.role,
		},
	});
};

const getUserName = async (req, res) => {
	const userId = req.params.id;
	if (req.user._id.toString() !== userId) {
		return res.status(403).json({
			success: false,
			message: "Forbidden: You can only access your own profile.",
		});
	}
	const user = await User.findById(userId).select("name");
	if (!user) {
		const err = new Error("User not found");
		err.statusCode = 404;
		throw err;
	}
	res.status(200).json({ success: true, data: user });
};

const getUserById = async (req, res) => {
	const userId = req.params.id;

	if (req.user._id.toString() !== userId) {
		return res.status(403).json({
			success: false,
			message: "Forbidden: You can only access your own profile.",
		});
	}
	const user = await User.findById(req.user._id).select("name email");
	if (!user) {
		const err = new Error("User not found");
		err.statusCode = 404;
		throw err;
	}
	res.status(200).json({ success: true, data: user });
};

const updateUserInfo = async (req, res) => {
	const userId = req.params.id;

	if (req.user._id.toString() !== userId) {
		return res.status(403).json({
			success: false,
			message: "Forbidden: You can only update your own profile.",
		});
	}

	const { name, email, password } = req.body;

	const user = await User.findById(req.user._id);
	if (!user) {
		return res.status(404).json({
			success: false,
			message: "User not found",
		});
	}

	if (name) user.name = name;
	if (email) user.email = email;
	if (password) user.password = password; // Will be hashed by pre-save hook

	await user.save();

	res.status(200).json({
		success: true,
		message: "Successfully updated user",
		data: {
			name: user.name,
			email: user.email,
		},
	});
};

const getAllUsers = async (req, res) => {
	const allUsers = await User.find().select("name email");
	res.status(200).json({ success: true, data: allUsers });
};

const deleteUser = async (req, res) => {
	const userId = req.params.id;
	if(req.params.id == req.user._id.toString()){
		const err = new Error("This action can't be done");
		err.statusCode = 401;
		throw err;
	}
	const user = await User.deleteOne({ _id: userId });
	if (user.deletedCount === 0) {
		const err = new Error("User not found");
		err.statusCode = 404;
		throw err;
	}
	res.json({ success: true, message: "user has been deleted" });
};

module.exports = {
	signupUser,
	getUserById,
	getAllUsers,
	getUserName,
	loginUser,
	updateUserInfo,
	deleteUser,
};
