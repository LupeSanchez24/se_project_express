const mongoose = require("mongoose");
const validator = require("validator");

const clothingItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  weather: {
    type: String,
    require: true,
    enum: ["hot", "warm", "cold"],
  },
  imageURL: {
    type: String,
    require: true,
    validate: {
      validator: (v) => validator.isURL(v),
      message: "Link is not Valid",
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  likes: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    default: [],
    createdAt: { type: Date, default: Date.now },
  },
});

module.exports = mongoose.model("item", clothingItemSchema);
