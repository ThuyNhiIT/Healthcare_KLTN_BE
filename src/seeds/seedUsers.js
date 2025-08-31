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
                _id: { "$oid": "67df6aa5d31c7e1cbb2b7df2" },
                email: "nickname1801@gmail.com",
                phone: "0123456789",
                username: "Nguyen Minh Tien",
                password: "$2b$10$gnPi.RGJQdxcUNphO0eqy.esfic5Q6Ruv17MXW0jspinq.auWiiye",
                address: "12 Nguyen Van Bao, Go Vap, HCM",
                gender: "nam",
                dob: { "$date": { "$numberLong": "1042930800109" } },
                avatar: "https://upload-lab-iuh.s3.us-east-2.amazonaws.com/uploads/1744188034350_52a4bbd5b79120e384446cfaf8fa02cea783832f8e0f8c6432.image/jpeg",
                role: "patient",
                createdAt: { "$date": { "$numberLong": "1742695077243" } },
                updatedAt: { "$date": { "$numberLong": "1755326010048" } },
                __v: { "$numberInt": "1" },
                uid: "cq6SC0A1RZXdLwFE1TKGRJG8fgl2",
                captcha: ""
            },
            {
                _id: { "$oid": "67df6aa5d31c7e1cbb2b7df3" },
                email: "phamthithuynhiit@gmail.com",
                phone: "0123456781",
                username: "Pham Thi Thuy Nhi",
                password: "$2b$10$gnPi.RGJQdxcUNphO0eqy.esfic5Q6Ruv17MXW0jspinq.auWiiye",
                address: "12 Nguyen Van Bao, Go Vap, HCM",
                gender: "nữ",
                dob: { "$date": { "$numberLong": "1042930800109" } },
                avatar: "https://upload-lab-iuh.s3.us-east-2.amazonaws.com/uploads/1744188034350_52a4bbd5b79120e384446cfaf8fa02cea783832f8e0f8c6432.image/jpeg",
                role: "doctor",
                createdAt: { "$date": { "$numberLong": "1742695077243" } },
                updatedAt: { "$date": { "$numberLong": "1755326010048" } },
                __v: { "$numberInt": "1" },
                uid: "weHP9TWfdrZo5L9rmY81BRYxNXr2",
                captcha: ""
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
