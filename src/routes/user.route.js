const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const dotenv = require("dotenv");
dotenv.config({ path: "..\\config\\.env" });

const {
	signupDriver,
	signupPassenger,
	loginUser,
	updateUser,
	userInfo,
	supaUpload,
	refreshToken,
	logout,
} = require("../controllers/user.controller");

const {
	phoneValidator,
	passwordValidator,
	carModelValidator,
	imageUrlValidator,
	nameValidator,
	idValidator,
	validate,
} = require("../middlewares/validatorMiddleware");

const {
	protect,
	isAuthorizedAdmin,
	isAuthorizedDriver,
} = require("../middlewares/authMiddleware");

//Guest Role Queries
router.post(
	"/register/passenger",
	nameValidator(),
	phoneValidator(),
	passwordValidator(),
	validate,
	asyncHandler(signupPassenger)
);

router.post(
	"/register/driver",
	nameValidator(),
	phoneValidator(),
	carModelValidator(),
	imageUrlValidator(),
	passwordValidator(),
	idValidator(),
	validate,
	asyncHandler(signupDriver)
);

router.get("/refresh", asyncHandler(refreshToken));

router.post("/login", phoneValidator(), validate, asyncHandler(loginUser));

router.post("/logout", protect, asyncHandler(logout));

router.put(
	"/update:id",
	protect,
	nameValidator(),
	passwordValidator(),
	asyncHandler(updateUser)
);
router.post("/upload-to-supabase", asyncHandler(supaUpload));

// router.get("/me", protect, asyncHandler(userInfo));
// //User Role Queries
// router.get("/:id/profile", protect, asyncHandler(getUserById));
// router.get("/:id/name", protect, asyncHandler(getUserName));

// router.put(
// 	"/:id/profile",
// 	nameValidator(),
// 	emailValidator(),
// 	passwordValidator(),
// 	protect,
// 	asyncHandler(updateUserInfo)
// );

// //Admin Role Queries
// router.get("/", protect, isAuthorizedAdmin, asyncHandler(getAllUsers));

// router.put(
// 	"/:id/admin",
// 	protect,
// 	isAuthorizedAdmin,
// 	asyncHandler(updateUserInfo)
// );
// router.put("/:id/admin",protect, isAuthorizedAdmin, asyncHandler(updateUserInfo));

// router.delete("/:id", protect, isAuthorizedAdmin, asyncHandler(deleteUser));

module.exports = router;
