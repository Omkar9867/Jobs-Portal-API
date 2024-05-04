const User = require("../models/userModal");

const registerController = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name) {
      return res
        .status(400)
        .send({ success: false, message: "Please provide name" });
    }
    if (!email) {
      return res
        .status(400)
        .send({ success: false, message: "Please provide email" });
    }
    if (!password) {
      return res
        .status(400)
        .send({ success: false, message: "Please provide password" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(200)
        .send({ success: false, message: "Email already exists" });
    }
    const user = await User.create({ name, email, password });
    const token = user.createJWT();
    return res.status(201).send({
      success: true,
      message: "User created",
      user: {
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        location: user.location,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .send({ success: false, message: "Please provide all fields" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid Credentials" });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res
        .status(400)
        .send({ sucess: false, message: "Invalid Credentials" });
    }
    user.password = undefined;
    const token = user.createJWT();
    res
      .status(200)
      .json({ success: true, message: "Login Successfull", user, token });
  } catch (error) {
    next(error);
  }
};

module.exports = { registerController, loginController };
