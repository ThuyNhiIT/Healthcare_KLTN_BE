const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    weight: {
      type: Number,
      required: true,
      min: 1,
    },
    image: {
      type: String,
      required: true,
    },
    calo: {
      type: Number,
      required: true,
    },
     chatDam: {
      type: Number,
      required: true,
    },
     DuongBot: {
      type: Number,
      required: true,
    },
     ChatBeo: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Food = mongoose.model("Food", foodSchema);

module.exports = Food;
