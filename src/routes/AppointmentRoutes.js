const express = require("express");
const AppointmentController = require("../controllers/AppointmentController");
const { checkUserJwt } = require("../middleware/jwtAction");

const router = express.Router();

const AppointmentRoutes = (app) => {
    router.use(checkUserJwt);

    router.get("/", AppointmentController.getAppointments); // list + filter + pagination
    router.get("/:id", AppointmentController.getAppointmentById); // chi tiết
    router.post("/create", AppointmentController.createAppointment); // thêm
    router.put("/:id", AppointmentController.updateAppointment); // sửa
    router.delete("/:id", AppointmentController.deleteAppointment); // xóa

    return app.use("/api/appointment", router);
};

module.exports = AppointmentRoutes;
