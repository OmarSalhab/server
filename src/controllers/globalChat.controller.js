const RouteChatMessage = require("../models/RouteChatMessage");
const User = require("../models/User");
const getChat = async (req, res) => {
	const routeId = req.user.routeId;
	if (!routeId) return res.json({ message: "bad request" });
	const chats = await RouteChatMessage.find({ routeId: routeId._id }).populate(
		"senderId",
		"name role"
	);

	const formattedChats = chats.map((chat) => ({
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
	}));
	res.send({ success: true, data: formattedChats });
};

const getMembers = async (req, res) => {
	const members = await User.find({ routeId: req.user.routeId });

	res.json({ success: true, data: members.length });
};
module.exports = { getChat, getMembers };
