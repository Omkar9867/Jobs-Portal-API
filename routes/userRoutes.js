const express = require("express");
const { updateUserController } = require("../controllers/userController.js");
const userAuth = require("../middlewares/authMiddleware.js");
const router = express.Router();

router.put("/update-user", userAuth, updateUserController);

module.exports = router;
