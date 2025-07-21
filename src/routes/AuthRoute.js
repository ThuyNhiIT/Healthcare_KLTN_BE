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
  router.get("/api/account", authController.getUserAccount);
  // router.post("/api/register", authController.handleRegister);
  // router.post("/api/refreshToken", authController.handleRefreshToken);
  // router.post("/api/logout", authController.handleLogout);

  //Route QR
  //   app.post("/api/generate-qr-login", authController.generateQRLogin);
  //   app.post("/api/verify-qr-login", authController.verifyQRLogin);
  //   app.get("/api/check-qr-status/:sessionId", authController.checkQRStatus);

  //   app.post("/api/send-code", authController.sendCode);
  //   app.post("/api/reset-password", authController.resetPassword);
  //   app.post("/api/changePassword", authController.changePassword);
  //   app.post("/api/verifyEmail", authController.verifyEmail);

  //   app.get('/api/ping', (req, res) => {
  //     res.json({ message: 'pong' });
  //   });

  // router.post("/api/logout", authController.handleLogout);
  //   router.get("/user/getUserByPhone/:phone", authController.getUserByPhone);



  return app.use("", router);
};

module.exports = AuthRoutes;
