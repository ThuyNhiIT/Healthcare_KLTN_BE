const bcrypt = require("bcryptjs");
require("dotenv").config();
const mongoose = require("mongoose");
const MenuFood = require("../models/MenuFood");
const ChiSo = require("../models/ChiSo");
const { createUser } = require("./authService");
const Patient = require("../models/Patient");

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

const fetchBloodSugar = async (userId, type = null, days = 7) => {
  try {
    const objectId = new mongoose.Types.ObjectId(userId);

    // Tính thời gian 7 ngày trước
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - days);

    let query = {
      userId: objectId,
      time: { $gte: sevenDaysAgo } // Lấy dữ liệu từ 7 ngày trước đến hiện tại
    };

    // Nếu có type cụ thể, thêm vào query
    if (type && ["fasting", "postMeal"].includes(type)) {
      query.type = type;
    }

    // Lấy chỉ số đường huyết trong 7 ngày qua, sắp xếp theo thời gian mới nhất
    let bloodSugarData = await ChiSo.find(query)
      .sort({ time: -1 })
      .select('value type time -_id');

    return {
      EM: `Fetch blood sugar data for last ${days} days successfully`,
      EC: 0,
      DT: {
        bloodSugarData,
        totalCount: bloodSugarData.length,
        userId: userId,
        dateRange: {
          from: sevenDaysAgo.toISOString(),
          to: new Date().toISOString()
        }
      },
    };
  } catch (error) {
    console.log(">>>>check Err fetchBloodSugar: ", error);
    return {
      EM: "Something wrong in service ...",
      EC: -2,
      DT: "",
    };
  }
};

const registerPatient = async (data) => {
  try {
    const savedUser = await createUser(data, "patient");
    const newPatient = new Patient({
      userId: savedUser._id,
      name: data.name,
      age: data.age,
      insuranceId: data.insuranceId,
      disease: data.disease,
      status: data.status || "Ổn định",
      avatar: data.avatar || savedUser.avatar,
      phone: data.phone,
      email: data.email,
      address: data.address,
      bloodType: data.bloodType || null,
      allergies: data.allergies,
      emergencyContact: data.emergencyContact,
      notes: data.notes,
      healthRecords: data.healthRecords || [],
    });

    const savedPatient = await newPatient.save();

    return savedPatient;
  } catch (err) {
    throw new Error("Error when register patient: " + err.message);
  }
};


module.exports = {
  GetCaloFood,
  getMenuFood,
  updateMenuFood,
  fetchBloodSugar,
  registerPatient
};
