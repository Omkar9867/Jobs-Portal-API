const User = require("../models/userModal");

const updateUserController = async (req, res, next) => {
  try {
    const { name, email, lastName, location } = req.body;
    if (!name || !email || !lastName || !location) {
      return res.status(400).json({ message: "All fields required" });
    }
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    user.name = name;
    user.email = email;
    user.lastName = lastName;
    user.location = location;
    await user.save();
    const token = user.createJWT();
    res.status(200).json({
      message: "User Credentials Updated",
      user,
      token,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { updateUserController };
