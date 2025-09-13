const Appointment = require("../models/Appointment");
const Patient = require('../models/Patient');
const User = require("../models/User");
const Doctor = require("../models/Doctor");
const WorkShift = require("../models/WorkShift");

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
        status: { $ne: "canceled" }
    })
        .populate("patientId", "name age phone")
        .populate({
            path: "doctorId",
            select: "hospital exp status giay_phep userId",
            populate: {
                path: "userId",
                select: "username phone email avatar gender dob address"
            }
        })
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

const findDoctorsByDate = async (dateString) => {
    try {
        const targetDate = new Date(dateString);
        targetDate.setHours(0, 0, 0, 0);
        const nextDate = new Date(targetDate);
        nextDate.setDate(nextDate.getDate() + 1);

        const shifts = await WorkShift.find({
            date: { $gte: targetDate, $lt: nextDate }
        })
            .populate({
                path: "doctorId",
                populate: { path: "userId", select: "username email phone avatar" }
            });

        if (!shifts || shifts.length === 0) {
            return [];
        }

        const doctors = shifts.map(shift => ({
            doctorId: shift.doctorId._id,
            name: shift.doctorId.userId?.username || "No name",
            email: shift.doctorId.userId?.email || null,
            phone: shift.doctorId.userId?.phone || null,
            avatar: shift.doctorId.userId?.avatar || null,
            hospital: shift.doctorId.hospital,
            exp: shift.doctorId.exp,
            shift: {
                date: shift.date,
                start: shift.start,
                end: shift.end,
                checkedIn: shift.attendance.checkedIn,
                checkInMethod: shift.attendance.checkInMethod,
                checkInTime: shift.attendance.checkInTime,
            }
        }));

        return doctors;
    } catch (error) {
        throw new Error(error.message);
    }
};

const getAllDoctorShifts = async () => {
    try {
        const shifts = await WorkShift.find()
            .populate({
                path: "doctorId",
                populate: { path: "userId", select: "username email phone avatar" }
            })
            .sort({ "doctorId": 1, "date": 1, "start": 1 });

        if (!shifts || shifts.length === 0) return [];

        const doctorsMap = {};

        shifts.forEach(shift => {
            const doctorId = shift.doctorId._id.toString();
            if (!doctorsMap[doctorId]) {
                doctorsMap[doctorId] = {
                    doctorId: doctorId,
                    name: shift.doctorId.userId?.username || "No name",
                    email: shift.doctorId.userId?.email || null,
                    phone: shift.doctorId.userId?.phone || null,
                    avatar: shift.doctorId.userId?.avatar || null,
                    hospital: shift.doctorId.hospital,
                    exp: shift.doctorId.exp,
                    shifts: []
                };
            }
            doctorsMap[doctorId].shifts.push({
                date: shift.date,
                start: shift.start,
                end: shift.end,
                checkedIn: shift.attendance.checkedIn,
                checkInMethod: shift.attendance.checkInMethod,
                checkInTime: shift.attendance.checkInTime
            });
        });

        return Object.values(doctorsMap);
    } catch (error) {
        throw new Error(error.message);
    }
};

const getDoctorWorkHours = async (doctorId) => {
    try {
        const shifts = await WorkShift.find({ doctorId })
            .sort({ date: 1, start: 1 });

        if (!shifts || shifts.length === 0) return [];

        const workHours = shifts.map(shift => ({
            date: shift.date,
            start: shift.start,
            end: shift.end,
            checkedIn: shift.attendance.checkedIn,
            checkInMethod: shift.attendance.checkInMethod,
            checkInTime: shift.attendance.checkInTime
        }));

        return workHours;
    } catch (error) {
        throw new Error(error.message);
    }
};

const bookAppointment = async ({ firebaseUid, doctorId, date, time, type, reason, notes }) => {
    try {
        const user = await User.findOne({ uid: firebaseUid });
        if (!user) throw new Error("Không tìm thấy user.");

        const patient = await Patient.findOne({ userId: user._id });
        if (!patient) throw new Error("Không tìm thấy bệnh nhân.");

        const targetDate = new Date(date);
        targetDate.setHours(targetDate.getHours());

        const nextDate = new Date(targetDate);
        nextDate.setDate(nextDate.getDate() + 1);

        const shift = await WorkShift.findOne({
            doctorId,
            date: { $gte: targetDate, $lt: nextDate },
            start: { $lte: time },
            end: { $gte: time }
        });

        if (!shift) throw new Error("Bác sĩ không có ca làm việc vào thời gian này.");

        const existing = await Appointment.findOne({
            doctorId,
            date: targetDate,
            time,
            status: { $ne: "canceled" }
        });

        if (existing) throw new Error("Bác sĩ đã có lịch hẹn vào thời gian này.");

        const appointment = new Appointment({
            patientId: patient._id,
            doctorId,
            date: targetDate,
            time: time || "",
            type: type || "onsite",
            reason: reason || "",
            notes: notes || "",
            status: "pending"
        });

        await appointment.save();

        return appointment;
    } catch (error) {
        throw new Error(error.message);
    }
};

const getDoctorWorkHoursByDate = async (doctorId, dateString) => {
    try {
        const targetDate = new Date(dateString);
        targetDate.setHours(0, 0, 0, 0);
        const nextDate = new Date(targetDate);
        nextDate.setDate(nextDate.getDate() + 1);

        const shifts = await WorkShift.find({
            doctorId,
            date: { $gte: targetDate, $lt: nextDate }
        }).sort({ start: 1 });

        if (!shifts || shifts.length === 0) return [];

        const workHours = shifts.map(shift => ({
            date: shift.date,
            start: shift.start,
            end: shift.end,
            checkedIn: shift.attendance?.checkedIn || false,
            checkInMethod: shift.attendance?.checkInMethod || null,
            checkInTime: shift.attendance?.checkInTime || null
        }));

        return workHours;
    } catch (error) {
        throw new Error(error.message);
    }
};


module.exports = {
    getUpcomingAppointmentsByPatient,
    cancelBooking,
    findDoctorsByDate,
    getAllDoctorShifts,
    getDoctorWorkHours,
    bookAppointment,
    getDoctorWorkHoursByDate
};
