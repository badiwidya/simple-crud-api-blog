const { loginUsers, registerUsers, logoutUsers, getUsersDetail, refreshToken } = require("./usercontroller");
const {
  newPost,
  editPost,
  getPost,
  deletePost,
  addComment,
  getPostComment,
  deleteComment,
  getSpecificPost
} = require("./postcontroller");

module.exports = {
  loginUsers,
  registerUsers,
  newPost,
  editPost,
  getPost,
  deletePost,
  addComment,
  getPostComment,
  deleteComment,
  logoutUsers,
  getUsersDetail,
  getSpecificPost,
  refreshToken
};
