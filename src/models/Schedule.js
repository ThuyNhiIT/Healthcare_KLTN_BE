const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema(
    {
        doctorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Doctor",
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        start: {
            type: String,
            required: true,
            match: /^([0-1]\d|2[0-3]):[0-5]\d$/, // Định dạng HH:mm
        },
        end: {
            type: String,
            required: true,
            match: /^([0-1]\d|2[0-3]):[0-5]\d$/, // Định dạng HH:mm
        },
        shiftType: {
            type: String,
            enum: ["morning", "afternoon", "evening"],
            required: true,
        },
        attendance: {
            checkedIn: {
                type: Boolean,
                default: false,
            },
            checkInMethod: {
                type: String,
                enum: ["QR", "webcam", null],
                default: null,
            },
            checkInTime: {
                type: String,
                match: /^([0-1]\d|2[0-3]):[0-5]\d$/,
                default: null,
            },
        },
    },
    { timestamps: true }
);

const Schedule =
    mongoose.models.Schedule || mongoose.model("Schedule", scheduleSchema);

module.exports = Schedule;
