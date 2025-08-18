const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Message = require("../models/Message");

dotenv.config(); // load .env

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));

const seedMessages = async () => {
    try {
        // Xoá dữ liệu cũ
        await Message.deleteMany();

        // Dữ liệu mẫu
        const messages = [
            {
                patientId: new mongoose.Types.ObjectId(), // giả lập patientId
                doctorId: new mongoose.Types.ObjectId(),  // giả lập doctorId
                message: "Chào bác sĩ, tôi bị đau đầu mấy hôm nay.",
                time: new Date("2025-08-15T10:00:00"),
            },
            {
                patientId: new mongoose.Types.ObjectId(),
                doctorId: new mongoose.Types.ObjectId(),
                message: "Bạn đã dùng thuốc gì chưa?",
                time: new Date("2025-08-15T10:05:00"),
            },
            {
                patientId: new mongoose.Types.ObjectId(),
                doctorId: new mongoose.Types.ObjectId(),
                message: "Tôi có uống paracetamol nhưng không đỡ.",
                time: new Date("2025-08-15T10:10:00"),
            },
        ];

        await Message.insertMany(messages);
        console.log("✅ Seed messages thành công!");
    } catch (err) {
        console.error("❌ Lỗi khi seed messages:", err);
    } finally {
        mongoose.connection.close();
    }
};

seedMessages();
