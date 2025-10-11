const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",  // Người gửi (có thể là bác sĩ, bệnh nhân, hoặc hệ thống)
            required: false
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",  // Người nhận
            required: true
        },
        type: {
            type: String,
            enum: ["system", "reminder", "message", "alert"],
            default: "message"
        },
        title: {
            type: String,
            required: false
        },
        content: {
            type: String,
            required: true
        },
        isRead: {
            type: Boolean,
            default: false
        },
        metadata: {  // thêm dữ liệu phụ nếu cần (VD: link đến healthRecord, đơn thuốc...)
            type: Object,
            required: false
        },
        avatar: {
            type: String,
            required: false
        }
    },
    { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
