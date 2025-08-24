const express = require("express");
const OverviewController = require("../controllers/OverviewController");
const { checkUserJwt } = require("../middleware/jwtAction");

const router = express.Router();

const OverviewRoutes = (app) => {
    // Áp dụng JWT cho tất cả route overview
    router.use(checkUserJwt);

    // Tổng quan nhanh
    router.get("/summary", OverviewController.getSummary);

    // Doanh thu theo thời gian: ?period=week|month|year
    router.get("/revenue", OverviewController.getRevenue);

    // Danh sách bệnh nhân cần chú ý
    router.get("/critical-patients", OverviewController.getCriticalPatients);

    // Chỉ số sức khỏe bệnh nhân: param patientId, query period=week|month|year
    router.get("/patient/:patientId/health", OverviewController.getPatientHealth);

    return app.use("/api/overview", router);
};

module.exports = OverviewRoutes;
