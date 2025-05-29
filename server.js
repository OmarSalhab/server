const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { dbConnect, dbDisconnect } = require("./src/config/db");
const globalAsyncErrorHandler = require('./src/middlewares/errorMiddleware.js')
const tripRoutes = require("./src/routes/trip.route.js");
const userRoutes = require("./src/routes/user.route.js");
const routeRoutes = require("./src/routes/route.route.js");
dotenv.config({ path: ".\\src\\config\\.env" });
const PORT = process.env.PORT || 9000;
const app = express();
const cookieParser = require('cookie-parser');

app.use(cors({origin:"http://localhost:5173",credentials:true}));
app.use(express.json());

app.use(cookieParser());
app.use("/api/trips", tripRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/users", userRoutes);
app.use(globalAsyncErrorHandler);

app.listen(PORT, async () => {
	try {
		await dbConnect();
	} catch (error) {
		console.log(error.message);
	}
	console.log(`Server is running on localhost:${PORT}`);
});
