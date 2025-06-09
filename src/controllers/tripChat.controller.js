const TripChatMessage = require("../models/TripChatMessage");
const User = require("../models/User");

const getChat = async (req, res) => {
	const { tripId } = req.params;
	if (!tripId) return res.json({ message: "bad request" });
	const chats = await TripChatMessage.find({ tripId: tripId }).populate(
		"senderId",
		"name role"
	);

	const formattedChats = chats.map((chat) => {
		if (chat.replyToMessageId) {
			return {
				id: chat._id,
				text: chat.content,
				userId: chat.senderId._id,
				reply: chat.replyToMessageId,
				user: chat.senderId.name,
				type: chat.senderId.role,
				time: new Date(chat.createdAt).toLocaleTimeString([], {
					month: "2-digit",
					day: "2-digit",
					hour: "2-digit",
					minute: "2-digit",
				}),
			};
		} else {
			return {
				id: chat._id,
				text: chat.content,
				userId: chat.senderId._id,
				user: chat.senderId.name,
				type: chat.senderId.role,
				time: new Date(chat.createdAt).toLocaleTimeString([], {
					month: "2-digit",
					day: "2-digit",
					hour: "2-digit",
					minute: "2-digit",
				}),
			};
		}
	});
	res.send({ success: true, data: formattedChats });
};

module.exports = { getChat };
