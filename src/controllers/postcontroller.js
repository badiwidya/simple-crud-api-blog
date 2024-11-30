const { createPost, updatePost, createComment, getComment } = require("../utils/query");
const { BlogPosts, Author } = require("../models");

async function newPost(req, res, next) {

  const { title, body } = req.body;
  const userId = req.user.id;

  try {

    const validuser = await Author.findById(userId);
    if (!validuser) {
      return res.status(401).json({ message: "User not found" });
    }

    const newpost = await createPost(title, userId, body);
    res.status(201).json({ message: "Post has been created", newpost });

  } catch (err) {
    next(err);
  }
}

async function editPost(req, res, next) {

  const { title, body } = req.body;
  const postId = req.params.postId;
  const userId = req.user.id;

  try {

    const validuser = await Author.findById(userId);
    if (!validuser) {
      return res.status(401).json({ message: "User not found" });
    }

    const checkpost = await BlogPosts.findById(postId);
    if (!checkpost) {
      return res.status(404).json({ message: "Post not found." });
    }

    const checkowner = await BlogPosts.findOne({ _id: postId, authorId: userId });
    if (!checkowner) {
      return res.status(403).json({ message: "This post is not belong to the specific user." });
    }

    let updatedata = {};

    if (title) {
      updatedata.title = title;
    }
    if (body) {
      updatedata.body = body;
    }

    const post = await updatePost(postId, updatedata);
    res.status(200).json({ message: "Updated successfully", updatedPost: {
      id: post._id,
      title: post.title,
      body: post.body
    } });

  } catch (err) {
    next(err);
  }
}

async function getPost(req, res, next) {

  const { search, author, startDate, endDate, page = 1, limit = 10 } = req.query;
  const userId = req.user ? req.user.id : null;

  try {

    let query = BlogPosts.find();

    if (search) {
      const regex = new RegExp(search, "i");
      query = query.or([{ title: { $regex: regex } }, { body: { $regex: regex } }]);
    }

    if (startDate) {
      query = query.gte("createdAt", new Date(startDate));
    }

    if (endDate) {
      query = query.lte("createdAt", new Date(endDate));
    }
    
    if (author) {
      const usercheck = await BlogPosts.findOne({ username: author }).select("_id");
      if (usercheck) {
        query = query.where("authorId.username").equals(author);
      }
    } else if (userId) {
      query = query.where("authorId").equals(userId);
    }

    query = query
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const posts = await query.exec();
    const totalPosts = await BlogPosts.countDocuments(query.getFilter());
    const totalPages = Math.ceil(totalPosts / limit);

    res.status(200).json({
      currentPage: page,
      totalPages: totalPages,
      totalPosts: totalPosts,
      posts,
    });
  } catch (err) {
    next(err);
  }
}

async function getSpecificPost(req, res, next) {

  const { postId } = req.params;

  try {

    const post = await BlogPosts.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    res.status(200).json(post);
  } catch (err) {
    next(err);
  }
}

async function deletePost(req, res, next) {

  const postId = req.params.postId;

  try {
    const del = await BlogPosts.findByIdAndDelete(postId);
    if (!del) {
      return res.status(404).json({ message: "Post not found." });
    }

    return res.status(200).json({ message: "Post deleted successfully.", deletePost: {
      id: del._id,
      title: del.title
    } });

  } catch (err) {
    next(err);
  }
}

async function addComment(req, res, next) {

  const { postId } = req.params;
  const { name, body } = req.body;
  
  try {

    const checkpost = await BlogPosts.findById(postId);
    if (!checkpost) {
      return res.status(404).json({ message: "Post not found." });
    }

    let data = { body };
    if (name) {
      data.name = name;
    }

    const updatecomment = await createComment(postId, data);

    if (!updatecomment) {
      return res.status(400).json({ message: "Error while inserting comment." });
    }
    res.status(201).json({ message: "Comment added successfully" });
  } catch (err) {
    next(err);
  }
}

async function getPostComment(req, res, next) {

  const { postId } = req.params;
  
  try {

    const checkpost = await BlogPosts.findById(postId);
    if (!checkpost) {
      return res.status(404).json({ message: "Post not found." });
    }
    
    const comments = await getComment(postId);
    res.status(200).json(comments);
  } catch (err) {
    next(err);
  }
}

module.exports = { newPost, editPost, getPost, deletePost, addComment, getPostComment, getSpecificPost };
