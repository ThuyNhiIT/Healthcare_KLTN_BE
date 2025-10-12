const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Food = require("../models/Food");

dotenv.config();

// Kết nối MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
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
    const foods = [];

    await Food.insertMany(foods);
    console.log("✅ Seed foods thành công!");
  } catch (err) {
    console.error("❌ Lỗi khi seed foods:", err);
  } finally {
    mongoose.connection.close();
  }
};

seedFoods();
