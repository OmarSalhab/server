// server/src/config/socket.js
const { Server } = require("socket.io");
const RouteChatMessage = require("../models/RouteChatMessage.js");
const User = require("../models/User.js");
let io;

const initializeSocket = (server) => {
	io = new Server(server, {
		cors: {
			origin: "http://localhost:5173",
		},
	});

	// Store active users and their rooms
	const activeUsers = new Map();

	io.on("connection", (socket) => {
		console.log("User connected:", socket.id);

		// Handle joining a route room
		socket.on("join_route", (routeId) => {
			if (!routeId) return;

			activeUsers.set(socket.id, routeId);
			// Leave any previous rooms
			socket.rooms.forEach((room) => {
				if (room !== socket.id) {
					socket.leave(room);
					const usersInRoute = Array.from(activeUsers.values()).filter(
						(id) => id === room
					).length;
					console.log(
						`User ${socket.id} disconnected: ${room} ${usersInRoute}`
					);
					io.to(room).emit("memebers_count", usersInRoute);
				}
			});

			// Join the new route room
			socket.join(routeId);
			const usersInRoute = Array.from(activeUsers.values()).filter(
				(id) => id === routeId
			).length;
			console.log(
				`User ${socket.id} joined route room: ${routeId} ${usersInRoute}`
			);
			io.to(routeId).emit("memebers_count", usersInRoute);
		});

		// Handle sending messages
		socket.on("send_message", async (messageData) => {
			console.log(messageData);

			const { content, senderId, userName, routeId, createdAt } = messageData;
			if (messageData.reply) {
				const message = new RouteChatMessage({
					content,
					replyToMessageId: messageData.reply,
					senderId,
					routeId,
					createdAt,
				});
				await message.save();
				// Save message to database

				const user = await User.findById(senderId);

				// Broadcast the message to all users in the route room
				io.to(routeId).emit("receive_message", {
					msgId: message._id,
					content: content,
					reply: message.replyToMessageId,
					userId: senderId,
					userName: userName,
					role: user.role,
					createdAt: createdAt,
				});
			} else {
				const message = new RouteChatMessage({
					content,
					senderId,
					routeId,
					createdAt,
				});
				await message.save();
				// Save message to database

				const user = await User.findById(senderId);

				// Broadcast the message to all users in the route room
				io.to(routeId).emit("receive_message", {
					msgId: message._id,
					content: content,
					userId: senderId,
					userName: userName,
					role: user.role,
					createdAt: createdAt,
				});
			}
		});

		// Handle disconnects
		socket.on("disconnect", () => {
			const routeId = activeUsers.get(socket.id);
			if (routeId) {
				activeUsers.delete(socket.id);
				const usersInRoute = Array.from(activeUsers.values()).filter(
					(id) => id === routeId
				).length;
				console.log(
					`User ${socket.id} disconnected: ${routeId} ${usersInRoute}`
				);
				io.to(routeId).emit("memebers_count", usersInRoute);
			}
		});
	});

	return io;
};

const getIO = () => {
	if (!io) {
		throw new Error("Socket.io not initialized!");
	}
	return io;
};

module.exports = {
	initializeSocket,
	getIO,
};
