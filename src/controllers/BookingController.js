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

module.exports = {
    findUpcomingAppointments,
};