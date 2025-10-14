const bcrypt = require("bcryptjs");
require("dotenv").config();
const mongoose = require("mongoose");
const MenuFood = require("../models/MenuFood");
const ChiSo = require("../models/ChiSo");
const Medicine = require("../models/Medicine");
const Patient = require("../models/Patient");
const Food = require("../models/Food");

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

    // 3. xóa foods ngày hôm nay
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    await Food.deleteMany({
      userId: objectId,
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });

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
      time: { $gte: sevenDaysAgo }, // Lấy dữ liệu từ 7 ngày trước đến hiện tại
    };

    // Nếu có type cụ thể, thêm vào query
    if (type && ["fasting", "postMeal"].includes(type)) {
      query.type = type;
    }

    // Lấy chỉ số đường huyết trong 7 ngày qua, sắp xếp theo thời gian mới nhất
    let bloodSugarData = await ChiSo.find(query)
      .sort({ time: -1 })
      .select("value type time -_id");

    return {
      EM: `Fetch blood sugar data for last ${days} days successfully`,
      EC: 0,
      DT: {
        bloodSugarData,
        totalCount: bloodSugarData.length,
        userId: userId,
        dateRange: {
          from: sevenDaysAgo.toISOString(),
          to: new Date().toISOString(),
        },
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

const saveBloodSugar = async (userId, value, type) => {
  try {
    const objectId = new mongoose.Types.ObjectId(userId);

    // Tạo chỉ số đường huyết mới
    const newBloodSugar = new ChiSo({
      userId: objectId,
      value: value,
      type: type,
      time: new Date(),
    });

    // Lưu vào database
    const savedBloodSugar = await newBloodSugar.save();

    return {
      EM: "Blood sugar data saved successfully",
      EC: 0,
      DT: {
        bloodSugar: {
          id: savedBloodSugar._id,
          userId: savedBloodSugar.userId,
          value: savedBloodSugar.value,
          type: savedBloodSugar.type,
          time: savedBloodSugar.time,
        },
        message: `Blood sugar ${type} value ${value} mg/dL recorded at ${savedBloodSugar.time.toLocaleString()}`,
      },
    };
  } catch (error) {
    console.log(">>>>check Err saveBloodSugar: ", error);
    return {
      EM: "Something wrong in service ...",
      EC: -2,
      DT: "",
    };
  }
};

const applyMedicines = async (userId, name, time, lieu_luong, status) => {
  try {
    const objectId = new mongoose.Types.ObjectId(userId);

    // Map time string -> giờ uống
    let hours = 8; // mặc định sáng
    if (time === "trua") hours = 12;
    else if (time === "toi") hours = 19;

    const today = new Date();

    // Tạo mảng 7 ngày liên tiếp
    const medicines = [];
    for (let i = 0; i < 1; i++) {
      const medicineDate = new Date(today);
      medicineDate.setDate(today.getDate() + i);
      medicineDate.setHours(hours, 0, 0, 0); // set giờ theo time (08:00:00, 12:00:00, 19:00:00)

      // Trừ đi offset múi giờ (để Mongo lưu đúng giờ local)
      const tzOffset = medicineDate.getTimezoneOffset() * 60000; // phút → ms
      const localDate = new Date(medicineDate.getTime() - tzOffset);

      medicines.push({
        userId: objectId,
        name,
        time: localDate,
        lieu_luong,
        status,
      });
    }
    // Lưu tất cả vào database cùng lúc
    const savedMedicines = await Medicine.insertMany(medicines);

    return {
      EM: "Blood sugar data saved successfully",
      EC: 0,
      DT: savedMedicines,
    };
  } catch (error) {
    console.log(">>>>check Err saveBloodSugar: ", error);
    return {
      EM: "Something wrong in service ...",
      EC: -2,
      DT: "",
    };
  }
};

const fetchMedicines = async (userID, date) => {
  try {
    const objectId = new mongoose.Types.ObjectId(userID);

    let result = null;

    let query = { userId: objectId };
    const day = new Date(date);

    // tạo start và end trong ngày
    const startOfDay = new Date(day.setHours(0, 0, 0, 0));
    const endOfDay = new Date(day.setHours(23, 59, 59, 999));

    const offset = day.getTimezoneOffset() * 60000;

    query.time = {
      $gte: new Date(startOfDay.getTime() - offset),
      $lte: new Date(endOfDay.getTime() - offset),
    };

    result = await Medicine.find(query).lean();

    return {
      EM: "fetchMedicines successfully",
      EC: 0,
      DT: result,
    };
  } catch (error) {
    console.log(">>>>check Err fetchMedicines: ", error);
    return {
      EM: "Something wrong in service ...",
      EC: -2,
      DT: "",
    };
  }
};

const getAllPatients = async () => {
  try {
    const patients = await Patient.find().populate({
      path: "userId",
      select: "-password -uid", // loại bỏ password và uid
    });

    return patients;
  } catch (error) {
    console.log(">>>>check Err getAllPatients: ", error);
    throw new Error("Không thể lấy danh sách bệnh nhân.");
  }
};

const GetListFood = async (userID) => {
  try {
    const objectId = new mongoose.Types.ObjectId(userID);
    const today = new Date();

    // Tạo khoảng thời gian từ đầu ngày đến cuối ngày
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    // Truy vấn Mongo
    const listFood = await Food.find({
      userId: objectId,
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });

    return {
      EM: "Get list food successfully",
      EC: 0,
      DT: listFood,
    };
  } catch (error) {
    console.log(">>>>check Err GetListFood: ", error);
    return {
      EM: "Something wrong in service ...",
      EC: -2,
      DT: "",
    };
  }
};

const insertFoods = async (data) => {
  try {
    const userId = new mongoose.Types.ObjectId(data.userId);
    if (!Array.isArray(data.data) || data.data.length === 0) {
      return {
        EM: "Invalid input data. Expected a non-empty array.",
        EC: -1,
        DT: "",
      };
    }

    // Chèn nhiều bản ghi cùng lúc
    const foodsWithUser = data.data.map((item) => ({
      ...item,
      userId,
    }));
    const insertedFoods = await Food.insertMany(foodsWithUser);

    return {
      EM: "Foods inserted successfully",
      EC: 0,
      DT: insertedFoods,
    };
  } catch (error) {
    console.log(">>>>check Err insertFoods: ", error);
    return {
      EM: "Something wrong in service ...",
      EC: -2,
      DT: "",
    };
  }
};

const updateStatusFood = async (_id, checked) => {
  try {
    const id = new mongoose.Types.ObjectId(_id);
    if (!id || typeof checked !== "boolean") {
      return {
        EM: "Missing required parameters (id or checked status)",
        EC: 1, // Mã lỗi cho tham số thiếu
        DT: null,
      };
    }

    const updatedFood = await Food.findByIdAndUpdate(
      id,
      { checked: checked }, // Đặt giá trị 'status' bằng giá trị 'checked'
      { new: true } // { new: true } trả về document đã được cập nhật
    );

    if (!updatedFood) {
      return {
        EM: "Food not found or update failed",
        EC: 2, // Mã lỗi cho không tìm thấy
        DT: null,
      };
    }

    return {
      EM: "Food status updated successfully",
      EC: 0,
      DT: updatedFood, // Trả về đối tượng món ăn đã cập nhật
    };
  } catch (error) {
    console.log(">>>>check Err updateStatusFood: ", error);
    return {
      EM: "Something wrong in service ...",
      EC: -2,
      DT: "",
    };
  }
};

module.exports = {
  GetCaloFood,
  getMenuFood,
  updateMenuFood,
  fetchBloodSugar,
  saveBloodSugar,
  applyMedicines,
  fetchMedicines,
  getAllPatients,
  GetListFood,
  insertFoods,
  updateStatusFood,
};
