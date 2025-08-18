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
        title: "Thực đơn buổi sáng",
        description:
          "Một bữa sáng lành mạnh với yến mạch, sữa tươi và trái cây.",
        image: "https://example.com/breakfast.jpg",
        date: new Date("2025-08-17"),
        caloMax: 1400,
        caloMin: 1200,
        caloCurrent: 1300,
        userId: new mongoose.Types.ObjectId(),
      },
      {
        title: "Thực đơn buổi trưa",
        description: "Cơm gạo lứt, ức gà áp chảo và salad rau xanh.",
        image: "https://example.com/lunch.jpg",
        date: new Date("2025-08-17"),
        caloMax: 1600,
        caloMin: 1400,
        caloCurrent: 1450,
        userId: new mongoose.Types.ObjectId(),
      },
      {
        title: "Thực đơn buổi tối",
        description: "Cá hồi nướng, khoai lang và súp lơ hấp.",
        image: "https://example.com/dinner.jpg",
        date: new Date("2025-08-17"),
        caloMax: 1800,
        caloMin: 1600,
        caloCurrent: 1700,
        userId: new mongoose.Types.ObjectId(),
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
