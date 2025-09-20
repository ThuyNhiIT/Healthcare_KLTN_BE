const express = require("express");
const { checkUserJwt } = require("../middleware/jwtAction");
const workShiftController = require("../controllers/WorkShiftController");
const router = express.Router();

const WorkShiftRoutes = (app) => {
    router.use(checkUserJwt);
    router.get("/", workShiftController.getWorkShiftsByDoctor);
    router.post("/", workShiftController.createWorkShifts);
    router.put("/", workShiftController.updateWorkShifts);
    router.delete("/:shiftId", workShiftController.deleteWorkShift);
    router.get("/today", workShiftController.getTodayWorkShifts);
    router.post("/checkin", workShiftController.checkInWorkShift);
    router.post("/checkout", workShiftController.checkOutWorkShift);
    return app.use("/api/workshift", router);
};

module.exports = WorkShiftRoutes;
