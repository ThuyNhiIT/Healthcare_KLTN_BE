// import crypto from "crypto";
// import axios from "axios";

// app.post("/api/momo", async (req, res) => {
//   const { amount, orderId } = req.body;

//   const partnerCode = "MOMOXXXX";
//   const accessKey = "accessKeyXXXX";
//   const secretKey = "secretKeyXXXX";
//   const redirectUrl = "https://yourapp.com/return"; 
//   const ipnUrl = "https://yourapp.com/ipn"; // server nhận callback

//   const requestId = orderId + Date.now();
//   const orderInfo = "Thanh toán đơn hàng #" + orderId;

//   const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=captureWallet`;

//   const signature = crypto
//     .createHmac("sha256", secretKey)
//     .update(rawSignature)
//     .digest("hex");

//   const requestBody = {
//     partnerCode,
//     accessKey,
//     requestId,
//     amount,
//     orderId,
//     orderInfo,
//     redirectUrl,
//     ipnUrl,
//     extraData: "",
//     requestType: "captureWallet",
//     signature,
//     lang: "vi",
//   };

//   try {
//     const momoRes = await axios.post(
//       "https://test-payment.momo.vn/v2/gateway/api/create",
//       requestBody
//     );
//     res.json(momoRes.data);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("MoMo error");
//   }
// });

const express = require('express');
const crypto = require('crypto');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Cấu hình MoMo (thay thế bằng thông tin thực tế từ MoMo)
const MOMO_CONFIG = {
  partnerCode: process.env.MOMO_PARTNER_CODE || 'MOMOBKUN20180529',
  accessKey: process.env.MOMO_ACCESS_KEY || 'klm05TvNBzhg7h7j',
  secretKey: process.env.MOMO_SECRET_KEY || 'at67qH6mk8w5Y1nAyMoYKMWACiEi2bsa',
  endpoint: 'https://test-payment.momo.vn/v2/gateway/api/create',
  redirectUrl: process.env.REDIRECT_URL || 'http://localhost:3000/payment/result',
  ipnUrl: process.env.IPN_URL || 'http://localhost:5000/api/momo/callback'
};

// Tạo chữ ký HMAC SHA256
function createSignature(rawData, secretKey) {
  return crypto.createHmac('sha256', secretKey).update(rawData).digest('hex');
}

// API tạo thanh toán MoMo
app.post('/api/momo/create-payment', async (req, res) => {
  try {
    const { amount, orderInfo, orderId, extraData = '' } = req.body;

    // Validate input
    if (!amount || !orderInfo || !orderId) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin bắt buộc: amount, orderInfo, orderId'
      });
    }

    const requestId = orderId + new Date().getTime();
    const requestType = 'captureWallet';
    const lang = 'vi';

    // Tạo raw signature
    const rawSignature = `accessKey=${MOMO_CONFIG.accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${MOMO_CONFIG.ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${MOMO_CONFIG.partnerCode}&redirectUrl=${MOMO_CONFIG.redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

    // Tạo chữ ký
    const signature = createSignature(rawSignature, MOMO_CONFIG.secretKey);

    // Request body gửi đến MoMo
    const requestBody = {
      partnerCode: MOMO_CONFIG.partnerCode,
      partnerName: 'Test',
      storeId: 'MomoTestStore',
      requestId: requestId,
      amount: amount,
      orderId: orderId,
      orderInfo: orderInfo,
      redirectUrl: MOMO_CONFIG.redirectUrl,
      ipnUrl: MOMO_CONFIG.ipnUrl,
      lang: lang,
      requestType: requestType,
      autoCapture: true,
      extraData: extraData,
      signature: signature
    };

    console.log('MoMo Request:', requestBody);

    // Gửi request đến MoMo
    const response = await axios.post(MOMO_CONFIG.endpoint, requestBody);
    
    console.log('MoMo Response:', response.data);

    if (response.data.resultCode === 0) {
      res.json({
        success: true,
        payUrl: response.data.payUrl,
        qrCodeUrl: response.data.qrCodeUrl,
        orderId: orderId,
        requestId: requestId
      });
    } else {
      res.status(400).json({
        success: false,
        message: response.data.message || 'Lỗi tạo thanh toán',
        resultCode: response.data.resultCode
      });
    }

  } catch (error) {
    console.error('Error creating MoMo payment:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi tạo thanh toán',
      error: error.message
    });
  }
});

// API xử lý callback từ MoMo (IPN)
app.post('/api/momo/callback', (req, res) => {
  try {
    console.log('MoMo Callback:', req.body);
    
    const {
      partnerCode,
      orderId,
      requestId,
      amount,
      orderInfo,
      orderType,
      transId,
      resultCode,
      message,
      payType,
      responseTime,
      extraData,
      signature
    } = req.body;

    // Verify signature
    const rawSignature = `accessKey=${MOMO_CONFIG.accessKey}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;
    
    const expectedSignature = createSignature(rawSignature, MOMO_CONFIG.secretKey);

    if (signature !== expectedSignature) {
      console.error('Invalid signature');
      return res.status(400).json({ message: 'Invalid signature' });
    }

    // Xử lý kết quả thanh toán
    if (resultCode === 0) {
      console.log(`Thanh toán thành công cho đơn hàng ${orderId}`);
      // Cập nhật database, gửi email xác nhận, etc.
    } else {
      console.log(`Thanh toán thất bại cho đơn hàng ${orderId}: ${message}`);
      // Xử lý thanh toán thất bại
    }

    // Phản hồi cho MoMo
    res.json({ message: 'OK' });

  } catch (error) {
    console.error('Error processing MoMo callback:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// API kiểm tra trạng thái thanh toán
app.get('/api/momo/check-status/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    
    // Thực tế bạn sẽ query từ database
    // Ở đây chỉ là ví dụ
    res.json({
      success: true,
      orderId: orderId,
      status: 'pending', // pending, success, failed
      message: 'Đang chờ thanh toán'
    });

  } catch (error) {
    console.error('Error checking payment status:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi kiểm tra trạng thái thanh toán'
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server đang chạy trên port ${PORT}`);
});

module.exports = app;