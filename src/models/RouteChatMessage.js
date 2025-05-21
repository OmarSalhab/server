const mongoose = require("mongoose");

const routeChatMessageSchema = new mongoose.Schema({
	routeId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Route",
		required: true,
	},
	senderId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	content: { type: String, required: true },
	replyToMessageId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "RouteChatMessage",
	},
	createdAt: { type: Date, default: Date.now },
});

const RouteChatMessage = mongoose.model(
	"RouteChatMessage",
	routeChatMessageSchema
);
module.exports = RouteChatMessage;
