const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        status: { type: String, enum: ["on", "off"], default: "on" },
        exp: { type: Number, default: 0 },
        giay_phep: { type: String, required: true },
        hospital: { type: String, required: true },
        specialty: { type: String },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Doctor", doctorSchema);
