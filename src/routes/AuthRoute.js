const express = require("express");
const authController = require("../controllers/AuthController");
const { checkUserJwt } = require("../middleware/jwtAction");
const router = express.Router();

/**
 *
 * @param {*} app : express app
 * @returns
 */
const AuthRoutes = (app) => {
  // Middleware
  router.use(checkUserJwt);

  router.post("/api/login", authController.handleLogin);
  router.post("/api/test", (req, res) => {
    res.json({ message: "day là test" });
  });
  // router.post("/api/register", authController.handleRegister);

  //   app.post("/api/send-code", authController.sendCode);
  //   app.post("/api/reset-password", authController.resetPassword);
  //   app.post("/api/changePassword", authController.changePassword);
  //   app.post("/api/verifyEmail", authController.verifyEmail);

  return app.use("", router);
};

module.exports = AuthRoutes;
