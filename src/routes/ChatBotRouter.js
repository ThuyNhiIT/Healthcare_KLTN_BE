const express = require("express");
const chatController = require("../controllers/ChatBotController");
const { checkUserJwt } = require("../middleware/jwtAction");
const router = express.Router();

const ChatRoutes = (app) => {
  // Middleware
  router.use(checkUserJwt);

  // chatbot AI chatGPT
  app.post("/api/trendFood", chatController.trendFoodGPTResponse);

  return app.use("", router);
};

module.exports = ChatRoutes;
