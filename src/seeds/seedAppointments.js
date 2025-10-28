const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Appointment = require("../models/Appointment");

dotenv.config();

// Kết nối MongoDB từ .env
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));

const seedAppointments = async () => {
    try {
        // Xóa dữ liệu cũ
        await Appointment.deleteMany();

        // Dữ liệu mẫu
        // const appointments = [
        //     {
        //         patientId: new mongoose.Types.ObjectId(), // sau này thay = Patient thật
        //         doctorId: new mongoose.Types.ObjectId(),  // sau này thay = Doctor thật
        //         date: new Date("2025-08-20"),
        //         time: "09:00",
        //         type: "Khám mới",
        //         reason: "Đau đầu thường xuyên",
        //         notes: "Cần kiểm tra thêm xét nghiệm máu",
        //         status: "Đã xác nhận",
        //     },
        //     {
        //         patientId: new mongoose.Types.ObjectId(),
        //         doctorId: new mongoose.Types.ObjectId(),
        //         date: new Date("2025-08-21"),
        //         time: "14:30",
        //         type: "Tái khám",
        //         reason: "Theo dõi tiểu đường",
        //         notes: "",
        //         status: "Chờ xác nhận",
        //     },
        //     {
        //         patientId: new mongoose.Types.ObjectId(),
        //         doctorId: new mongoose.Types.ObjectId(),
        //         date: new Date("2025-08-22"),
        //         time: "10:15",
        //         type: "Tư vấn",
        //         reason: "Tư vấn chế độ dinh dưỡng",
        //         notes: "Đặt lịch qua app",
        //         status: "Hoàn thành",
        //     },
        // ];

        // await Appointment.insertMany(appointments);
        console.log("✅ Seed appointments thành công!");
    } catch (err) {
        console.error("❌ Lỗi khi seed appointments:", err);
    } finally {
        mongoose.connection.close();
    }
};

seedAppointments();
