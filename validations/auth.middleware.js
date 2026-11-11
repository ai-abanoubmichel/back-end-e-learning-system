const jwt = require("jsonwebtoken");
const User = require("./../models/users.model.js");
const { FAIL } = require("../utils/httpStatusText");

const authMiddleware = async (req, res, next) => {
  try {
    // 1. Get token from request headers
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        status: FAIL,
        message: "You are not logged in. Please login first.",
      });
    }

    // 2. Extract token
    const token = authHeader.split(" ")[1];

    // 3. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Check if user still exists
    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
      return res.status(401).json({
        status: FAIL,
        message: "The user belonging to this token no longer exists.",
      });
    }

    // 5. Attach user to request
    req.user = currentUser;

    // 6. Allow the request to continue
    next();
  } catch (error) {
    return res.status(401).json({
      status: "fail",
      message: "Invalid or expired token.",
    });
  }
};

module.exports = authMiddleware;
