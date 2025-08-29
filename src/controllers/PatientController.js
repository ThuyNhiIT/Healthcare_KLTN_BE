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

module.exports = {
  fetchBloodSugar,
};
