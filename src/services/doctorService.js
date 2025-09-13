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

module.exports = {
    getInfoDoctor,
};
