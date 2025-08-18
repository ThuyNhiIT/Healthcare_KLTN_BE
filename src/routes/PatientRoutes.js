const express = require("express");
const foodController = require("../controllers/FoodController");
const { checkUserJwt } = require("../middleware/jwtAction");
const router = express.Router();

const PatientRoutes = (app) => {
  // Middleware
  router.use(checkUserJwt);

  // chatbot AI chatGPT
  app.post("/api/GetCaloFood", foodController.GetCaloFood);

  return app.use("", router);
};

module.exports = PatientRoutes;
