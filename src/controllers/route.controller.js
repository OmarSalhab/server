const Route = require("../models/Route");

const getRoutes = async (req, res) => {
	try {
		const routes = await Route.find({}, "from to roomName"); // نحدد الحقول اللي بدنا نظهرها فقط
		res.status(200).json({ success: true, routes });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

module.exports = getRoutes;