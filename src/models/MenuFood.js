const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
    },
    caloMax: {
      type: Number,
    },
    caloCurrent: {
      type: Number,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
      unique: true,
    },
  },
  { timestamps: true }
);

const MenuFood = mongoose.model("MenuFood", foodSchema);

module.exports = MenuFood;
