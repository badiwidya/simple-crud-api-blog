const express = require("express");
const router = express.Router();
const { inputValidation, authRequired } = require("../middlewares");
const { loginUsers, registerUsers, logoutUsers, getUsersDetail, refreshToken } = require("../controllers");

router.post("/register", inputValidation, registerUsers);
router.post("/login", inputValidation, loginUsers);
router.post("/logout", logoutUsers);
router.get("/users", authRequired, getUsersDetail);
router.post("/refresh", refreshToken);

module.exports = router;
