const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({
  wish: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Wishlist", wishlistSchema);
