const User = require("../models/User");
const {
	generateToken,
	generateRefreshToken,
} = require("../middlewares/authMiddleware");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config({ path: "..\\config\\.env" });
const jwt = require("jsonwebtoken");
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
		return res.status(404).json({ msg: "User not found, Faild to login" });
	}
	const isMatch = await bcrypt.compare(password, user.passwordHash);
	if (!isMatch) {
		{
			return res.status(401).json({ msg: "Invalid Password" });
		}
	}
	if (user.role === "driver" && !user.isApproved) {
		return res.status(403).json({ msg: "Driver not yet approved" });
	}
	const token = generateToken(user);
	const refreshToken = generateRefreshToken(user);

	// Send refresh token as httpOnly cookie
	res.cookie("refreshToken", refreshToken, {
		httpOnly: true,
		secure: false,
		sameSite: "none",
		maxAge: 3 * 60 * 1000, // 7 days
	});

	return res.status(200).json({
		token,
		user: {
			_id: user._id,
			name: user.name,
			phone: user.phone,
			gender: user.gender,
			routeId: user.route,
			ratingValue: user.ratingValue,
			role: user.role,
			createdAt: user.createdAt,
		},
	});
};

const refreshToken = (req, res) => {
	const refreshToken = req.cookies.refreshToken;

	if (!refreshToken) return res.status(401).json({ msg: "No refresh token" });

	jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, user) => {
		if (err) return res.status(403).json({ msg: "Invalid refresh token" });
		const accessToken = generateToken(user);
		res.json({ accessToken, user });
	});
};

const logout = (req, res) => {
	const refreshToken = req.cookies.refreshToken;
	if (!refreshToken)
		return res.status(204).json({ message: "No cookies content" });
	res.clearCookie("refreshToken", {
		httpOnly: true,
		secure: false,
		sameSite: "none",
	});
	res.json({ message: "Cookie cleared" });
};

const userInfo = async (req, res) => {
	const userId = req.user.id;
	const userDocument = await User.findById(userId, {
		passwordHash: 0,
		isApproved: 0,
		updatedAt: 0,
		__v: 0,
		rating: 0,
		ratingsCount: 0,
	});
	if (!userDocument) return res.json({ message: "User not found." });
	res.json(userDocument);
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
	userInfo,
	refreshToken,
	logout,
};
