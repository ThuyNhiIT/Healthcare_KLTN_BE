const mongoose = require("mongoose");

const workShiftSchema = new mongoose.Schema(
    {
        doctorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Doctor",
            required: true,
        },
        date: {
            type: Date,
            required: true, // ví dụ: "2025-08-17"
        },
        start: {
            type: String,
            required: true, // "08:00"
        },
        end: {
            type: String,
            required: true, // "17:00"
        },
        attendance: {
            checkedIn: { type: Boolean, default: false },
            checkInMethod: { type: String, enum: ["QR", "webcam", null], default: null },
            checkInTime: { type: String, default: null }, // ví dụ "08:05"
        },
    },
    { timestamps: true }
);

const WorkShift = mongoose.model("WorkShift", workShiftSchema);

module.exports = WorkShift;
