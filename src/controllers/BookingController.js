const bookingService = require("../services/bookingService");

const findUpcomingAppointments = async (req, res) => {
    try {
        const firebaseUid = req.user.user_id;
        console.log("User ID from token:", firebaseUid);
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
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    findUpcomingAppointments,
    cancelBooking,
    getDoctorsByDate
};