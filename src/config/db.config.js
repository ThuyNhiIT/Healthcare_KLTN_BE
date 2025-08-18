const mongoose = require("mongoose");
const Food = require("../models/Food");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Atlas connected");

    ///////////////// tạo food /////////////////
    const sampleFoods = [
      {
        name: "Ức gà luộc",
        weight: 100, // gram
        image: "https://example.com/chicken-breast.jpg",
        calo: 165,
        chatDam: 31,
        DuongBot: 0,
        ChatBeo: 3.6,
      },
      {
        name: "Cơm trắng",
        weight: 150,
        image: "https://example.com/white-rice.jpg",
        calo: 200,
        chatDam: 4,
        DuongBot: 45,
        ChatBeo: 0.5,
      },
      {
        name: "Bông cải xanh hấp",
        weight: 100,
        image: "https://example.com/broccoli.jpg",
        calo: 34,
        chatDam: 2.8,
        DuongBot: 7,
        ChatBeo: 0.4,
      },
      {
        name: "Trứng gà luộc",
        weight: 60,
        image: "https://example.com/boiled-egg.jpg",
        calo: 90,
        chatDam: 7,
        DuongBot: 1,
        ChatBeo: 6.7,
      },
      {
        name: "Táo đỏ",
        weight: 120,
        image: "https://example.com/apple.jpg",
        calo: 52,
        chatDam: 0.3,
        DuongBot: 14,
        ChatBeo: 0.2,
      },
    ];

    // Food.insertMany(sampleFoods);

  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
