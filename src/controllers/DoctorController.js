const doctorService = require("../services/doctorService");

const findDoctorInfo = async (req, res) => {
    try {
        const firebaseUid = req.user.user_id; // lấy từ middleware auth
        const doctor = await doctorService.getInfoDoctor(firebaseUid);
        return res.json(doctor);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const updateDoctor = async (req, res) => {
    try {
        const firebaseUid = req.user.user_id; // lấy từ middleware auth
        const updateData = req.body;

        const updatedDoctor = await doctorService.updateDoctor(firebaseUid, updateData);
        return res.json(updatedDoctor);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
module.exports = {
    findDoctorInfo,
    updateDoctor
};
