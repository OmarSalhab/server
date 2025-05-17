const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const { protect, isAuthorizedAdmin } = require("../middlewares/authMiddleware");
const {
	getProducts,
	getProductById,
	addToCart,
	addToWishlist,
	deleteCartProdut,
	deleteWishListProdut,
} = require("../controllers/product.controller");

//Guest Role Queries
router.get("/", asyncHandler(getProducts));
router.get("/:id", asyncHandler(getProductById));

//User Role Queries
router.post("/cart/:id", protect, asyncHandler(addToCart));
router.post("/wishlist/:id", protect, asyncHandler(addToWishlist));
router.delete("/cart/:id", protect, asyncHandler(deleteCartProdut));
router.delete("/wishlist/:id", protect, asyncHandler(deleteWishListProdut));

module.exports = router;
