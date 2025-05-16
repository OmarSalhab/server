const jwt = require("jsonwebtoken");
const User = require("../models/User");
const dotenv = require("dotenv");
dotenv.config({ path: "..\\config\\.env" });
const asyncHandler = require("express-async-handler");

const generateToken = (userId) => {
	return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
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
		req.user = await User.findById(decoded.id).select("-password");
		next();
	} catch (error) {
		return res
			.status(401)
			.json({ success: false, message: "Not authorized, token failed" });
	}
};
module.exports = { generateToken, protect };
