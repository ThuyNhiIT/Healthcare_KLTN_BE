const Notification = require("../models/Notification");

// Tạo notification mới
const createNotification = async (data) => {
    return await Notification.create(data);
};

// Lấy danh sách notification theo user (receiverId)
const getNotificationsByUser = async (receiverId, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    return await Notification.find({ receiverId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
};

// Đánh dấu notification đã đọc
const markAsRead = async (id) => {
    return await Notification.findByIdAndUpdate(id, { isRead: true }, { new: true });
};

// Xóa notification
const deleteNotification = async (id) => {
    return await Notification.findByIdAndDelete(id);
};

// Đếm số lượng chưa đọc
const getUnreadCount = async (receiverId) => {
    return await Notification.countDocuments({ receiverId, isRead: false });
};

// Đánh dấu tất cả notify đã đọc
const markAllAsRead = async (receiverId) => {
    return await Notification.updateMany(
        { receiverId, isRead: false },
        { $set: { isRead: true } }
    );
};

module.exports = {
    createNotification,
    getNotificationsByUser,
    markAsRead,
    deleteNotification,
    getUnreadCount,
    markAllAsRead,
};

