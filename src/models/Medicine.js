const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        name: {
            type: String,
            required: true, // Tên thuốc
            trim: true,
        },
        time: {
            type: Date,
            required: true, // Thời gian uống thuốc
        },
        lieu_luong: {
            type: String, // Liều lượng (mg, viên,...)
            required: true,
            min: 1,
        },
        status: {
            type: String,
            enum: ["chưa uống", "đã uống", "bỏ lỡ"],
            default: "chưa uống",
        },
    },
    { timestamps: true }
);

const Medicine = mongoose.model("Medicine", medicineSchema);

module.exports = Medicine;
