const Wallet = require("../models/Wallet");

const ensureWallet = async (userId) => {
  let wallet = await Wallet.findOne({ userId });
  if (!wallet) {
    wallet = new Wallet({ userId, balance: 0 });
    await wallet.save();
  }
  return wallet;
};

const deposit = async (userId, amount) => {
  try {
    if (!userId || amount == null) {
      return { EM: "userId and amount are required", EC: -1, DT: "" };
    }
    if (typeof amount !== "number" || isNaN(amount) || amount <= 0) {
      return { EM: "amount must be a positive number", EC: -1, DT: "" };
    }

    const wallet = await ensureWallet(userId);
    wallet.balance += amount;
    wallet.history.push({ amount, createdAt: new Date() });
    await wallet.save();

    return { EM: "Deposit successful", EC: 0, DT: { balance: wallet.balance } };
  } catch (error) {
    console.error("walletService.deposit error:", error);
    return { EM: "something wrong in service ...", EC: -2, DT: "" };
  }
};

const getBalance = async (userId) => {
  try {
    if (!userId) {
      return { EM: "userId is required", EC: -1, DT: "" };
    }
    const wallet = await ensureWallet(userId);
    const totalBalance = wallet.history.reduce((sum, h) => sum + h.amount, 0);
    return { EM: "ok", EC: 0, DT: { balance: totalBalance } };
  } catch (error) {
    console.error("walletService.getBalance error:", error);
    return { EM: "something wrong in service ...", EC: -2, DT: "" };
  }
};

const withdraw = async (userId, amount) => {
  try {
    if (!userId || amount == null) {
      return { EM: "userId and amount are required", EC: -1, DT: "" };
    }
    if (typeof amount !== "number" || isNaN(amount) || amount <= 0) {
      return { EM: "amount must be a positive number", EC: -1, DT: "" };
    }
    const wallet = await ensureWallet(userId);
    if (wallet.balance < amount) {
      return { EM: "Insufficient funds", EC: 1, DT: { balance: wallet.balance } };
    }
    wallet.balance -= amount;
    wallet.history.push({ amount: -amount, createdAt: new Date() });
    await wallet.save();

    return { EM: "Withdraw successful", EC: 0, DT: { balance: wallet.balance } };
  } catch (error) {
    console.error("walletService.withdraw error:", error);
    return { EM: "something wrong in service ...", EC: -2, DT: "" };
  }
};

module.exports = { deposit, getBalance, withdraw };

