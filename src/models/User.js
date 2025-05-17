const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Product = require("./Product");

const userSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		role: { type: String, required: true },

		cart: [
			{
				product: { type: mongoose.Schema.ObjectId, ref: "Product" },
				quantity: { type: Number, default: 1 },
			},
		],
		wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
	},
	{ timestamps: true }
);

userSchema.pre("save", async function (next) {
	const salt = 10;
	this.password = await bcrypt.hash(this.password, salt);
	next();
});
const User = mongoose.model("User", userSchema);

module.exports = User;
