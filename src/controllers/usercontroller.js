const { generateToken, generateRefToken, hashpassword, verifypassword, verifyRefToken } = require("../utils/auth");
const { Author, RefreshToken } = require("../models/");
const { validationResult } = require("express-validator");

async function registerUsers(req, res, next) {

  // check the validation result if there any error, will send error response
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // destructuring name, username, email, and password from request body
  const { name, username, email, password } = req.body;

  try {

    // check if the email/username already exists in database
    const reguser = await Author.findOne({ username });
    const regemail = await Author.findOne({ email });

    // if yes send already exists response
    if (reguser) {
      return res.status(400).json({ message: "Username already exists." });
    }
    if (regemail) {
      return res.status(400).json({ message: "Email already exists." });
    }

    // hash password before send it to database *see /utils/auth
    const hashedPass = await hashpassword(password);

    // making author instance
    const user = new Author({
      name: name,
      username: username,
      email: email,
      password: hashedPass,
    });

    // save the data to database
    await user.save();

    // see if the data already in the database, then send response 201 with username
    const newUser = await Author.findOne({ username });
    if (!newUser) {
      return res.status(400).json({ message: "Register unsuccessfuly." });
    }
    res.status(201).json({ message: "Register successfully.", username: newUser.username });
  } catch (err) {
    next(err);
  }
}

async function loginUsers(req, res, next) {

  // check the validation result if there any error, will send error response
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  //destructuring username/email and password from request body
  const { username, email, password } = req.body;
  try {

    // check if the user send email or username then check it on the database
    let validIdentity;
    if (username) {
      validIdentity = await Author.findOne({ username: username });
    } else if (email) {
      validIdentity = await Author.findOne({ email: email });
    }

    // sending incorrect (401) response if username/email not exists or password not match
    if (!validIdentity) {
      return res.status(401).json({ message: "Username or password incorrect" });
    }
    // see src/utils/auth
    const verifypass = await verifypassword(password, validIdentity.password);
    if (!verifypass) {
      return res.status(401).json({ message: "Username or password incorrect" });
    }

    // generating token for the users *see /src/utils/auth
    const token = generateToken({
      id: validIdentity._id,
      username: validIdentity.username,
    });
    const refreshtoken = generateRefToken({
      id: validIdentity._id,
    });

    // save the generated refresh token to database
    const savetoken = new RefreshToken({
      token: refreshtoken,
      authorId: validIdentity._id,
    });
    await savetoken.save();

    // sending refresh token as cookie to the client and token as a body and will expire in 7 days
    res.cookie("refresh_token", refreshtoken, {
      httpOnly: true,
      maxAge: 604800,
    });
    res.status(200).json({ message: "Login successfully", token: token });
  } catch (err) {
    next(err);
  }
}

// get specific user data from database (require token)
async function getUsersDetail(req, res, next) {
  const userId = req.user.id;
  try {
    const user = await Author.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
}

async function refreshToken(req, res, next) {

  // destructure refresh token from cookies
  const { refresh_token } = req.cookies;
  try {

    if (!refresh_token) {
      return res.status(401).json({ message: "Refresh token required." });
    }
    // check if the token is in the database or not
    const checkrefresh = await RefreshToken.findOne({ token: refresh_token }).populate("authorId", "username");
    if (!checkrefresh) {
      return res.status(401).json({ message: "Refresh token not found." });
    }

    // if the token is in the database, check the token see /src/utils/auth
    const verifytoken = verifyRefToken(refresh_token);
    if (!verifytoken) {
      return res.status(401).json({ message: "Refresh token invalid." });
    }

    // generate new token and send it in a response body
    const newtoken = generateToken({
      id: verifytoken.id,
      username: checkrefresh.authorId.username,
    });
    return res.status(200).json({ message: "Token refreshed successfully", token: newtoken });
  } catch (err) {
    next(err);
  }
}

async function logoutUsers(req, res, next) {

  // destructure refresh token from cookies
  const { refresh_token } = req.cookies;
  try {

    // if no refresh token send 401 response
    if (!refresh_token) {
      return res.status(401).json({ message: "You must logged to do this action." });
    }

    // search and remove token from the database
    const tokensearch = await RefreshToken.findOne({ token: refresh_token });
    if (!tokensearch) {
      return res.status(404).json({ message: "Token not found." });
    }

    res.clearCookie("refresh_token", {
      httpOnly: true,
    });

    res.status(204).send();
    
  } catch (err) {
    next(err);
  }
}

module.exports = { loginUsers, registerUsers, getUsersDetail, logoutUsers, refreshToken };
