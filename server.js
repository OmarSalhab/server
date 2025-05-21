const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { dbConnect, dbDisconnect } = require("./src/config/db");
const globalAsyncErrorHandler = require('./src/middlewares/errorMiddleware.js')
const rideRoutes = require("./src/routes/ride.route.js");
const tripRoutes = require("./src/routes/trip.route.js");
const userRoutes = require("./src/routes/user.route.js");
dotenv.config({ path: ".\\src\\config\\.env" });
const PORT = process.env.PORT || 9000;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/trip", tripRoutes);
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
