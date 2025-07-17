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
	// implement otp email verfiyng in the future
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
	const user = await User.findOne({ phone: phone }).populate(
		"routeId",
		"roomName"
	);
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
		sameSite: "None",
		secure: true,
		maxAge:2 * 24 * 60 * 60 * 1000, // 2 days
	});

	return res.status(200).json({
		token,
		user: {
			_id: user._id,
			name: user.name,
			phone: user.phone,
			gender: user.gender,
			routeId: user.routeId,
			ratingValue: user.ratingValue,
			ratingsCount: user.ratingsCount,
			role: user.role,
			createdAt: user.createdAt,
		},
	});
};

const refreshToken = (req, res) => {
	const refreshToken = req.cookies.refreshToken;

	if (!refreshToken) return res.status(401).json({ msg: "No refresh token" });

	jwt.verify(refreshToken, process.env.REFRESH_SECRET, async (err, userJwt) => {
		const user = await User.find(
			{ _id: userJwt.id },
			{
				__v: 0,
				passwordHash: 0,
				rating: 0,
				isApproved: 0,
				updatedAt: 0,
				carModel: 0,
				nationalId: 0,
				imageUrl: 0,
			}
		).populate("routeId", "roomName");

		if (err) return res.status(403).json({ msg: "Invalid refresh token" });
		const accessToken = jwt.sign(
			{ id: userJwt.id, role: userJwt.role },
			process.env.ACCESS_SECRET,
			{ expiresIn: "15m" }
		);
		res.json({ accessToken, user });
	});
};

const logout = (req, res) => {
	const refreshToken = req.cookies.refreshToken;
	if (!refreshToken)
		return res.status(204).json({ message: "No cookies content" });
	res.clearCookie("refreshToken", {
		httpOnly: true,
		sameSite: "None",
		secure: true,
	});
	res.json({ message: "Cookie cleared" });
};

const updateUser = async (req, res) => {
	const { name, password, routeId, gender } = req.body;
	const { id: userId } = req.params;
	const user = await User.findById(userId);

	if (!user) {
		return res.status(404).json({ message: "User not found" });
	}
	if (!name || !password || !routeId || !gender) {
		return res
			.status(400)
			.json({ message: "bad request, some values are missing" });
	}

	user.name = name;
	user.passwordHash = password;
	user.routeId = routeId;
	user.gender = gender;
	user.updatedAt = Date.now();

	await user.save();

	const updatedUser = await User.findById(userId)
		.select(
			"-passwordHash -rating -__v -updatedAt -isApproved -carModel -nationalId -imageUrl"
		)
		.populate("routeId", "roomName");
	res.status(200).json({
		message: "user updated successfully",
		user: updatedUser,
	});
};

// services.
const supaUpload = async (req, res) => {
	// const supabaseUrl = import.meta.env.VITE_SUPA_URL;
	// const supabaseKey = import.meta.env.VITE_SUPA_KEY;

	// const supabase = createClient(supabaseUrl, supabaseKey);

	const { formData } = req.body;

	if (!formData)
		return res
			.status(401)
			.json({ success: false, message: "include the formData" });
};
module.exports = {
	signupDriver,
	signupPassenger,
	loginUser,
	updateUser,
	supaUpload,
	refreshToken,
	logout,
};
