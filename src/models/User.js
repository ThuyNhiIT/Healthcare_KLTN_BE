const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: false },
    phone: { type: String, required: false },
    username: { type: String, required: true },
    password: { type: String, required: false },
    address: { type: String, required: false },
    gender: { type: String, required: false },
    dob: { type: String, required: false },
    avatar: { type: String, required: false },
    role: { type: String, default: "patient" }, // doctor, patient
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
