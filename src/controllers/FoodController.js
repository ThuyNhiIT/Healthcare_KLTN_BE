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
    let {menuFoodId, userId} = req.body
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
    console.error("Error in updateMenuFood controller:", err);
    return res.status(500).json({
      EM: "Error updateMenuFood",
      EC: -1,
      DT: "",
    });
  }
};

module.exports = {
  GetCaloFood,
  getMenuFood,
  updateMenuFood,
};
