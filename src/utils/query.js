const { BlogPosts } = require("../models");

// Some querying function

async function updatePost(postid, updatedata = {}) {
  try {
    return await BlogPosts.findByIdAndUpdate({ _id: postid }, updatedata, { new: true, runValidators: true });
  } catch (err) {
    throw err;
  }
}

async function createPost(title, userId, body) {
  try {
    const post = new BlogPosts({
      title: title,
      authorId: userId,
      body: body,
    });
    return await post.save();
  } catch (err) {
    throw err;
  }
}

async function createComment(postId, comment = {}) {
  try {
    if (!comment.body) {
      throw new Error("Comment body is required.");
    }

    if (!comment.name) {
      comment.name = "Anonymous";
    }

    const updatedPost = await BlogPosts.findByIdAndUpdate(
      postId,
      {
        $push: { 
          comments: { 
            name: comment.name,
            body: comment.body 
          } 
        }
      },
      { new: true } 
    );

    if (!updatedPost) {
      return null;
    }

    return updatedPost;
  } catch (err) {
    throw err;
  }
}

async function getComment(postId) {
  try {
    const post = await BlogPosts.findById(postId).select('-_id comments');
    if (post.comments.length === 0) {
      return { message: "This post have no comment." }
    }
    return post.comments;
  } catch (err) {
    throw err;
  }
}

module.exports = { createPost, updatePost, createComment, getComment };
