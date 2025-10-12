const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true, // Người dùng tạo món ăn này
        },
        name: {
            type: String,
            required: true, // Tên món ăn / thực phẩm
            trim: true,
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
        idx: {
            type: Number,
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
        weight: {
            type: Number, // khối lượng (gam)
            required: true,
            min: 0,
        },
        checked: {
            type: Boolean, // có được chọn trong thực đơn hay không
            default: false,
        },
    },
    { timestamps: true }
);

const Food = mongoose.model("Food", foodSchema);

module.exports = Food;
