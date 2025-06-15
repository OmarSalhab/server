const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { dbConnect } = require("./src/config/db");
const globalAsyncErrorHandler = require("./src/middlewares/errorMiddleware.js");
const tripRoutes = require("./src/routes/trip.route.js");
const userRoutes = require("./src/routes/user.route.js");
const routeRoutes = require("./src/routes/route.route.js");
const globalChatRoutes = require("./src/routes/globalChat.route.js");
const tripChatRoutes = require("./src/routes/tripChat.route.js")

dotenv.config({ path: ".\\src\\config\\.env" });
const PORT = process.env.PORT || 9001;
const app = express();
const cookieParser = require("cookie-parser");
const http = require("http");
const server = http.createServer(app);
const { initializeSocket } = require("./src/config/socket.js");

app.use(cors({ origin: "https://tawsilaa.netlify.app", credentials: true }));
app.use(express.json());

const io = initializeSocket(server);


app.use(cookieParser());

app.use("/api/trips", tripRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/users", userRoutes);
app.use("/api/global-chat", globalChatRoutes);
app.use("/api/trip-chat", tripChatRoutes);
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
	console.log(`Server is running on https://tawsila-server.onrender.com/`);
});
module.exports = { io };
