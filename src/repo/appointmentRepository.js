const Appointment = require("../models/Appointment");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const User = require("../models/User");
const mongoose = require("mongoose");

const getAppointments = async (filter = {}, options = {}) => {
    try {
        const { page = 1, limit = 5, sort = { dateTime: 1 } } = options;

        // Query với populate patient + doctor
        const query = Appointment.find(filter)
            .populate({
                path: "patientId",
                select: "name age avatar disease",
            })
            .populate({
                path: "doctorId",
                populate: {
                    path: "userId",
                    select: "username email",
                },
            })
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(limit);

        const appointments = await query.exec();
        const total = await Appointment.countDocuments(filter);

        return {
            data: appointments,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    } catch (error) {
        throw new Error("Lỗi khi lấy danh sách lịch hẹn: " + error.message);
    }
};

const getAppointmentById = async (id) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) return null;

        return await Appointment.findById(id)
            .populate({
                path: "patientId",
                select: "name age avatar disease",
            })
            .populate({
                path: "doctorId",
                populate: { path: "userId", select: "username email" },
            });
    } catch (error) {
        throw new Error("Lỗi khi lấy lịch hẹn theo ID: " + error.message);
    }
};

const createAppointment = async (data) => {
    try {
        // Tạo dateTime từ date + time
        data.dateTime = new Date(`${data.date}T${data.time}`);
        const appointment = new Appointment(data);
        return await appointment.save();
    } catch (error) {
        throw new Error("Lỗi khi tạo lịch hẹn: " + error.message);
    }
};

const updateAppointment = async (id, data) => {
    try {
        if (data.date && data.time) {
            data.dateTime = new Date(`${data.date}T${data.time}`);
        }
        return await Appointment.findByIdAndUpdate(id, data, { new: true });
    } catch (error) {
        throw new Error("Lỗi khi cập nhật lịch hẹn: " + error.message);
    }
};

const deleteAppointment = async (id) => {
    try {
        return await Appointment.findByIdAndDelete(id);
    } catch (error) {
        throw new Error("Lỗi khi xóa lịch hẹn: " + error.message);
    }
};

module.exports = {
    getAppointments,
    getAppointmentById,
    createAppointment,
    updateAppointment,
    deleteAppointment,
};
