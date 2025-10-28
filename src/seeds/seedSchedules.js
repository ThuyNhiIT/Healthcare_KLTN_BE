const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Schedule = require("../models/Schedule");

dotenv.config();

// Kết nối MongoDB từ .env
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));

const seedSchedules = async () => {
    try {
        // Xoá dữ liệu cũ
        await Schedule.deleteMany();

        // Dữ liệu mẫu
        const schedules = [
            {
                doctorId: new mongoose.Types.ObjectId(), // TODO: thay bằng Doctor thực tế
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
            {
                doctorId: new mongoose.Types.ObjectId(),
                date: new Date("2025-08-21"),
                start: "13:00",
                end: "17:00",
                shiftType: "afternoon",
                attendance: {
                    checkedIn: false,
                    checkInMethod: null,
                    checkInTime: null,
                },
            },
            {
                doctorId: new mongoose.Types.ObjectId(),
                date: new Date("2025-08-22"),
                start: "18:00",
                end: "21:00",
                shiftType: "evening",
                attendance: {
                    checkedIn: true,
                    checkInMethod: "webcam",
                    checkInTime: "18:10",
                },
            },
        ];

        await Schedule.insertMany(schedules);
        console.log("✅ Seed schedules thành công!");
    } catch (err) {
        console.error("❌ Lỗi khi seed schedules:", err);
    } finally {
        mongoose.connection.close();
    }
};

seedSchedules();
