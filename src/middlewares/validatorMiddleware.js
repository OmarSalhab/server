const { body, validationResult } = require("express-validator");

const phoneValidator = () => {
	return body("phone")
		.matches(/^(07[789])\d{7}$/)
		.withMessage(
			"Please enter a valid Jordanian mobile number (e.g., 0777777777)"
		);
};

const imageUrlValidator = () => {
	return body("imageUrl")
		.trim()
		.notEmpty()
		.withMessage("Image URL is required")
		.matches(/^https?:\/\/.+\.(jpg|jpeg|png|gif)$/i)
		.withMessage("Please enter a valid image URL (jpg, jpeg, png, or gif)");
};
const carModelValidator = () => {
	return body("carModel")
		.trim()
		.notEmpty()
		.withMessage("Car model is required")
		.isLength({ min: 3, max: 50 })
		.withMessage("Car model must be between 3 and 50 characters")
		.matches(/^[A-Za-z0-9\s-]+$/)
		.withMessage(
			"Car model can only contain letters, numbers, spaces and hyphens"
		);
};
const idValidator = () => {
	return body("nationalId")
		.matches(/^[0-9]{10}$/)
		.withMessage("National ID must be exactly 10 digits");
};

const nameValidator = () => {
	return body("name")
		.trim()
		.isLength({ min: 2 })
		.withMessage("Name must be at least 2 characters long")
		.matches(/^[A-Za-z\s]+$/)
		.withMessage("Name must contain only letters and spaces");
};

const passwordValidator = () => {
	return body("password")
		.isLength({ min: 6 })
		.withMessage("Password must be at least 6 characters long")
		.matches(/[A-Z]/)
		.withMessage("Password must contain at least one uppercase letter")
		.matches(/[!@#$%^&*(),.?":{}|<>]/)
		.withMessage("Password must contain at least one special character");
};

const validate = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	next();
};

module.exports = {
	phoneValidator,
	imageUrlValidator,
	carModelValidator,
	passwordValidator,
	nameValidator,
	idValidator,
	validate,
};
