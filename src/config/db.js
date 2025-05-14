const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const dbConnect = async () => {
	try {
		const conn = await mongoose.connect(process.env.DB_URI);
		console.log(`DB Connected with Host:${conn.connection.host}`);
	} catch (error) {
		console.log(`DB Connection Faild : ${error.message}`);
		process.exit(1);
	}
};

const dbDisconnect = async () => {
	try {
		await mongoose.disconnect();
		console.log("DB Disconnected.");
	} catch (error) {
		console.log(`Unable to Disconnect DB: ${error.message}`);
	}
};

module.exports = { dbConnect, dbDisconnect };
