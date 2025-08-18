const mongoose = require("mongoose");
const dotenv = require("dotenv");
const ChiSo = require("../models/ChiSo");

dotenv.config(); // load biến môi trường từ .env

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));

const seedChiSo = async () => {
    try {
        // Xoá dữ liệu cũ
        await ChiSo.deleteMany();

        // Dữ liệu mẫu
        const chiSos = [
            {
                chi_so_DH_no: "70 - 99 mg/dL",
                chi_so_DH_doi: "< 140 mg/dL",
            },
            {
                chi_so_DH_no: "100 - 125 mg/dL",
                chi_so_DH_doi: "140 - 199 mg/dL",
            },
            {
                chi_so_DH_no: ">= 126 mg/dL",
                chi_so_DH_doi: ">= 200 mg/dL",
            },
        ];

        await ChiSo.insertMany(chiSos);
        console.log("✅ Seed chi_so thành công!");
    } catch (err) {
        console.error("❌ Lỗi khi seed chi_so:", err);
    } finally {
        mongoose.connection.close();
    }
};

seedChiSo();
