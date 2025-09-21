const express = require("express");
const foodController = require("../controllers/FoodController");
const patientController = require("../controllers/PatientController");
const { checkUserJwt } = require("../middleware/jwtAction");
const router = express.Router();

const PatientRoutes = (app) => {
  // Middleware
  router.use(checkUserJwt);

  app.post("/api/GetCaloFood", foodController.GetCaloFood);
  app.get("/api/getMenuFood", foodController.getMenuFood);
  app.post("/api/updateMenuFood", foodController.updateMenuFood); // confirm menuFood

  // Blood sugar routes
  app.post("/api/fetchBloodSugar", patientController.fetchBloodSugar);
  app.post("/api/saveBloodSugar", patientController.saveBloodSugar);

  // medicine routes
  app.post("/api/applyMedicines", patientController.applyMedicines); // apply medicine
  app.post("/api/fetchMedicines", patientController.fetchMedicines); // apply medicine

  // get all patients
  app.get("/api/getAllPatients", patientController.getAllPatients);

  return app.use("", router);
};

module.exports = PatientRoutes;
