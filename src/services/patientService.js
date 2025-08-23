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

const updateMenuFood = async (menuFoodId, userId) => {
  try {
    const objectId = new mongoose.Types.ObjectId(userId);

    // 1. Xóa userId khỏi tất cả menuFood khác
    await MenuFood.updateMany(
      { userId: objectId },
      { $pull: { userId: objectId } }
    );

    // 2. Thêm userId vào menuFood được chọn
    let menuFood = await MenuFood.findByIdAndUpdate(
      menuFoodId,
      { $addToSet: { userId: objectId } }, // thêm vào otherUserIds (tránh trùng lặp)
      { new: true } // trả về document mới sau update
    );

    return {
      EM: "updateMenuFood successfully",
      EC: 0,
      DT: { menuFood },
    };
  } catch (error) {
    console.log(">>>>check Err updateMenuFood user: ", error);
    return {
      EM: "something wrong in service ...",
      EC: -2,
      DT: "",
    };
  }
};

const getMenuFood = async () => {
  try {
    let menuFood = await MenuFood.find();

    return {
      EM: "getMenuFood successfully",
      EC: 0,
      DT: menuFood,
    };
  } catch (error) {
    console.log(">>>>check Err getMenuFood user: ", error);
    return {
      EM: "something wrong in service ...",
      EC: -2,
      DT: "",
    };
  }
};

module.exports = {
  GetCaloFood,
  getMenuFood,
  updateMenuFood,
};
