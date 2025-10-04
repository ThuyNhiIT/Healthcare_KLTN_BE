const notificationService = require("../services/notificationService");
const User = require("../models/User");

const createNotification = async (req, res) => {
    try {
        const firebaseUid = req.user.user_id;
        const user = await User.findOne({ uid: firebaseUid });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const data = {
            senderId: user._id,
            receiverId: req.body.receiverId,
            type: req.body.type || "message",
            title: req.body.title || "",
            content: req.body.content,
            metadata: req.body.metadata || {},
        };

        const notification = await notificationService.createNotification(data);
        return res.status(201).json({ success: true, data: notification });
    } catch (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
};

const getNotificationsByUser = async (req, res) => {
    try {
        const firebaseUid = req.user.user_id;
        const user = await User.findOne({ uid: firebaseUid });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const { page = 1, limit = 10 } = req.query;
        const notifications = await notificationService.getNotificationsByUser(
            user._id,
            parseInt(page),
            parseInt(limit)
        );

        return res.json({ success: true, data: notifications });
    } catch (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
};

// Đánh dấu notification đã đọc
const markAsRead = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const notification = await notificationService.markAsRead(notificationId);
        if (!notification) {
            return res.status(404).json({ success: false, message: "Notification not found" });
        }
        return res.json({ success: true, data: notification });
    } catch (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
};

const deleteNotification = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const notification = await notificationService.deleteNotification(notificationId);
        if (!notification) {
            return res.status(404).json({ success: false, message: "Notification not found" });
        }
        return res.json({ success: true, message: "Notification deleted" });
    } catch (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
};

const getUnreadCount = async (req, res) => {
    try {
        const firebaseUid = req.user.user_id;
        const user = await User.findOne({ uid: firebaseUid });
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const count = await notificationService.getUnreadCount(user._id);
        res.json({ success: true, data: { unreadCount: count } });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// PATCH /api/notification/mark-all-read
const markAllAsRead = async (req, res) => {
    try {
        const firebaseUid = req.user.user_id;
        const user = await User.findOne({ uid: firebaseUid });
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const result = await notificationService.markAllAsRead(user._id);
        res.json({ success: true, message: "All notifications marked as read", data: result });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

module.exports = {
    createNotification,
    getNotificationsByUser,
    markAsRead,
    deleteNotification,
    getUnreadCount,
    markAllAsRead,
};
