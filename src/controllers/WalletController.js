const walletService = require("../services/walletService");

module.exports = {
  // nạp tiền
  deposit: async (req, res) => {
    try {
      const { userId, amount } = req.body;
      const data = await walletService.deposit(userId, Number(amount));
      const status = data.EC === 0 ? 200 : data.EC === -1 ? 400 : 500;
      return res.status(status).json(data);
    } catch (error) {
      console.log("WalletController.deposit error", error);
      return res.status(500).json({ EM: "error from server", EC: -2, DT: "" });
    }
  },
  // xem số dư
  getBalance: async (req, res) => {
    try {
      const userId = req.params.userId;
      const data = await walletService.getBalance(userId);
      const status = data.EC === 0 ? 200 : data.EC === -1 ? 400 : 500;
      return res.status(status).json(data);
    } catch (error) {
      console.log("WalletController.getBalance error", error);
      return res.status(500).json({ EM: "error from server", EC: -2, DT: "" });
    }
  },
  // rút tiền
  withdraw: async (req, res) => {
    try {
      const { userId, amount } = req.body;
      const data = await walletService.withdraw(userId, Number(amount));
      let status = 500;
      if (data.EC === 0) status = 200;
      else if (data.EC === -1) status = 400;
      else if (data.EC === 1) status = 400; // insufficient funds
      return res.status(status).json(data);
    } catch (error) {
      console.log("WalletController.withdraw error", error);
      return res.status(500).json({ EM: "error from server", EC: -2, DT: "" });
    }
  },
};

