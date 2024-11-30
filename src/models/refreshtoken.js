const mongoose = require("../config/dbconfig");
const { Schema } = mongoose;

const refreshtokenSchema = new Schema(
  {
    token: { type: String, required: true },
    authorId: { type: mongoose.Types.ObjectId, ref: "Author", required: true },
    createdAt: { type: Date, required: true, default: Date.now},
    expireAt: {type: Date, expires: '7d'}
  }
);

const RefreshToken = mongoose.model("RefreshToken", refreshtokenSchema);

module.exports = { RefreshToken };
