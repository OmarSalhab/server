/** IMPLEMENT A LOT OF PRODUCTS CONTROLLERS */
const User = require("../models/User");
const Product = require("../models/Product");

const getProducts = async (req, res) => {
    const products = await Product.find({categorie:'Summer'})
    res.json({sucsses: true, data : products});
};
const getProductById = async (req, res) => {};
const addToCart = async (req, res) => {};
const deleteCartProdut = async (req, res) => {};
const deleteWishListProdut = async (req, res) => {};
const addToWishlist = async (req,res)=>{};
module.exports = {
	getProducts,
	getProductById,
	addToCart,
	deleteCartProdut,
	deleteWishListProdut,
	addToWishlist,
};
