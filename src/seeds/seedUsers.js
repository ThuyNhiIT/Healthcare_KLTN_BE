const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/User");

dotenv.config();

// Kết nối MongoDB từ .env
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));

const seedUsers = async () => {
    try {
        // Xoá dữ liệu cũ
        await User.deleteMany();

        // Dữ liệu mẫu
        const users = [
            {
                uid: "U001",
                email: "nguyenvana@example.com",
                phone: "0909123456",
                username: "nguyenvana",
                password: "123456", // sau này nên mã hoá bcrypt
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
        ];

        await User.insertMany(users);
        console.log("✅ Seed users thành công!");
    } catch (err) {
        console.error("❌ Lỗi khi seed users:", err);
    } finally {
        mongoose.connection.close();
    }
};

seedUsers();
