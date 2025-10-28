const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Payment = require("../models/Payment");

dotenv.config();

// Kết nối MongoDB bằng biến môi trường
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));

const seedPayments = async () => {
    try {
        // Xoá dữ liệu cũ
        await Payment.deleteMany();

        // Dữ liệu mẫu
        const payments = [
            {
                patientId: new mongoose.Types.ObjectId(), // sau này thay = _id thực của Patient
                doctorId: new mongoose.Types.ObjectId(),  // sau này thay = _id thực của Doctor
                method: "MoMo",
                amount: 500000,
                timestamp: new Date("2025-08-10T10:30:00"),
                status: "success",
            },
            {
                patientId: new mongoose.Types.ObjectId(),
                doctorId: new mongoose.Types.ObjectId(),
                method: "VNPay",
                amount: 300000,
                timestamp: new Date("2025-08-12T15:45:00"),
                status: "failed",
            },
            {
                patientId: new mongoose.Types.ObjectId(),
                doctorId: new mongoose.Types.ObjectId(),
                method: "MoMo",
                amount: 700000,
                timestamp: new Date("2025-08-14T09:15:00"),
                status: "success",
            },
        ];

        await Payment.insertMany(payments);
        console.log("✅ Seed payments thành công!");
    } catch (err) {
        console.error("❌ Lỗi khi seed payments:", err);
    } finally {
        mongoose.connection.close();
    }
};

seedPayments();
