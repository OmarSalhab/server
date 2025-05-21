const mongoose = require("mongoose");

const tripChatMessageSchema = new mongoose.Schema({
	tripId: { type: mongoose.Schema.Types.ObjectId, ref: "Trip", required: true },
	senderId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	content: { type: String, required: true },
	isLocation: { type: Boolean, default: false },
	replyToMessageId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "TripChatMessage",
	},
	createdAt: { type: Date, default: Date.now },
});
const TripChatMessage = mongoose.model(
	"TripChatMessage",
	tripChatMessageSchema
);
module.exports = TripChatMessage;
