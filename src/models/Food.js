const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true, // Tên món ăn / thực phẩm
            trim: true,
        },
        weight: {
            type: Number, // khối lượng (gam)
            required: true,
            min: 0,
        },
        image: {
            type: String, // link ảnh minh họa
            required: false,
        },
        calo: {
            type: Number, // năng lượng (kcal)
            required: true,
            min: 0,
        },
        chat_dam: {
            type: Number, // protein (g)
            required: true,
            min: 0,
        },
        duong_bot: {
            type: Number, // carbohydrate (g)
            required: true,
            min: 0,
        },
        chat_beo: {
            type: Number, // fat (g)
            required: true,
            min: 0,
        },
    },
    { timestamps: true }
);

const Food = mongoose.model("Food", foodSchema);

module.exports = Food;
