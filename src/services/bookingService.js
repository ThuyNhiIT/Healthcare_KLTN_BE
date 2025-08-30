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

    return appointments;
};

const cancelBooking = async (appointmentId, firebaseUid) => {
    try {


        const user = await User.findOne({ uid: firebaseUid });
        if (!user) {
            throw new Error("Không tìm thấy user.");
        }

        const patient = await Patient.findOne({ userId: user._id });
        if (!patient) {
            throw new Error("Không tìm thấy bệnh nhân.");
        }
        const booking = await Appointment.findOne({ _id: appointmentId, patientId: patient._id });

        if (!booking) {
            return { success: false, message: "Không tìm thấy lịch hẹn" };
        }

        if (booking.status === "canceled") {
            return { success: false, message: "Lịch hẹn đã bị hủy" };
        }
        booking.status = "canceled";
        await booking.save();

        return { success: true, message: "Hủy lịch hẹn thành công", booking };
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = {
    getUpcomingAppointmentsByPatient,
    cancelBooking
};
