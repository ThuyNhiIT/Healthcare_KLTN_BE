const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Medicine = require("../models/Medicine");

dotenv.config();

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));

const seedMedicines = async () => {
    try {
        // Xoá dữ liệu cũ
        await Medicine.deleteMany();

        // Dữ liệu mẫu
        const medicines = [
            {
                name: "Paracetamol",
                time: new Date("2025-08-17T08:00:00"),
                lieu_luong: 500, // mg
                status: "đã uống",
            },
            {
                name: "Amoxicillin",
                time: new Date("2025-08-17T12:00:00"),
                lieu_luong: 250,
                status: "chưa uống",
            },
            {
                name: "Vitamin C",
                time: new Date("2025-08-17T18:00:00"),
                lieu_luong: 1000,
                status: "bỏ lỡ",
            },
        ];

        await Medicine.insertMany(medicines);
        console.log("✅ Seed medicines thành công!");
    } catch (err) {
        console.error("❌ Lỗi khi seed medicines:", err);
    } finally {
        mongoose.connection.close();
    }
};

seedMedicines();
