const mongoose = require("../config/dbconfig");
const { Schema } = mongoose;

const blogSchema = new Schema(
  {
    title: { type: String, required: true },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: "Author", required: true },
    body: { type: String, required: true },
    comments: [{ 
      name: { type: String },
      body: { type: String, required: true },
      createdAt: { type: Date, default: Date.now, required: true }
    }],
  },
  { timestamps: true }
);

const BlogPosts = mongoose.model("BlogPosts", blogSchema);

module.exports = { BlogPosts };
