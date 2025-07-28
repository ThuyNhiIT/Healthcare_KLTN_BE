const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
        },
        age: {
            type: Number,
            required: true,
            min: 0,
        },
        patientId: {
            type: String,
            required: true,
            unique: true, // Mã BHYT hoặc ID bệnh nhân
        },
        disease: {
            type: String,
            required: false,
        },
        status: {
            type: String,
            enum: ["Cần theo dõi", "Ổn định", "Khẩn cấp", "Chờ xác nhận"],
            default: "Ổn định",
        },
        avatar: {
            type: String,
            required: false,
        },
        phone: {
            type: String,
            required: false,
        },
        email: {
            type: String,
            required: false,
        },
        address: {
            type: String,
            required: false,
        },
        bloodType: {
            type: String,
            enum: ["A", "B", "AB", "O", null],
            default: null,
        },
        allergies: {
            type: String,
            required: false,
        },
        emergencyContact: {
            type: String,
            required: false,
        },
        notes: {
            type: String,
            required: false,
        },
        healthRecords: [
            {
                date: {
                    type: Date,
                    required: true,
                },
                bloodPressure: {
                    type: String, // VD: "160/95"
                    required: false,
                },
                heartRate: {
                    type: Number,
                    required: false,
                },
                bloodSugar: {
                    type: Number,
                    required: false,
                },
                recordedAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    },
    { timestamps: true }
);

const Patient = mongoose.model("Patient", patientSchema);

module.exports = Patient;