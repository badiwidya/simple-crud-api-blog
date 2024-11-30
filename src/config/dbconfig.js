require('dotenv').config()
const mongoose = require("mongoose");

// connect to mongodb

mongoose
  .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/blogs')
  .then(() => {
    console.log("Database connected.");
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });

module.exports = mongoose