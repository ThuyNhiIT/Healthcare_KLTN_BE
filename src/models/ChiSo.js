const mongoose = require("mongoose");

const chiSoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Thêm userId để liên kết với bệnh nhân
  value: { type: Number, required: true },   // chỉ số đường huyết
  type: {                                    // loại chỉ số
    type: String,
    enum: ["fasting", "postMeal"],
    required: true
  },
  time: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ChiSo", chiSoSchema);
