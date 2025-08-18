const bcrypt = require("bcryptjs");
require("dotenv").config();
const mongoose = require("mongoose");
const MenuFood = require("../models/MenuFood");

const GetCaloFood = async (userId) => {
  try {
    // Tìm menuFood bằng userId
    let menuFood = await MenuFood.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    });

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
