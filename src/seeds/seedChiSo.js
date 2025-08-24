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
                chi_so_DH_no: 5.1,
                chi_so_DH_doi: 0,
                time: new Date()
            },
            {
                chi_so_DH_no: 5.3,
                chi_so_DH_doi: 0,
                time: new Date()
            },
            {
                chi_so_DH_no: 5.0,
                chi_so_DH_doi: 0,
                time: new Date()
            }, 
            {
                chi_so_DH_no: 5.4,
                chi_so_DH_doi: 0,
                time: new Date()
            }, 
            {
                chi_so_DH_no: 5.1,
                chi_so_DH_doi: 0,
                time: new Date()
            }, 
            {
                chi_so_DH_no: 5.2,
                chi_so_DH_doi: 0,
                time: new Date()
            },

            {
                chi_so_DH_no: 0,
                chi_so_DH_doi: 6.8,
                time: new Date()
            },
            {
                chi_so_DH_no: 0,
                chi_so_DH_doi: 7.1,
                time: new Date()
            },
            {
                chi_so_DH_no: 0,
                chi_so_DH_doi: 7.4,
                time: new Date()
            },
            {
                chi_so_DH_no: 0,
                chi_so_DH_doi: 7.0,
                time: new Date()
            },
            {
                chi_so_DH_no: 0,
                chi_so_DH_doi: 7.2,
                time: new Date()
            },
            {
                chi_so_DH_no: 0,
                chi_so_DH_doi: 7.5,
                time: new Date()
            },
            {
                chi_so_DH_no: 0,
                chi_so_DH_doi: 7.1,
                time: new Date()
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
