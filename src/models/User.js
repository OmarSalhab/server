const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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
