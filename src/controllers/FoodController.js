const { OpenAI } = require("openai");
const Food = require("../models/Food");
const patientService = require("../services/patientService");
require("dotenv").config();

const GetCaloFood = async (req, res) => {
  try {
    let data = await patientService.GetCaloFood(req.body.userId);

    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (err) {
    console.error("Error in GetCaloFood controller:", err);
    return res.status(500).json({
      EM: "Error GetCaloFood",
      EC: -1,
      DT: "",
    });
  }
};

const updateMenuFood = async (req, res) => {
  try {
    let { menuFoodId, userId } = req.body;
    let data = await patientService.updateMenuFood(menuFoodId, userId);

    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (err) {
    console.error("Error in updateMenuFood controller:", err);
    return res.status(500).json({
      EM: "Error updateMenuFood",
      EC: -1,
      DT: "",
    });
  }
};

const getMenuFood = async (req, res) => {
  try {
    let data = await patientService.getMenuFood();

    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (err) {
    console.error("Error in getMenuFood controller:", err);
    return res.status(500).json({
      EM: "Error getMenuFood",
      EC: -1,
      DT: "",
    });
  }
};

const GetListFood = async (req, res) => {
  try {
    let userID = req.params.userID;
    let data = await patientService.GetListFood(userID);
    const jsonStr = JSON.stringify(data.DT);
    console.log("📦 Size GetListFood (bytes):", jsonStr.length);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (err) {
    console.error("Error in GetListFood controller:", err);
    return res.status(500).json({
      EM: "Error GetListFood",
      EC: -1,
      DT: "",
    });
  }
};

const insertFoods = async (req, res) => {
  try {
    const foods = req.body;
    let data = await patientService.insertFoods(foods);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (err) {
    console.error("Error in insertFoods controller:", err);
    return res.status(500).json({
      EM: err.message,
      EC: -1,
      DT: err.stack,
    });
  }
};

const updateStatusFood = async (req, res) => {
  try {
    let { id, checked } = req.body;
    let data = await patientService.updateStatusFood(id, checked);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (err) {
    console.error("Error in updateStatusFood controller:", err);
    return res.status(500).json({
      EM: "Error updateStatusFood",
      EC: -1,
      DT: "",
    });
  }
};

module.exports = {
  GetCaloFood,
  getMenuFood,
  updateMenuFood,
  GetListFood,
  insertFoods,
  updateStatusFood,
};
