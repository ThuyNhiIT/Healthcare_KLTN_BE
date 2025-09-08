const patientService = require("../services/patientService");

const fetchBloodSugar = async (req, res) => {
  try {
    const { userId, type, days } = req.body;

    if (!userId) {
      return res.status(400).json({
        EM: "User ID is required",
        EC: -1,
        DT: "",
      });
    }

    // Mặc định lấy 7 ngày nếu không có tham số days
    const numberOfDays = days || 7;

    const result = await patientService.fetchBloodSugar(userId, type, numberOfDays);

    if (result.EC === 0) {
      return res.status(200).json(result);
    } else {
      return res.status(500).json(result);
    }
  } catch (error) {
    console.log(">>>>check Err fetchBloodSugar controller: ", error);
    return res.status(500).json({
      EM: "Something wrong in controller ...",
      EC: -2,
      DT: "",
    });
  }
};

const saveBloodSugar = async (req, res) => {
  try {
    const { userId, value, type } = req.body;

    if (!userId || !value || !type) {
      return res.status(400).json({
        EM: "User ID, value, and type are required",
        EC: -1,
        DT: "",
      });
    }

    // Validate type
    if (!["fasting", "postMeal"].includes(type)) {
      return res.status(400).json({
        EM: "Type must be either 'fasting' or 'postMeal'",
        EC: -1,
        DT: "",
      });
    }

    // Validate value (blood sugar should be positive and reasonable)
    if (value <= 0 || value > 1000) {
      return res.status(400).json({
        EM: "Blood sugar value must be between 0 and 1000 mg/dL",
        EC: -1,
        DT: "",
      });
    }

    const result = await patientService.saveBloodSugar(userId, value, type);

    if (result.EC === 0) {
      return res.status(200).json(result);
    } else {
      return res.status(500).json(result);
    }
  } catch (error) {
    console.log(">>>>check Err saveBloodSugar controller: ", error);
    return res.status(500).json({
      EM: "Something wrong in controller ...",
      EC: -2,
      DT: "",
    });
  }
};

const applyMedicines = async (req, res) => {
  try {
    const { userId, name, time, lieu_luong, status } = req.body;
    
    const result = await patientService.applyMedicines(userId, name, time, lieu_luong, status);

    if (result.EC === 0) {
      return res.status(200).json(result);
    } else {
      return res.status(500).json(result);
    }
  } catch (error) {
    console.log(">>>>check Err saveBloodSugar controller: ", error);
    return res.status(500).json({
      EM: "Something wrong in controller ...",
      EC: -2,
      DT: "",
    });
  }
};

const fetchMedicines = async (req, res) => {
  try {
    const { userId } = req.query;
    
    const result = await patientService.fetchMedicines(userId);

    if (result.EC === 0) {
      return res.status(200).json(result);
    } else {
      return res.status(500).json(result);
    }
  } catch (error) {
    console.log(">>>>check Err saveBloodSugar controller: ", error);
    return res.status(500).json({
      EM: "Something wrong in controller ...",
      EC: -2,
      DT: "",
    });
  }
};


module.exports = {
  fetchBloodSugar,
  saveBloodSugar,
  applyMedicines,
  fetchMedicines
};
