const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
    {
        patientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient",
            required: true,
        },
        doctorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Doctor",
            required: true,
        },
        method: {
            type: String,
            enum: ["MoMo", "VNPay"],
            required: true,
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        timestamp: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: ["success", "failed"],
            required: true,
        },
    },
    { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
