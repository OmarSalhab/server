const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const dotenv = require("dotenv");
dotenv.config({ path: "..\\config\\.env" });
const {
	signupUser,
	getUserById,
	getAllUsers,
	getUserName,
	loginUser,
} = require("../controllers/user.controller");
const {
	emailValidator,
	passwordValidator,
	nameValidator,
	validate,
} = require("../middlewares/validatorMiddleware");
 const {protect} = require("../middlewares/authMiddleware")

//Guest Role Queries
router.post(
	"/",
	nameValidator(),
	emailValidator(),
	passwordValidator(),
	validate,
	asyncHandler(signupUser)
);

router.post(
	"/login",
	emailValidator(),
	passwordValidator(),
	validate,
	asyncHandler(loginUser)
);

//User Role Queries
router.get("/:id/profile",protect, asyncHandler(getUserById));
router.get("/:id/name",protect, asyncHandler(getUserName));

// router.put("/:id",nameValidator() ,emailValidator(), passwordValidator(), updateUser);

//Admin Role Queries
router.get("/", asyncHandler(getAllUsers));
// router.delete("/:id", deleteUser);

module.exports = router;
