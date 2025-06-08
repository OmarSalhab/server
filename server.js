const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { dbConnect } = require("./src/config/db");
const globalAsyncErrorHandler = require("./src/middlewares/errorMiddleware.js");
const tripRoutes = require("./src/routes/trip.route.js");
const userRoutes = require("./src/routes/user.route.js");
const routeRoutes = require("./src/routes/route.route.js");
const globalChatRoutes = require("./src/routes/globalChat.route.js");
const RouteChatMessage = require("./src/models/RouteChatMessage");
dotenv.config({ path: ".\\src\\config\\.env" });
const PORT = process.env.PORT || 9001;
const app = express();
const cookieParser = require("cookie-parser");
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const User = require("./src/models/User.js");
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// Initialize Socket.IO with CORS configuration
const io = new Server(server, {
	cors: {
		origin: "http://localhost:5173", // Your frontend URL
	},
});
// Store active users and their rooms
const activeUsers = new Map();

app.use(cookieParser());

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

		// Save message to database
		const message = new RouteChatMessage({
			content,
			senderId,
			routeId,
			createdAt,
		});
		await message.save();

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
	});

	// Handle disconnects
	socket.on("disconnect", () => {
		const routeId = activeUsers.get(socket.id);
		if (routeId) {
			activeUsers.delete(socket.id);
			const usersInRoute = Array.from(activeUsers.values()).filter(
				(id) => id === routeId
			).length;
			console.log(`User ${socket.id} disconnected: ${routeId} ${usersInRoute}`);
			io.to(routeId).emit("memebers_count", usersInRoute);
		}
		// console.log("User disconnected:", socket.id);
	});
});
console.log(activeUsers);

app.use("/api/trips", tripRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/users", userRoutes);
app.use("/api/global-chat", globalChatRoutes);
app.use(globalAsyncErrorHandler);

// Error handling
io.on("error", (error) => {
	console.error("Socket.IO error:", error);
});
server.listen(PORT, async () => {
	try {
		await dbConnect();
	} catch (error) {
		console.log(error.message);
	}
	console.log(`Server is running on http://localhost:${PORT}`);
});
