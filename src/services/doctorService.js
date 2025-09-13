const User = require("../models/User");
const Doctor = require("../models/Doctor");

const getInfoDoctor = async (firebaseUid) => {
    // Tìm user theo firebaseUid
    const user = await User.findOne({ uid: firebaseUid });
    if (!user) {
        throw new Error("Không tìm thấy user.");
    }

    // Tìm doctor gắn với user
    const doctor = await Doctor.findOne({ userId: user._id })
        .populate("userId", "username email phone avatar gender dob address role");

    if (!doctor) {
        throw new Error("Không tìm thấy bác sĩ.");
    }

    return doctor;
};


const updateDoctor = async (firebaseUid, updateData) => {
    const user = await User.findOne({ uid: firebaseUid });
    if (!user) throw new Error("Không tìm thấy user.");

    const doctor = await Doctor.findOne({ userId: user._id });
    if (!doctor) throw new Error("Không tìm thấy bác sĩ.");

    // Update thông tin User
    const userFields = ["username", "email", "phone", "avatar", "gender", "dob", "address"];
    userFields.forEach(field => {
        if (updateData[field] !== undefined) {
            user[field] = updateData[field];
        }
    });
    await user.save();

    // Update thông tin Doctor
    const doctorFields = ["exp", "giay_phep", "hospital", "status"];
    doctorFields.forEach(field => {
        if (updateData[field] !== undefined) {
            doctor[field] = updateData[field];
        }
    });
    await doctor.save();

    // Populate lại để trả về đủ info
    const updatedDoctor = await Doctor.findById(doctor._id)
        .populate("userId", "username email phone avatar gender dob address role");

    return updatedDoctor;
};

module.exports = {
    getInfoDoctor,
    updateDoctor
};
