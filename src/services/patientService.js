const bcrypt = require("bcryptjs");
require("dotenv").config();
const Food = require("../models/Food");

const GetCaloFood = async (userId) => {
  try {
    // Tìm tài khoản bằng email
    let menuFood = await Food.findOne({ userId: userId });

    return {
      EM: "GetCaloFood successfully",
      EC: 0,
      DT: { menuFood },
    };
  } catch (error) {
    console.log(">>>>check Err menuFood user: ", error);
    return {
      EM: "something wrong in service ...",
      EC: -2,
      DT: "",
    };
  }
};

module.exports = {
  GetCaloFood,
};
