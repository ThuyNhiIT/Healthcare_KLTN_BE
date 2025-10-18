const mongoose = require("mongoose");
const dotenv = require("dotenv");
const ChiSo = require("../models/ChiSo");

dotenv.config();

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const seedChiSo = async () => {
  try {
    await ChiSo.deleteMany();

    const today = new Date();
    const chiSos = [];
    
    // Tạo một số userId mẫu (có thể thay đổi theo nhu cầu)
    const sampleUserIds = [
      new mongoose.Types.ObjectId('67df6aa5d31c7e1cbb2b7df2'),
    ];

    // 7 ngày gần nhất
    for (let d = 0; d < 7; d++) {
      const baseDate = new Date(today);
      baseDate.setDate(today.getDate() - d);

      // 3 lần đo fasting (lúc đói)
      for (let i = 0; i < 3; i++) {
        const time = new Date(baseDate);
        time.setHours(6 + i * 5, 0, 0); // ví dụ 6h, 11h, 16h

        chiSos.push({
          userId: sampleUserIds[Math.floor(Math.random() * sampleUserIds.length)], // Gán ngẫu nhiên userId
          value: (4.8 + Math.random() * 1.0).toFixed(1), // 4.8 - 5.8 mmol/L
          type: "fasting",
          time
        });
      }

      // 3 lần đo sau ăn (postMeal)
      for (let i = 0; i < 3; i++) {
        const time = new Date(baseDate);
        time.setHours(8 + i * 5, 30, 0); // ví dụ 8h30, 13h30, 18h30

        chiSos.push({
          userId: sampleUserIds[Math.floor(Math.random() * sampleUserIds.length)], // Gán ngẫu nhiên userId
          value: (6.5 + Math.random() * 1.5).toFixed(1), // 6.5 - 8.0 mmol/L
          type: "postMeal",
          time
        });
      }
    }

    await ChiSo.insertMany(chiSos);
    console.log("✅ Seed chi_so thành công!");
  } catch (err) {
    console.error("❌ Lỗi khi seed chi_so:", err);
  } finally {
    mongoose.connection.close();
  }
};

seedChiSo();
