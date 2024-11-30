const express = require("express");
const router = express.Router();
const {
  newPost,
  editPost,
  getPost,
  deletePost,
  addComment,
  getPostComment,
  getSpecificPost
} = require("../controllers");
const { authOptional, authRequired } = require("../middlewares");

router.get("/posts", authOptional, getPost); 
router.post("/posts", authRequired, newPost); 
router.patch("/posts/:postId", authRequired, editPost); 
router.delete("/posts/:postId", authRequired, deletePost); 
router.get("/posts/:postId", getSpecificPost);

router.get("/posts/:postId/comments", getPostComment);
router.post("/posts/:postId/comments", addComment);

module.exports = router;
