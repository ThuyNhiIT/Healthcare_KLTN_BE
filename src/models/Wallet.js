const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        balance: {
            type: Number,
            required: true,
            default: 0,
        },
        history: [{
            amount: { type: Number, required: true },
            createdAt: { type: Date, default: Date.now }
        }]
    },
    { timestamps: true }
);

const Wallet = mongoose.model("Wallet", walletSchema);

module.exports = Wallet;