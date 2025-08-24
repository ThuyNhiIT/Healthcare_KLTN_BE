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
                uid: "",
                email: "nguyenvana@example.com",
                phone: "0909123456",
                username: "nguyenvana",
                password: "123456", // sau này nên mã hoá bcrypt
                address: "Hà Nội",
                gender: "Nam",
                dob: new Date("2003-01-18T23:00:00.109Z"), // ISO string
                role: "patient",
                avatar: "",
            },
            {
                uid: "",
                email: "nguyenvanb@example.com",
                phone: "0909123457",
                username: "nguyenvanb",
                password: "123456", // sau này nên mã hoá bcrypt
                address: "Hà Nội",
                gender: "Nam",
                dob: new Date("2003-01-18T23:00:00.109Z"), // ISO string
                role: "patient",
                avatar: "",
            },
            {
                uid: "",
                email: "nguyenvanc@example.com",
                phone: "0909123458",
                username: "nguyenvanc",
                password: "123456", // sau này nên mã hoá bcrypt
                address: "Hà Nội",
                gender: "Nam",
                dob: new Date("2003-01-18T23:00:00.109Z"), // ISO string
                role: "patient",
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
