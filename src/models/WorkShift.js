const mongoose = require("mongoose");

const workShiftSchema = new mongoose.Schema(
    {
        doctorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Doctor",
            required: true,
        },
        date: {
            type: Date, // nên dùng Date thay vì String
            required: true,
        },
        start: {
            type: String, // "08:00"
            required: true,
        },
        end: {
            type: String, // "17:00"
            required: true,
        },
        attendance: {
            checkedIn: { type: Boolean, default: false },
            checkInMethod: { type: String, enum: ["QR", "webcam", "manual", null], default: null },
            checkInTime: { type: String, default: null }, // ví dụ "08:05"
            checkedOut: { type: Boolean, default: false },
            checkOutTime: { type: String, default: null }, // ví dụ "17:05"
        },
        // Nếu muốn lưu lịch sử đầy đủ các lần vào/ra
        attendanceLogs: [
            {
                type: {
                    type: String,
                    enum: ["checkin", "checkout"],
                },
                method: { type: String, enum: ["QR", "webcam", "manual"] },
                time: { type: String },
                createdAt: { type: Date, default: Date.now },
            },
        ],
    },
    { timestamps: true }
);

const WorkShift = mongoose.model("WorkShift", workShiftSchema);
module.exports = WorkShift;
