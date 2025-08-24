const express = require("express");
const DoctorController = require("../controllers/DoctorController");
const { checkUserJwt } = require("../middleware/jwtAction");

const router = express.Router();

const DoctorRoutes = (app) => {

    router.use(checkUserJwt);
    router.post("/create", DoctorController.createDoctor);
    router.get("/", DoctorController.getDoctors);
    router.get("/:id", DoctorController.getDoctorById);
    router.put("/:id", DoctorController.updateDoctor);
    router.delete("/:id", DoctorController.deleteDoctor);
    return app.use("/api/doctor", router);
};

module.exports = DoctorRoutes;
