const express = require("express");
const { testController } = require("../controllers/testController.js");
const userAuth = require("../middlewares/authMiddleware.js");

const router = express.Router();

router.post("/test-post", userAuth, testController);

module.exports = router;
