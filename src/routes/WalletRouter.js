const express = require("express");
const walletController = require("../controllers/WalletController");
const { checkUserJwt } = require("../middleware/jwtAction");
const router = express.Router();

const WalletRoutes = (app) => {
  // Middleware
  router.use(checkUserJwt);

  // Wallet endpoints
  app.post("/api/wallet/deposit", walletController.deposit);
  app.get("/api/wallet/balance/:userId", walletController.getBalance);
  app.post("/api/wallet/withdraw", walletController.withdraw);

  return app.use("", router);
};

module.exports = WalletRoutes;

