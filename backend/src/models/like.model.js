const mongoose = require("mongoose");

const LikeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  movieId: { type: Number, required: true },
});

module.exports = mongoose.model("Like", LikeSchema);
