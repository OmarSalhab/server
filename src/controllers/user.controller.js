const User = require("../models/User");
const { generateToken } = require("../middlewares/authMiddleware");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config({ path: "..\\config\\.env" });

const signupDriver = async (req, res) => {
	const {
		name,
		phone,
		password,
		gender,
		routeId,
		carModel,
		nationalId,
		imageUrl,
	} = req.body;

	const exists = await User.findOne({ phone });
	if (exists)
		return res.status(400).json({ message: "Phone already registered" });
	// implement otp email verfiyng
	const newDriver = new User({
		role: "driver",
		name,
		phone,
		passwordHash: password,
		gender,
		routeId,
		carModel,
		nationalId,
		imageUrl,
		isApproved: false, // Manual approval required
	});

	await newDriver.save();

	return res
		.status(201)
		.json({ message: "Driver registered and pending approval" });
};

const signupPassenger = async (req, res) => {
	const { name, phone, password, gender, routeId } = req.body;

	const exists = await User.findOne({ phone });
	if (exists)
		return res.status(400).json({ message: "Phone already registered" });
	// implement otp email verfiyng
	const newPassenger = new User({
		role: "passenger",
		name,
		phone,
		passwordHash: password,
		gender,
		routeId,
		isApproved: true, // Not needed but for uniformity
	});

	await newPassenger.save();
	return res.status(201).json({ message: "Passenger registered successfully" });
};

const loginUser = async (req, res) => {
	const { phone, password } = req.body;
	const user = await User.findOne({ phone: phone });
	if (!user) {
		const err = new Error("User not found, Faild to login");
		err.statusCode = 404;
		throw err;
	}
	const isMatch = await bcrypt.compare(password, user.passwordHash);
	if (!isMatch) {
		{
			const err = new Error("Invalid Password");
			err.statusCode = 401;
			throw err;
		}
	}
	if (user.role === "driver" && !user.isApproved) {
		return res.status(403).json({ message: "Driver not yet approved" });
	}
	const token = generateToken(user);
	return res.status(200).json({
		token,
		user: {
			id: user._id,
			name: user.name,
			role: user.role,
			phone: user.phone,
			route: user.route,
		},
	});
};

const updateUserRoutes = async (req, res) => {
	const { from, to } = req.body;
	const userId = req.user.id;

	if (!from || !to) {
		return res
			.status(400)
			.json({ message: 'Both "from" and "to" are required' });
	}

	const user = await User.findByIdAndUpdate(
		userId,
		{ route: { from, to } },
		{ new: true }
	);

	if (!user) {
		return res.status(404).json({ message: "User not found" });
	}

	res.status(200).json({
		message: "Route updated successfully",
		route: user.route,
	});
};

module.exports = {
	signupDriver,
	signupPassenger,
	loginUser,
	updateUserRoutes,
};
