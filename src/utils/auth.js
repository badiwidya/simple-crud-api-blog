require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Authentication function using jwt and bcrypt

function generateToken(payload) {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
  return token;
}

function generateRefToken(payload) {
  const token = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
  return token;
}

function verifyRefToken(token) {
  try {
    const match = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    return match;
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      throw new Error("Invalid token");
    } else if (err.name === "TokenExpiredError") {
      throw new Error("Token expired");
    }
    throw new Error('Token verification failed');
  }
}

function verifyToken(token) {
  try {
    const match = jwt.verify(token, process.env.JWT_SECRET);
    return match;
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      throw new Error("Invalid token"); 
    } else if (err.name === "TokenExpiredError") {
      throw new Error("Token expired"); 
    }
    throw new Error('Token verification failed');
  }
}

async function hashpassword(password) {
  try {
    const saltRounds = 12;
    const hashPassword = await bcrypt.hash(password, saltRounds);
    return hashPassword;
  } catch (err) {
    throw err;
  }
}

async function verifypassword(password, hash) {
  try {
    const verify = await bcrypt.compare(password, hash);
    return verify;
  } catch (err) {
    throw err;
  }
}

module.exports = { generateToken, generateRefToken, verifyToken, hashpassword, verifypassword, verifyRefToken };
