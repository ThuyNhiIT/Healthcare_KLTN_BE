const mongoose = require("mongoose");

const menuFoodSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true, // Tên thực đơn
            trim: true,
        },
        description: {
            type: String, // mô tả ngắn
            required: false,
        },
        image: {
            type: String, // link ảnh minh họa
            required: false,
        },
        date: {
            type: Date, // ngày áp dụng thực đơn
            required: true,
            default: Date.now,
        },
    },
    { timestamps: true }
);

const MenuFood = mongoose.model("MenuFood", menuFoodSchema);

module.exports = MenuFood;
