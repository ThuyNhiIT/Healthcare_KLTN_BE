const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
    {
        patientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient",
            required: true,
        },
        doctorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Doctor",
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        time: {
            type: String,
            required: true,
            match: /^([0-1]\d|2[0-3]):[0-5]\d$/, // Định dạng HH:mm
        },
        type: {
            type: String,
            enum: ["Khám mới", "Tái khám", "Tư vấn"],
            required: true,
        },
        reason: {
            type: String,
            required: false,
        },
        notes: {
            type: String,
            required: false,
        },
        status: {
            type: String,
            enum: ["Chờ xác nhận", "Đã xác nhận", "Hủy", "Hoàn thành"],
            default: "Chờ xác nhận",
        },
    },
    { timestamps: true }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;