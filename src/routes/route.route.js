const express = require("express");
const router = express.Router();
const {getRoutes} = require("../controllers/route.controller");

router.get("/", getRoutes);

module.exports = router;