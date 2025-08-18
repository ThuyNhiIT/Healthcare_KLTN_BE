const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Import Models
const User = require("../models/User");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");
const Appointment = require("../models/Appointment");
const Payment = require("../models/Payment");
const Schedule = require("../models/Schedule");
const Message = require("../models/Message");
const ChiSo = require("../models/ChiSo");
const WorkShift = require("../models/WorkShift");
const Medicine = require("../models/Medicine");
const Food = require("../models/Food");
const MenuFood = require("../models/MenuFood");

dotenv.config();

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));

const seedAll = async () => {
    try {
        // ================= USERS =================
        await User.deleteMany();
        const users = await User.insertMany([
            {
                uid: "U001",
                email: "nguyenvana@example.com",
                phone: "0909123456",
                username: "nguyenvana",
                password: "123456",
                address: "Hà Nội",
                gender: "Nam",
                dob: "1980-05-20",
                role: "patient",
            },
            {
                uid: "U002",
                email: "lethic@example.com",
                phone: "0912345678",
                username: "lethic",
                password: "abcdef",
                address: "TP.HCM",
                gender: "Nữ",
                dob: "1992-03-15",
                role: "patient",
            },
            {
                uid: "U003",
                email: "bs.nguyend@example.com",
                phone: "0933555777",
                username: "bsnguyend",
                password: "doctor123",
                address: "Đà Nẵng",
                gender: "Nam",
                dob: "1975-11-02",
                role: "doctor",
            },
        ]);
        console.log("✅ Seed users thành công!");

        // ================= DOCTORS =================
        await Doctor.deleteMany();
        const doctors = await Doctor.insertMany([
            {
                userId: users[2]._id,
                status: "on",
                exp: 10,
                giay_phep: "GP123456",
                hospital: "Bệnh viện Bạch Mai",
            },
        ]);
        console.log("✅ Seed doctors thành công!");

        // ================= PATIENTS =================
        await Patient.deleteMany();
        const patients = await Patient.insertMany([
            {
                userId: users[0]._id,
                name: "Nguyễn Văn A",
                age: 45,
                insuranceId: "BHYT123456",
                disease: "Tiểu đường",
                status: "Cần theo dõi",
                phone: "0909123456",
                email: "nguyenvana@example.com",
                address: "Hà Nội",
                bloodType: "O",
                allergies: "Không",
                emergencyContact: "Trần Thị B",
                notes: "Cần theo dõi huyết áp định kỳ",
                healthRecords: [
                    {
                        date: new Date("2025-08-01"),
                        bloodPressure: "140/90",
                        heartRate: 80,
                        bloodSugar: 7.5,
                    },
                ],
            },
            {
                userId: users[1]._id,
                name: "Lê Thị C",
                age: 32,
                insuranceId: "BHYT654321",
                disease: "Huyết áp cao",
                status: "Ổn định",
                phone: "0912345678",
                email: "lethic@example.com",
                address: "TP. Hồ Chí Minh",
                bloodType: "A",
                allergies: "Hải sản",
                emergencyContact: "Nguyễn Văn D",
                healthRecords: [
                    {
                        date: new Date("2025-08-10"),
                        bloodPressure: "150/95",
                        heartRate: 85,
                    },
                ],
            },
        ]);
        console.log("✅ Seed patients thành công!");

        // ================= APPOINTMENTS =================
        await Appointment.deleteMany();
        await Appointment.insertMany([
            {
                patientId: patients[0]._id,
                doctorId: doctors[0]._id,
                date: new Date("2025-08-20"),
                time: "09:00",
                type: "Khám mới",
                reason: "Đau đầu thường xuyên",
                notes: "Cần kiểm tra thêm xét nghiệm máu",
                status: "Đã xác nhận",
            },
        ]);
        console.log("✅ Seed appointments thành công!");

        // ================= PAYMENTS =================
        await Payment.deleteMany();
        await Payment.insertMany([
            {
                patientId: patients[0]._id,
                doctorId: doctors[0]._id,
                method: "MoMo",
                amount: 500000,
                timestamp: new Date("2025-08-10T10:30:00"),
                status: "success",
            },
        ]);
        console.log("✅ Seed payments thành công!");

        // ================= SCHEDULES =================
        await Schedule.deleteMany();
        await Schedule.insertMany([
            {
                doctorId: doctors[0]._id,
                date: new Date("2025-08-20"),
                start: "08:00",
                end: "12:00",
                shiftType: "morning",
                attendance: {
                    checkedIn: true,
                    checkInMethod: "QR",
                    checkInTime: "08:05",
                },
            },
        ]);
        console.log("✅ Seed schedules thành công!");

        // ================= MESSAGES =================
        await Message.deleteMany();
        await Message.insertMany([
            {
                patientId: patients[0]._id,
                doctorId: doctors[0]._id,
                message: "Bác sĩ ơi, tôi bị đau đầu liên tục.",
            },
            {
                patientId: patients[0]._id,
                doctorId: doctors[0]._id,
                message: "Bạn nên nghỉ ngơi và uống nhiều nước.",
            },
        ]);
        console.log("✅ Seed messages thành công!");

        // ================= CHỈ SỐ =================
        await ChiSo.deleteMany();
        await ChiSo.insertMany([
            {
                chi_so_DH_no: "5.6",
                chi_so_DH_doi: "7.2",
            },
        ]);
        console.log("✅ Seed chỉ số thành công!");

        // ================= WORK SHIFTS =================
        await WorkShift.deleteMany();
        await WorkShift.insertMany([
            {
                doctorId: doctors[0]._id,
                date: "2025-08-21",
                start: "13:00",
                end: "17:00",
                attendance: {
                    checkedIn: false,
                    checkInMethod: "",
                    checkInTime: "",
                },
            },
        ]);
        console.log("✅ Seed work shifts thành công!");

        // ================= MEDICINES =================
        await Medicine.deleteMany();
        await Medicine.insertMany([
            {
                name: "Paracetamol",
                time: new Date("2025-08-17T08:00:00"),
                lieu_luong: 500,
                status: "Đã uống",
            },
            {
                name: "Metformin",
                time: new Date("2025-08-17T20:00:00"),
                lieu_luong: 850,
                status: "Chưa uống",
            },
        ]);
        console.log("✅ Seed medicines thành công!");

        // ================= FOODS =================
        await Food.deleteMany();
        const foods = await Food.insertMany([
            {
                name: "Cơm gạo lứt",
                weight: 200,
                image: "https://example.com/com-gao-lut.jpg",
                calo: 250,
                chat_dam: 5,
                duong_bot: 50,
                chat_beo: 2,
            },
            {
                name: "Ức gà",
                weight: 150,
                image: "https://example.com/uc-ga.jpg",
                calo: 165,
                chat_dam: 31,
                duong_bot: 0,
                chat_beo: 3.6,
            },
        ]);
        console.log("✅ Seed foods thành công!");

        // ================= MENU FOODS =================
        await MenuFood.deleteMany();
        await MenuFood.insertMany([
            {
                title: "Thực đơn buổi sáng",
                description: "Yến mạch, sữa tươi và trái cây.",
                image: "https://example.com/breakfast.jpg",
                date: new Date("2025-08-17"),
            },
            {
                title: "Thực đơn buổi trưa",
                description: "Cơm gạo lứt, ức gà áp chảo và salad rau xanh.",
                image: "https://example.com/lunch.jpg",
                date: new Date("2025-08-17"),
            },
        ]);
        console.log("✅ Seed menu foods thành công!");

    } catch (err) {
        console.error("❌ Lỗi khi seed dữ liệu:", err);
    } finally {
        mongoose.connection.close();
    }
};

seedAll();
