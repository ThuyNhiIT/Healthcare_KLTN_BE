// File: PayWithVnPayController.js
const crypto = require('crypto');
const moment = require('moment');
require('dotenv').config();

// VNPay Config - sandbox
const config = {
    vnp_TmnCode: process.env.VNP_TMNCODE, // Mã merchant
    vnp_HashSecret: process.env.VNP_HASHSECRET, // Secret key
    vnp_Url: process.env.VNP_URL,
    vnp_ReturnUrl: process.env.VNP_RETURNURL
};

// Hàm sort + encode theo spec VNPay
function sortObject(obj) {
    const sorted = {};
    const keys = Object.keys(obj).sort();
    keys.forEach(key => {
        const value = obj[key];
        if (value !== null && value !== undefined && value !== '') {
            // Encode & replace khoảng trắng bằng '+'
            sorted[key] = encodeURIComponent(value).replace(/%20/g, '+');
        }
    });
    return sorted;
}

// Lấy IP người dùng (IPv4)
function getIpAddress(req) {
    const forwarded = req.headers['x-forwarded-for'];
    const ip = forwarded ? forwarded.split(',')[0] : req.connection.remoteAddress;
    return ip && ip.includes('::ffff:') ? ip.split('::ffff:')[1] : ip || '127.0.0.1';
}

