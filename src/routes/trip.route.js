const express = require('express');
const router = express.Router();
const {createTrip} = require('../controllers/trip.controller');
const {protect} = require('../middlewares/authMiddleware');
const asyncHandler = require('express-async-handler');
router.post('/',protect,asyncHandler(createTrip));
module.exports = router; 