// some validation middleware such as input validation for user form and token bearer validation

const { verifyToken } = require("../utils/auth");
const { body } = require("express-validator");

// input validation for user form (login, register) using express-validator
const inputValidation = [
  body("name").optional().isLength({ min: 3 }).withMessage("Name must be at least 3 characters long."),
  body("username").optional().isLength({ min: 3 }).withMessage("Username must be at least 3 characters long."),
  body("email").optional().isEmail().withMessage("Must be a valid email address."),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long."),
];

function authRequired(req, res, next) {
  try {

    // Check is there 'Bearer ' header
    const token = req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization.split(" ")[1] : null;

    // if not return status 401
    if (!token) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Verify token (see /utils/auth)
    const decode = verifyToken(token);
    if (!decode) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Add user information to req.user in order to be used by the next middleware
    req.user = decode;

    next();
  } catch (err) {
    if (err.name === "SyntaxError") {
      return res.status(401).json({ message: "Invalid tokens" });
    }
    next(err);
  }
}

// This middleware will be directed to the next middleware regardless you have token or not
function authOptional(req, res, next) {
  const token = req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization.split(" ")[1] : null;
  if (token) {
    try {
      const decode = verifyToken(token);
      req.user = decode;
      return next();
    } catch (err) {
      if (err.name === "SyntaxError") {
        return res.status(401).json({ message: "Invalid tokens" });
      }
    }
  }
  next();
}

module.exports = { inputValidation, authRequired, authOptional };
