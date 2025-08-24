const express = require("express");
const WorkShiftController = require("../controllers/WorkShiftController");
const { checkUserJwt } = require("../middleware/jwtAction");

const router = express.Router();

const WorkShiftRoutes = (app) => {
    // Bắt buộc user đã đăng nhập mới dùng được các API
    router.use(checkUserJwt);

    // Tạo ca làm mới
    router.post("/create", WorkShiftController.create);

    // Lấy danh sách ca làm
    router.get("/", WorkShiftController.getAll);

    // Lấy ca làm theo ID
    router.get("/:id", WorkShiftController.getById);

    // Cập nhật ca làm theo ID
    router.put("/:id", WorkShiftController.update);

    // Xóa ca làm theo ID
    router.delete("/:id", WorkShiftController.delete);

    // Chấm công vào ca
    router.post("/:id/checkin", WorkShiftController.checkIn);

    // Chấm công ra ca
    router.post("/:id/checkout", WorkShiftController.checkOut);

    // Gắn router vào app với prefix /api/workshift
    return app.use("/api/workshift", router);
};

module.exports = WorkShiftRoutes;
