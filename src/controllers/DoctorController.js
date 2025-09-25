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


const getTodayAppointmentsByDoctor = async (req, res) => {
    try {
        const firebaseUid = req.user.user_id;
        const appointments = await doctorService.getTodayAppointmentsByDoctor(firebaseUid);
        return res.json(appointments);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const findUpcomingAppointmentsByDoctor = async (req, res) => {
    try {
        const firebaseUid = req.user.user_id;
        const appointments = await doctorService.getUpcomingAppointmentsByDoctor(firebaseUid);
        return res.json(appointments);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const updateAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const updateData = req.body;

        const updatedAppointment = await doctorService.updateAppointment(appointmentId, updateData);
        return res.json(updatedAppointment);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getAppointmentById = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const appointment = await doctorService.getAppointmentById(appointmentId);
        return res.json(appointment);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const deleteAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const result = await doctorService.deleteAppointment(appointmentId);
        return res.json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getPatientPastAppointments = async (req, res) => {
    try {
        const firebaseUid = req.user.user_id;      // bác sĩ đang đăng nhập
        const { patientId } = req.params;          // id bệnh nhân cần xem

        const appointments = await doctorService.getPatientPastAppointments(firebaseUid, patientId);
        return res.json(appointments);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Lấy summary
const getSummary = async (req, res) => {
    try {
        const summary = await doctorService.getSummary(req.user.user_id);
        return res.json(summary);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Lấy revenue
const getRevenue = async (req, res) => {
    try {
        const revenue = await doctorService.getRevenue(req.user.user_id, req.params.period);
        return res.json(revenue);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Lấy patients attention
const getPatientsAttention = async (req, res) => {
    try {
        const patients = await doctorService.getPatientsAttention(req.user.user_id);
        return res.json(patients);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Lấy health data cho patient
const getPatientHealth = async (req, res) => {
    try {
        const healthData = await doctorService.getPatientHealth(req.params.patientId, req.params.period);
        return res.json(healthData);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    findDoctorInfo,
    updateDoctor,
    getTodayAppointmentsByDoctor,
    findUpcomingAppointmentsByDoctor,
    updateAppointment,
    getAppointmentById,
    deleteAppointment,
    getPatientPastAppointments,
    getSummary,
    getRevenue,
    getPatientsAttention,
    getPatientHealth
};

