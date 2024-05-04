const express = require("express");
const {
  registerController,
  loginController,
} = require("../controllers/authController.js");

const rateLimit = require("express-rate-limit");
//Ip Limitier
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each Ip to 100 request per window (here, per 15 minutes)
  standardHeaders: true, // Return rateLimit info into RateLimit-* headers
  legacyHeaders: false, // Disable the X-Rate-Limit headers
});

const router = express.Router();

router.post("/register", limiter, registerController);

router.post("/login", limiter, loginController);

module.exports = router;
