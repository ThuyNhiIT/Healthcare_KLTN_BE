const Doctor = require("../models/Doctor");
const { createUser } = require("../services/authService");

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

const registerDoctor = async (data) => {
  try {
    const savedUser = await createUser(data, "doctor");
    const newDoctor = new Doctor({
      userId: savedUser._id,
      exp: data.exp || 0,
      giay_phep: data.giay_phep,
      hospital: data.hospital,
      specialty: data.specialty,
      status: "on",
    });

    const savedDoctor = await newDoctor.save();

    return savedDoctor;
  } catch (err) {
    throw new Error("Lỗi khi đăng ký bác sĩ: " + err.message);
  }
};

module.exports = {
  findAll,
  findDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  registerDoctor
};
