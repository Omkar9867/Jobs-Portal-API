const JWT = require("jsonwebtoken");

const userAuth = (req, res, next) => {
  try {
    const authHeaders = req.headers.authorization;
    if (!authHeaders || !authHeaders.startsWith("Bearer")) {
      return res.status(400).json({ message: "Authorization Failed" });
    }
    const token = authHeaders.split(" ")[1];
    try {
      const payload = JWT.verify(token, process.env.JWT_TOKEN);
      req.user = { userId: payload.userId };
    } catch (error) {
      next(error);
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = userAuth;
