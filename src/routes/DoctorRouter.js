const express = require("express");
const DoctorController = require("../controllers/DoctorController");

const router = express.Router();


router.post("/create", DoctorController.createDoctor);
router.get("/", DoctorController.getDoctors);
router.get("/:id", DoctorController.getDoctorById);
router.put("/:id", DoctorController.updateDoctor);
router.delete("/:id", DoctorController.deleteDoctor);

module.exports = router;
