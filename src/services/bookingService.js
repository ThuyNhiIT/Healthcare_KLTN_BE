const Appointment = require("../models/Appointment");
const Patient = require('../models/Patient');
const User = require("../models/User");
const Doctor = require("../models/Doctor");

const getUpcomingAppointmentsByPatient = async (firebaseUid) => {
    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    const user = await User.findOne({ uid: firebaseUid });
    if (!user) {
        throw new Error("Không tìm thấy user.");
    }

    const patient = await Patient.findOne({ userId: user._id });
    if (!patient) {
        throw new Error("Không tìm thấy bệnh nhân.");
    }

    console.log("Patient ID:", patient._id);
    let appointments = await Appointment.find({
        patientId: patient._id,
        date: { $gte: today },
        status: { $ne: "Hủy" }
    })
        .populate("patientId", "name age phone")
        .populate("doctorId", "hospital exp")
        .sort({ date: 1, time: 1 });

    appointments = appointments.filter((appt) => {
        const apptDate = new Date(appt.date);
        const [hours, minutes] = appt.time.split(":").map(Number);
        apptDate.setHours(hours, minutes, 0, 0);
        return apptDate >= now;
    });

    console.log("Filtered upcoming appointments:", appointments);

    return appointments;
};

module.exports = {
    getUpcomingAppointmentsByPatient,
};
