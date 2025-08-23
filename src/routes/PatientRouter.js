const express = require("express");
const foodController = require("../controllers/FoodController");
const { checkUserJwt } = require("../middleware/jwtAction");
const router = express.Router();

const PatientRoutes = (app) => {
  // Middleware
  router.use(checkUserJwt);

  app.post("/api/GetCaloFood", foodController.GetCaloFood);
  app.get("/api/getMenuFood", foodController.getMenuFood);
  app.post("/api/updateMenuFood", foodController.updateMenuFood); // confirm menuFood

  return app.use("", router);
};

module.exports = PatientRoutes;
