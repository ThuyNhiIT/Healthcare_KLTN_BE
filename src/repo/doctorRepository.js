const Doctor = require("../models/Doctor");

const findAll = async () => {
  try {
    return await Doctor.find().populate("userId", "name email");
  } catch (error) {
    throw new Error("Lỗi khi lấy danh sách bác sĩ: " + error.message);
  }
};

const findDoctorById = async (id) => {
  try {
    return await Doctor.findById(id).populate("userId");
  } catch (error) {
    throw new Error("Lỗi khi lấy bác sĩ theo ID: " + error.message);
  }
};

const createDoctor = async (data) => {
  try {
    const doctor = new Doctor(data);
    return await doctor.save();
  } catch (error) {
    throw new Error("Lỗi khi tạo bác sĩ: " + error.message);
  }
};

const updateDoctor = async (id, data) => {
  try {
    return await Doctor.findByIdAndUpdate(id, data, { new: true });
  } catch (error) {
    throw new Error("Lỗi khi cập nhật bác sĩ: " + error.message);
  }
};

const deleteDoctor = async (id) => {
  try {
    return await Doctor.findByIdAndDelete(id);
  } catch (error) {
    throw new Error("Lỗi khi xóa bác sĩ: " + error.message);
  }
};

module.exports = {
  findAll,
  findDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
};
