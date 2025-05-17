const globalAsyncErrorHandler = (err, req, res, next) => {
	if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
		return res
			.status(400)
			.json({ success: false, message: "Email already exists" });
	}

	if (err.statusCode) {
		return res
			.status(err.statusCode)
			.json({ success: false, message: err.message });
	}

	if (err.name === "CastError") {
            return res.status(400).json({ success: false, message: "Invalid ID" });
        }
	//default fallback
	res
		.status(500)
		.json({ success: false, message: err.message || "Internal server error" });
};

module.exports = globalAsyncErrorHandler;
