const doctorRepository = require("../repo/doctorRepository");

const getDoctors = async (req, res) => {
    try {
        const doctors = await doctorRepository.findAll();
        res.json(doctors);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getDoctorById = async (req, res) => {
    try {
        const doctor = await doctorRepository.findDoctorById(req.params.id);
        if (!doctor) {
            return res.status(404).json({ message: "Không tìm thấy bác sĩ" });
        }
        res.json(doctor);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const createDoctor = async (req, res) => {
    try {
        const doctor = await doctorRepository.createDoctor(req.body);
        res.status(201).json(doctor);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updateDoctor = async (req, res) => {
    try {
        const doctor = await doctorRepository.updateDoctor(req.params.id, req.body);
        if (!doctor) {
            return res.status(404).json({ message: "Không tìm thấy bác sĩ" });
        }
        res.json(doctor);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const deleteDoctor = async (req, res) => {
    try {
        const doctor = await doctorRepository.deleteDoctor(req.params.id);
        if (!doctor) {
            return res.status(404).json({ message: "Không tìm thấy bác sĩ" });
        }
        res.json({ message: "Xóa bác sĩ thành công" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getDoctors,
    getDoctorById,
    createDoctor,
    updateDoctor,
    deleteDoctor,
};
