const bookingService = require("../services/bookingService");

const findUpcomingAppointments = async (req, res) => {
    try {
        const firebaseUid = req.user.user_id;
        const appointments = await bookingService.getUpcomingAppointmentsByPatient(firebaseUid);
        return res.json(appointments);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const cancelBooking = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const firebaseUid = req.user.user_id;

        const result = await bookingService.cancelBooking(appointmentId, firebaseUid);

        if (!result.success) {
            return res.status(400).json(result);
        }

        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getDoctorsByDate = async (req, res) => {
    try {
        const { date } = req.query; // yyyy-mm-dd

        if (!date) {
            return res.status(400).json({ message: "Vui lòng cung cấp ngày (yyyy-mm-dd)" });
        }

        const doctors = await bookingService.findDoctorsByDate(date);

        return res.status(200).json(doctors);
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};


const getDoctorShifts = async (req, res) => {
    try {
        const doctors = await bookingService.getAllDoctorShifts();
        return res.status(200).json(doctors);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


const getDoctorWorkHours = async (req, res) => {
    try {
        const { doctorId } = req.params;
        const workHours = await bookingService.getDoctorWorkHours(doctorId);

        return res.status(200).json(workHours);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const bookAppointment = async (req, res) => {
    try {
        const firebaseUid = req.user.user_id;
        const { doctorId, date, time, type, reason, notes } = req.body;
        const appointment = await bookingService.bookAppointment({
            firebaseUid,
            doctorId,
            date,
            time,
            type,
            reason,
            notes
        });

        return res.status(201).json(appointment);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

module.exports = {
    findUpcomingAppointments,
    cancelBooking,
    getDoctorsByDate,
    getDoctorShifts,
    getDoctorWorkHours,
    bookAppointment
};