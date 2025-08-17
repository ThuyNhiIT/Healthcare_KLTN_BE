const mongoose = require("mongoose");

const chiSoSchema = new mongoose.Schema(
    {
        chi_so_DH_no: {
            type: String, // Chỉ số đường huyết lúc đói
            required: true,
        },
        chi_so_DH_doi: {
            type: String, // Chỉ số đường huyết sau ăn
            required: true,
        },
    },
    { timestamps: true }
);

const ChiSo = mongoose.model("ChiSo", chiSoSchema);

module.exports = ChiSo;
