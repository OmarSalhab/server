const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
	fromUserId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	toUserId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	tripId: { type: mongoose.Schema.Types.ObjectId, ref: "Trip", required: true },
	stars: { type: Number, min: 1, max: 5, required: true },
	createdAt: { type: Date, default: Date.now },
});

const Rating = mongoose.model("Rating", ratingSchema);
module.exports = Rating;
