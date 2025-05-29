const { dbConnect, dbDisconnect } = require("../src/config/db");
const dotenv = require("dotenv");
dotenv.config({ path: "..\\src\\config\\.env" });
const Route = require("../src/models/Route");

const routes = [
	{ from: "Zarqa", to: "Amman", roomName: "Zarqa-Amman" },
	{ from: "Irbid", to: "Amman", roomName: "Irbid-Amman" },
	{ from: "Jerash", to: "Amman", roomName: "Jerash-Amman" },
	{ from: "Salt", to: "Amman", roomName: "Salt-Amman" },
	{ from: "Madaba", to: "Amman", roomName: "Madaba-Amman" },
	{ from: "Aqaba", to: "Amman", roomName: "Aqaba-Amman" },
	{ from: "Mafraq", to: "Amman", roomName: "Mafraq-Amman" },
	{ from: "Tafila", to: "Amman", roomName: "Tafila-Amman" },
	{ from: "Ma'an", to: "Amman", roomName: "Maan-Amman" },
	{ from: "Karak", to: "Amman", roomName: "Karak-Amman" },
	{ from: "Ajloun", to: "Amman", roomName: "Ajloun-Amman" },
	{ from: "Balqa", to: "Amman", roomName: "Balqa-Amman" },
];
try {
    (async function seed() {
        await dbConnect();
		await Route.deleteMany();
		await Route.insertMany(routes);
		console.log("Routes seeded!");
        await dbDisconnect();
	})();
} catch (error) {
	console.log(`error seeding: ${error}`);
    dbDisconnect();
}
