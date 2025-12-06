const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        // name: {
        //     type: String,
        //     required: true,
        // },
        age: {
            type: Number,
            min: 0,
        },
        insuranceId: { // Mã bảo hiểm y tế hoặc ID bệnh nhân
            type: String,
            required: false,
        },
        disease: { // bệnh lý chính
            type: String,
            required: false,
        },
        status: {
            type: String,
            enum: ["Cần theo dõi", "Ổn định", "Đang điều trị", "Theo dõi"],
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
        bloodType: { // nhóm máu
            type: String,
            enum: ["A", "B", "AB", "O", null],
            default: null,
        },
        allergies: { // dị ứng
            type: String,
            required: false,
        },
        emergencyContact: { // người liên hệ khẩn cấp
            type: String,
            required: false,
        },
        notes: { // ghi chú
            type: String,
            required: false,
        },
        healthRecords: [ // hồ sơ sức khỏe
            {
                date: {
                    type: Date,
                    default: Date.now,
                },
                bloodPressure: { // huyết áp
                    type: String, // VD: "160/95"
                    required: false,
                },
                heartRate: { // nhịp tim
                    type: Number,
                    required: false,
                },
                bloodSugar: { // đường huyết
                    type: Number,
                    required: false,
                },
                recordedAt: { // thời gian ghi nhận
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