// Controller
const PayWithVnPayController = (app) => {

    // 1. Tạo payment URL
    app.post('/api/payment/create_payment_url', (req, res) => {
        try {
            const { amount, orderDescription, orderType, language, bankCode } = req.body;
            if (!amount || amount <= 0) {
                return res.status(400).json({ success: false, message: 'Số tiền không hợp lệ' });
            }

            const ipAddr = getIpAddress(req);
            const orderId = moment().format('YYYYMMDDHHmmss');
            const createDate = moment().format('YYYYMMDDHHmmss');
            const expireDate = moment().add(15, 'minutes').format('YYYYMMDDHHmmss');
            const vnpAmount = Math.floor(Number(amount) * 100); // VNPay tính bằng đơn vị nhỏ

            const vnp_Params = {
                vnp_Version: '2.1.0',
                vnp_Command: 'pay',
                vnp_TmnCode: config.vnp_TmnCode,
                vnp_Locale: language || 'vn',
                vnp_CurrCode: 'VND',
                vnp_TxnRef: orderId,
                vnp_OrderInfo: orderDescription || `Thanh toan don hang ${orderId}`,
                vnp_OrderType: orderType || 'other',
                vnp_Amount: vnpAmount,
                vnp_ReturnUrl: config.vnp_ReturnUrl,
                vnp_IpAddr: ipAddr,
                vnp_CreateDate: createDate,
                vnp_ExpireDate: expireDate
            };

            // Bank code optional
            if (bankCode && bankCode.trim() !== '') {
                const upperBankCode = bankCode.toUpperCase();
                const validBankCodes = [
                    'VIETCOMBANK', 'TECHCOMBANK', 'BIDV', 'VIETINBANK', 'AGRIBANK',
                    'ACB', 'SCB', 'SACOMBANK', 'TPBANK', 'VPBANK', 'HDBANK', 'DONGABANK', 'EXIMBANK', 'MSBANK'
                ];
                if (validBankCodes.includes(upperBankCode)) {
                    vnp_Params.vnp_BankCode = upperBankCode;
                }
            }

            // Sắp xếp + encode
            const sortedParams = sortObject(vnp_Params);

            // Tạo chữ ký HMAC SHA512
            const hashDataString = Object.keys(sortedParams).map(k => `${k}=${sortedParams[k]}`).join('&');
            const secureHash = crypto.createHmac('sha512', config.vnp_HashSecret)
                .update(hashDataString, 'utf8')
                .digest('hex');
            vnp_Params.vnp_SecureHash = secureHash;

            // Build URL
            const queryString = Object.keys(vnp_Params)
                .map(k => `${k}=${vnp_Params[k]}`)
                .join('&');
            const paymentUrl = `${config.vnp_Url}?${queryString}`;

            return res.json({ success: true, data: { paymentUrl, orderId } });

        } catch (error) {
            console.error('Create payment URL error:', error);
            return res.status(500).json({ success: false, message: 'Lỗi tạo URL thanh toán', error: error.message });
        }
    });

    // 2. VNPay return callback
    app.get('/api/payment/vnpay_return', (req, res) => {
        try {
            const vnp_Params = { ...req.query };
            const receivedHash = vnp_Params.vnp_SecureHash;

            delete vnp_Params.vnp_SecureHash;
            delete vnp_Params.vnp_SecureHashType;

            const sortedParams = sortObject(vnp_Params);
            const hashDataString = Object.keys(sortedParams).map(k => `${k}=${sortedParams[k]}`).join('&');
            const calculatedHash = crypto.createHmac('sha512', config.vnp_HashSecret)
                .update(hashDataString, 'utf8')
                .digest('hex');

            if (receivedHash === calculatedHash) {
                const orderId = vnp_Params.vnp_TxnRef;
                const responseCode = vnp_Params.vnp_ResponseCode;
                const amount = (parseInt(vnp_Params.vnp_Amount) / 100).toString();
                const paymentStatus = responseCode === '00' ? 'success' : 'failed';
                const message = getVNPayMessage(responseCode);

                const redirectUrl = `http://localhost:5173/payment?` + new URLSearchParams({
                    status: paymentStatus,
                    orderId,
                    amount,
                    message
                }).toString();

                return res.redirect(redirectUrl);
            } else {
                const errorUrl = `http://localhost:5173/payment?` + new URLSearchParams({
                    status: 'failed',
                    message: 'Chữ ký không hợp lệ'
                }).toString();
                return res.redirect(errorUrl);
            }

        } catch (error) {
            const errorUrl = `http://localhost:5173/payment?` + new URLSearchParams({
                status: 'failed',
                message: 'Lỗi xử lý kết quả thanh toán'
            }).toString();
            return res.redirect(errorUrl);
        }
    });

    // 3. IPN handler
    app.post('/api/payment/vnpay_ipn', (req, res) => {
        try {
            const vnp_Params = { ...req.query };
            const receivedHash = vnp_Params.vnp_SecureHash;

            delete vnp_Params.vnp_SecureHash;
            delete vnp_Params.vnp_SecureHashType;

            const sortedParams = sortObject(vnp_Params);
            const hashDataString = Object.keys(sortedParams).map(k => `${k}=${sortedParams[k]}`).join('&');
            const calculatedHash = crypto.createHmac('sha512', config.vnp_HashSecret)
                .update(hashDataString, 'utf8')
                .digest('hex');

            let returnCode = '97';
            if (receivedHash === calculatedHash) {
                returnCode = '00';
                // TODO: update database status
            }

            return res.status(200).json({ RspCode: returnCode, Message: returnCode === '00' ? 'Confirm Success' : 'Confirm Fail' });

        } catch (error) {
            return res.status(200).json({ RspCode: '99', Message: 'Unknown error' });
        }
    });

};

// Helper map VNPay response code → message
function getVNPayMessage(code) {
    const map = {
        '00': 'Giao dịch thành công',
        '07': 'Trừ tiền thành công. Giao dịch bị nghi ngờ',
        '09': 'Chưa đăng ký InternetBanking',
        '10': 'Xác thực thông tin không đúng quá 3 lần',
        '11': 'Đã hết hạn chờ thanh toán',
        '12': 'Tài khoản bị khóa',
        '13': 'Sai mật khẩu OTP',
        '24': 'Khách hàng hủy giao dịch',
        '51': 'Không đủ số dư',
        '65': 'Vượt hạn mức giao dịch',
        '75': 'Ngân hàng bảo trì',
        '79': 'Sai mật khẩu thanh toán quá số lần',
        '99': 'Lỗi khác'
    };
    return map[code] || `Giao dịch thất bại với mã lỗi: ${code}`;
}

module.exports = PayWithVnPayController;
