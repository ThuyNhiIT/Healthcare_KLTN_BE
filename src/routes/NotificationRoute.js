const express = require("express");
const { checkUserJwt } = require("../middleware/jwtAction");
const notificationController = require("../controllers/notificationController");

const router = express.Router();

const NotificationRoutes = (app) => {
    router.use(checkUserJwt);
    router.post("/", notificationController.createNotification);
    router.get("/", notificationController.getNotificationsByUser);
    router.patch("/:notificationId/read", notificationController.markAsRead);
    router.delete("/:notificationId", notificationController.deleteNotification);
    router.get("/unread-count", notificationController.getUnreadCount);
    router.patch("/mark-all-read", notificationController.markAllAsRead);

    return app.use("/api/notification", router);
};

module.exports = NotificationRoutes;
