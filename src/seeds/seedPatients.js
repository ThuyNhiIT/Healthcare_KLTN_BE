const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Patient = require("../models/Patient");

dotenv.config(); // load .env

// Kết nối MongoDB bằng MONGO_URI từ .env
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));

const seedPatients = async () => {
    try {
        // Xoá dữ liệu cũ
        await Patient.deleteMany();

        // Dữ liệu mẫu
        const patients = [
            {
                userId: new mongoose.Types.ObjectId(),
                name: "Nguyễn Văn A",
                age: 45,
                insuranceId: "BHYT123456",
                disease: "Tiểu đường",
                status: "Cần theo dõi",
                phone: "0909123456",
                email: "nguyenvana@example.com",
                address: "Hà Nội",
                bloodType: "O",
                allergies: "Không",
                emergencyContact: "Trần Thị B",
                notes: "Cần theo dõi huyết áp định kỳ",
                healthRecords: [
                    {
                        date: new Date("2025-08-01"),
                        bloodPressure: "140/90",
                        heartRate: 80,
                        bloodSugar: 7.5,
                    },
                ],
            },
            {
                userId: new mongoose.Types.ObjectId(),
                name: "Lê Thị C",
                age: 32,
                insuranceId: "BHYT654321",
                disease: "Huyết áp cao",
                status: "Ổn định",
                phone: "0912345678",
                email: "lethic@example.com",
                address: "TP. Hồ Chí Minh",
                bloodType: "A",
                allergies: "Hải sản",
                emergencyContact: "Nguyễn Văn D",
                healthRecords: [
                    {
                        date: new Date("2025-08-10"),
                        bloodPressure: "150/95",
                        heartRate: 85,
                    },
                ],
            },
        ];

        await Patient.insertMany(patients);
        console.log("✅ Seed patients thành công!");
    } catch (err) {
        console.error("❌ Lỗi khi seed patients:", err);
    } finally {
        mongoose.connection.close();
    }
};

seedPatients();
