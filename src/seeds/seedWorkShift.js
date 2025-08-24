const mongoose = require("mongoose");
const dotenv = require("dotenv");
const WorkShift = require("../models/WorkShift");

dotenv.config();

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));

const seedWorkShifts = async () => {
    try {
        // Xoá dữ liệu cũ
        await WorkShift.deleteMany();

        // Dữ liệu mẫu
        const workShifts = [
            {
                doctorId: new mongoose.Types.ObjectId(),
                date: new Date("2025-08-17"),
                start: "08:00",
                end: "12:00",
                attendance: {
                    checkedIn: true,
                    checkInMethod: "QR",
                    checkInTime: "08:05",
                    checkedOut: true,
                    checkOutTime: "12:05",
                },
            },
            {
                doctorId: new mongoose.Types.ObjectId(),
                date: new Date("2025-08-17"),
                start: "13:00",
                end: "17:00",
                attendance: {
                    checkedIn: true,
                    checkInMethod: "webcam",
                    checkInTime: "13:10",
                    checkedOut: false,
                    checkOutTime: null,
                },
            },
            {
                doctorId: doctor2,
                date: new Date("2025-08-18"),
                start: "08:00",
                end: "17:00",
                attendance: {
                    checkedIn: false,
                    checkInMethod: null,
                    checkInTime: null,
                    checkedOut: false,
                    checkOutTime: null,
                },
            },
            {
                doctorId: doctor2,
                date: new Date("2025-08-19"),
                start: "08:00",
                end: "12:00",
                attendance: {
                    checkedIn: true,
                    checkInMethod: "QR",
                    checkInTime: "08:03",
                    checkedOut: true,
                    checkOutTime: "12:00",
                },
            },
        ];

        await WorkShift.insertMany(workShifts);
        console.log("✅ Seed workShifts thành công!");
    } catch (err) {
        console.error("❌ Lỗi khi seed workShifts:", err);
    } finally {
        mongoose.connection.close();
    }
};

seedWorkShifts();
