const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        patientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient", // liên kết đến bảng bệnh nhân
            required: true,
        },
        doctorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Doctor", // liên kết đến bảng bác sĩ
            required: true,
        },
        message: {
            type: String,
            required: true,
            trim: true,
        },
        time: {
            type: Date,
            default: Date.now, // mặc định là thời điểm gửi
        },
    },
    { timestamps: true } // có createdAt, updatedAt tự động
);

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
