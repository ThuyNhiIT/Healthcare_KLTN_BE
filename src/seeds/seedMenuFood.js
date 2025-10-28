const mongoose = require("mongoose");
const dotenv = require("dotenv");
const MenuFood = require("../models/MenuFood");

dotenv.config();

// Kết nối MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const seedMenuFoods = async () => {
  try {
    // Xoá dữ liệu cũ
    await MenuFood.deleteMany();

    // Dữ liệu mẫu
    const menuFoods = [
      {
        title: "Giảm cân nhanh",
        description:
          "Người cần giảm cân nhanh, béo phì mức nặng, ít vận động",
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
        date: new Date("2025-08-17"),
        caloMin: 1200,
        caloMax: 1400,
        caloCurrent: 1300,
        userId: [new mongoose.Types.ObjectId()],
      },
      {
        title: "Thừa cân",
        description: "Người thừa cân, vận động nhẹ",
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
        date: new Date("2025-08-17"),
        caloMin: 1400,
        caloMax: 1600,
        caloCurrent: 1450,
        userId: [new mongoose.Types.ObjectId()],
      },
      {
        title: "Cân nặng TB",
        description: "Người cân nặng trung bình, vận động nhẹ–trung bình",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
        date: new Date("2025-08-17"),
        caloMin: 1600,
        caloMax: 1800,
        caloCurrent: 1700,
        userId: [new mongoose.Types.ObjectId()],
      },
      {
        title: "Nam hoạt động nhiều",
        description: "Nam giới hoạt động nhiều hoặc người gầy cần giữ cân",
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
        date: new Date("2025-08-17"),
        caloMin: 1800,
        caloMax: 2000,
        caloCurrent: 1830,
        userId: [new mongoose.Types.ObjectId()],
      },
       {
        title: "Vận động nặng",
        description: "Trường hợp vận động thể lực nặng, lao động tay chân",
        image: "https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83",
        date: new Date("2025-08-17"),
        caloMin: 2000,
        caloMax: 3000,
        caloCurrent: 2100,
        userId: [new mongoose.Types.ObjectId()],
      },
    ];

    await MenuFood.insertMany(menuFoods);
    console.log("✅ Seed menuFoods thành công!");
  } catch (err) {
    console.error("❌ Lỗi khi seed menuFoods:", err);
  } finally {
    mongoose.connection.close();
  }
};

seedMenuFoods();
