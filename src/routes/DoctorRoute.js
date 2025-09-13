const express = require("express");
const { checkUserJwt } = require("../middleware/jwtAction");
const doctorController = require("../controllers/DoctorController");
const router = express.Router();

const DoctorRoutes = (app) => {
    router.use(checkUserJwt);
    router.get("/info", doctorController.findDoctorInfo);
    router.put("/update", doctorController.updateDoctor);
    return app.use("/api/doctor", router);
};

module.exports = DoctorRoutes;
