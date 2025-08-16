const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Import Models
const User = require("../models/User");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");
const Appointment = require("../models/Appointment");
const Payment = require("../models/Payment");
const Schedule = require("../models/Schedule");

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
                avatar: "",
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
                avatar: "",
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
                avatar: "",
            },
        ]);
        console.log("✅ Seed users thành công!");

        // ================= DOCTORS =================
        await Doctor.deleteMany();
        await Doctor.insertMany([
            {
                userId: users[2]._id, // gắn với user bác sĩ
                status: "on",
                exp: 10,
                giay_phep: "GP123456",
                hospital: "Bệnh viện Bạch Mai",
            },
        ]);
        console.log("✅ Seed doctors thành công!");

        // ================= PATIENTS =================
        await Patient.deleteMany();
        await Patient.insertMany([
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
                patientId: new mongoose.Types.ObjectId(),
                doctorId: new mongoose.Types.ObjectId(),
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
                patientId: new mongoose.Types.ObjectId(),
                doctorId: new mongoose.Types.ObjectId(),
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
                doctorId: new mongoose.Types.ObjectId(),
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

    } catch (err) {
        console.error("❌ Lỗi khi seed dữ liệu:", err);
    } finally {
        mongoose.connection.close();
    }
};

seedAll();
