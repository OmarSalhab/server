const mongoose = require("mongoose");

const routeSchema = new mongoose.Schema({
	from: { type: String, required: true },
	to: { type: String, required: true },
	roomName: { type: String, required: true },
	createdAt: { type: Date, default: Date.now },
});

const Route = mongoose.model("Route", routeSchema);

module.exports = Route;
