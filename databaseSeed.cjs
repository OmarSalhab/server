const Product = require("./src/models/Product");
const products = require("./src/data/products.json");
const { dbConnect } = require("./src/config/db");
const dotenv = require("dotenv");
dotenv.config({ path: ".\\src\\config\\.env" });
const dbSeeding = async () => {
	try {
		await dbConnect();
		let count = 0;
		for (const product of products) {
			const newProduct = new Product(product);
			await newProduct.save();
			console.log(`Seeded item number(${count}) : ${product}`);
			count++;
		}
	} catch (error) {
		console.log(`error : ${error.message}`);
	}
	console.log("database seeded complitly");
};

dbSeeding();
