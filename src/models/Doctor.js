const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
    {
        userId: { // Liên kết với người dùng
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        status: {
            type: String,
            enum: ["on", "off"],
            default: "off",
        },
        exp: {
            type: Number,
            required: true,
            min: 0,
        },
        giay_phep: {
            type: String,
            required: true,
        },
        hospital: {
            type: String,
            required: true,

        },
        specialty: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const Doctor = mongoose.model("Doctor", doctorSchema);

module.exports = Doctor;