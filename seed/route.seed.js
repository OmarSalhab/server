const { dbConnect, dbDisconnect } = require("../src/config/db");
const dotenv = require("dotenv");
dotenv.config({ path: "..\\src\\config\\.env" });
const Route = require("../src/models/Route");

const routes = [
	{ from: "Zarqa", to: "Amman", roomName: "zarqa-amman" },
	{ from: "Irbid", to: "Amman", roomName: "irbid-amman" },
	{ from: "Jerash", to: "Amman", roomName: "jerash-amman" },
	{ from: "Salt", to: "Amman", roomName: "salt-amman" },
	{ from: "Madaba", to: "Amman", roomName: "madaba-amman" },
	{ from: "Aqaba", to: "Amman", roomName: "aqaba-amman" },
	{ from: "Mafraq", to: "Amman", roomName: "mafraq-amman" },
	{ from: "Tafila", to: "Amman", roomName: "tafila-amman" },
	{ from: "Ma'an", to: "Amman", roomName: "maan-amman" },
	{ from: "Karak", to: "Amman", roomName: "karak-amman" },
	{ from: "Ajloun", to: "Amman", roomName: "ajloun-amman" },
	{ from: "Balqa", to: "Amman", roomName: "balqa-amman" },
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
