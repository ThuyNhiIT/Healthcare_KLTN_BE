const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  UserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  access_Token: { type: String, required: true },
  refresh_Token: { type: String, required: true },
}, { timestamps: true }); 

const Session = mongoose.model("Session", sessionSchema);

module.exports = Session;
