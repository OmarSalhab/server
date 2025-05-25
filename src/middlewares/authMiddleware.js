const jwt = require("jsonwebtoken");
const User = require("../models/User");
const dotenv = require("dotenv");
dotenv.config({ path: "..\\config\\.env" });
const asyncHandler = require("express-async-handler");

const generateToken = (user) => {
	return jwt.sign(
		{ id: user._id,
		role: user.role,
		routeId: user.routeId },
		process.env.JWT_SECRET,
		{ expiresIn: "3d" }
	);
};

const protect = async (req, res, next) => {
	let token;

	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer ")
	) {
		token = req.headers.authorization.split(" ")[1];
	}
	if (!token) {
		return res
			.status(401)
			.json({ success: false, message: "Not authorized, no token" });
	}
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = await User.findById(decoded.id).select("-passwordHash");
		next();
	} catch (error) {
		return res
			.status(401)
			.json({ success: false, message: "Not authorized, token failed" });
	}
};

const isAuthorizedAdmin = asyncHandler(async (req, res, next) => {
	const role = req.user.role;
	if (role === "passenger" || role === "driver") {
		const err = new Error("User Not Authorized");
		err.status = 401;
		throw err;
	} else if (role === "admin") {
		next();
	}
});

const isPassenger = asyncHandler(async (req, res, next) => {
	const role = req.user.role;
	if (role === "admin" || role === "driver") {
		const err = new Error("User Not Authorized");
		err.status = 401;
		throw err;
	} else if (role === "passenger") {
		next();
	}
});

const isAuthorizedDriver = asyncHandler(async (req, res, next) => {
	const role = req.user.role;
	if (role === "passenger" || role === "admin") {
		const err = new Error("User Not Authorized");
		err.status = 401;
		throw err;
	} else if (role === "driver") {
		next();
	}
});

module.exports = {
	generateToken,
	protect,
	isAuthorizedAdmin,
	isPassenger,
	isAuthorizedDriver,
};
