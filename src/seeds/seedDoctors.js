const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Doctor = require("../models/Doctor");

dotenv.config(); // load .env

// Kết nối MongoDB bằng biến môi trường
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));

const seedDoctors = async () => {
    try {
        // Xoá dữ liệu cũ
        await Doctor.deleteMany();

        // Dữ liệu mẫu
        const doctors = [
            {
                userId: new mongoose.Types.ObjectId(), // giả lập userId, sau này bạn có thể thay = User thực
                status: "on",
                exp: 10,
                giay_phep: "GP123456",
                hospital: "Bệnh viện Bạch Mai",
                specialty: "Nội khoa",
            },
            {
                userId: new mongoose.Types.ObjectId(),
                status: "off",
                exp: 5,
                giay_phep: "GP654321",
                hospital: "Bệnh viện Chợ Rẫy",
                specialty: "Nội khoa",
            },
            {
                userId: new mongoose.Types.ObjectId(),
                status: "on",
                exp: 15,
                giay_phep: "GP789012",
                hospital: "Bệnh viện Trung ương Huế",
                specialty: "Nội khoa",
            },
        ];

        await Doctor.insertMany(doctors);
        console.log("✅ Seed doctors thành công!");
    } catch (err) {
        console.error("❌ Lỗi khi seed doctors:", err);
    } finally {
        mongoose.connection.close();
    }
};

seedDoctors();
