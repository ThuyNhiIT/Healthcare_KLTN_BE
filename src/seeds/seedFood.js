const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Food = require("../models/Food");

dotenv.config();

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));

const seedFoods = async () => {
    try {
        // Xoá dữ liệu cũ
        await Food.deleteMany();

        // Dữ liệu mẫu
        const foods = [
            {
                name: "Cơm trắng",
                weight: 100,
                image: "https://example.com/com-trang.jpg",
                calo: 130,
                chat_dam: 2.7,
                duong_bot: 28,
                chat_beo: 0.3,
            },
            {
                name: "Ức gà luộc",
                weight: 100,
                image: "https://example.com/uc-ga.jpg",
                calo: 165,
                chat_dam: 31,
                duong_bot: 0,
                chat_beo: 3.6,
            },
            {
                name: "Táo",
                weight: 150,
                image: "https://example.com/tao.jpg",
                calo: 80,
                chat_dam: 0.3,
                duong_bot: 22,
                chat_beo: 0.2,
            },
        ];

        await Food.insertMany(foods);
        console.log("✅ Seed foods thành công!");
    } catch (err) {
        console.error("❌ Lỗi khi seed foods:", err);
    } finally {
        mongoose.connection.close();
    }
};

seedFoods();
