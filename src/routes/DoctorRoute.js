const express = require("express");
const { checkUserJwt } = require("../middleware/jwtAction");
const doctorController = require("../controllers/DoctorController");
const router = express.Router();

const DoctorRoutes = (app) => {
    router.use(checkUserJwt);
    router.get("/info", doctorController.findDoctorInfo);
    router.put("/update", doctorController.updateDoctor);
    router.get("/appointment/today", doctorController.getTodayAppointmentsByDoctor);
    router.get("/appointment/upcoming", doctorController.findUpcomingAppointmentsByDoctor);
    router.put("/appointment/:appointmentId", doctorController.updateAppointment);
    router.get("/appointment/:appointmentId", doctorController.getAppointmentById);
    router.delete("/appointment/:appointmentId", doctorController.deleteAppointment);
    return app.use("/api/doctor", router);
};

module.exports = DoctorRoutes;
