const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const ratingSchema = new mongoose.Schema(
	{
		fromUserId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		tripId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Trip",
			required: true,
		},
		stars: { type: Number, min: 1, max: 5, required: true },
		createdAt: { type: Date, default: Date.now },
	},
	{ _id: false }
);

const userSchema = new mongoose.Schema(
	{
		role: { type: String, enum: ["driver", "passenger"], required: true },
		name: { type: String, required: true },
		phone: { type: String, required: true, unique: true },
		passwordHash: { type: String, required: true },
		gender: { type: String, enum: ["male", "female"], required: true },
		routeId: {
			type:mongoose.Schema.Types.ObjectId,
			ref: "Route",
			required: true,
		},
		rating: [ratingSchema],
		ratingsCount: { type: Number, default: 0 },
		ratingValue:{type:Number, default:0},
		createdAt: { type: Date, default: Date.now },
		isApproved: { type: Boolean, default: false },
		// only for drivers
		carModel: {
			type: String,
			required: function () {
				return this.role === "driver";
			},
		},
		nationalId: {
			type: String,
			required: function () {
				return this.role === "driver";
			},
		},
		imageUrl: {
			type: String,
			required: function () {
				return this.role === "driver";
			},
		},
	},
	{ timestamps: true }
);

userSchema.pre("save", async function (next) {
	const salt = 10;
	this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
	next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
