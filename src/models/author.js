const mongoose = require('../config/dbconfig');
const { Schema } = mongoose

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const Author = mongoose.model("Author", userSchema);

module.exports = { Author }