/** IMPLEMENT A LOT OF PRODUCTS CONTROLLERS */
const User = require("../models/User");
const Product = require("../models/Product");

const getProducts = async (req, res) => {
	const { category, minPrice, maxPrice, search } = req.query;
	const filter = {};

	if (category) filter.categorie = category;
	if (minPrice) filter.price = { ...filter.price, $gte: Number(minPrice) };
	if (maxPrice) filter.price = { ...filter.price, $lte: Number(maxPrice) };
	if (search) filter.title = { $regex: search, $options: "i" };

	const products = await Product.find(filter);
	res.json({ success: true, data: products });
};

const getProductById = async (req, res) => {
	const userId = req.params.id;
	const product = await Product.findById({ _id: userId });
	res.json({ success: true, data: product });
};
const addToCart = async (req, res) => {};
const deleteCartProdut = async (req, res) => {};
const deleteWishListProdut = async (req, res) => {};
const addToWishlist = async (req, res) => {};

module.exports = {
	getProducts,
	getProductById,
	addToCart,
	deleteCartProdut,
	deleteWishListProdut,
	addToWishlist,
};
