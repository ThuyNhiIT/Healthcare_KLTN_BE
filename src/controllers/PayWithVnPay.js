// server.js - Express Backend cho VNPay
const express = require('express');
const crypto = require('crypto');
const querystring = require('qs');
const moment = require('moment');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// VNPay Config - Thay đổi theo thông tin merchant của bạn
const config = {
    vnp_TmnCode: 'YOUR_TMN_CODE', // Mã website của merchant
    vnp_HashSecret: 'YOUR_HASH_SECRET', // Secret key
    vnp_Url: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html', // URL VNPay (sandbox)
    vnp_Api: 'https://sandbox.vnpayment.vn/merchant_webapi/api/transaction',
    vnp_ReturnUrl: 'http://localhost:3000/payment/vnpay_return' // URL return về React app
};

// Function tạo URL thanh toán
function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

// API tạo payment URL
app.post('/api/payment/create_payment_url', (req, res) => {
    try {
        const ipAddr = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            (req.connection.socket ? req.connection.socket.remoteAddress : null);

        const dateFormat = moment().format('YYYYMMDDHHmmss');
        
        const {
            amount,
            orderDescription,
            orderType = 'other',
            language = 'vn',
            bankCode = ''
        } = req.body;

        // Validate input
        if (!amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Số tiền không hợp lệ'
            });
        }

        const orderId = moment().format('YYYYMMDDHHmmss');
        const vnpAmount = amount * 100; // VNPay yêu cầu số tiền nhân với 100

        let vnp_Params = {
            'vnp_Version': '2.1.0',
            'vnp_Command': 'pay',
            'vnp_TmnCode': config.vnp_TmnCode,
            'vnp_Locale': language,
            'vnp_CurrCode': 'VND',
            'vnp_TxnRef': orderId,
            'vnp_OrderInfo': orderDescription || `Thanh toan don hang ${orderId}`,
            'vnp_OrderType': orderType,
            'vnp_Amount': vnpAmount,
            'vnp_ReturnUrl': config.vnp_ReturnUrl,
            'vnp_IpAddr': ipAddr,
            'vnp_CreateDate': dateFormat
        };

        if (bankCode) {
            vnp_Params['vnp_BankCode'] = bankCode;
        }

        vnp_Params = sortObject(vnp_Params);

        const signData = querystring.stringify(vnp_Params, { encode: false });
        const hmac = crypto.createHmac("sha512", config.vnp_HashSecret);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
        vnp_Params['vnp_SecureHash'] = signed;

        const paymentUrl = config.vnp_Url + '?' + querystring.stringify(vnp_Params, { encode: false });

        res.json({
            success: true,
            data: {
                paymentUrl: paymentUrl,
                orderId: orderId
            }
        });

    } catch (error) {
        console.error('Error creating payment URL:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi tạo URL thanh toán'
        });
    }
});

// API xử lý callback từ VNPay
app.get('/api/payment/vnpay_return', (req, res) => {
    try {
        let vnp_Params = req.query;
        const secureHash = vnp_Params['vnp_SecureHash'];

        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];

        vnp_Params = sortObject(vnp_Params);
        
        const signData = querystring.stringify(vnp_Params, { encode: false });
        const hmac = crypto.createHmac("sha512", config.vnp_HashSecret);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

        if (secureHash === signed) {
            const orderId = vnp_Params['vnp_TxnRef'];
            const rspCode = vnp_Params['vnp_ResponseCode'];
            const amount = vnp_Params['vnp_Amount'] / 100; // Chia cho 100 để có số tiền gốc
            const orderInfo = vnp_Params['vnp_OrderInfo'];
            const payDate = vnp_Params['vnp_PayDate'];
            const transactionNo = vnp_Params['vnp_TransactionNo'];

            let paymentStatus = 'failed';
            let message = 'Giao dịch thất bại';

            if (rspCode === '00') {
                paymentStatus = 'success';
                message = 'Giao dịch thành công';
                
                // TODO: Cập nhật database với thông tin giao dịch
                console.log('Payment successful:', {
                    orderId,
                    amount,
                    transactionNo,
                    payDate
                });
            }

            // Redirect về React app với kết quả
            const redirectUrl = `http://localhost:3000/payment/result?` + 
                `status=${paymentStatus}&` +
                `orderId=${orderId}&` +
                `amount=${amount}&` +
                `message=${encodeURIComponent(message)}&` +
                `transactionNo=${transactionNo || ''}&` +
                `payDate=${payDate || ''}`;

            res.redirect(redirectUrl);

        } else {
            res.redirect(`http://localhost:3000/payment/result?status=failed&message=${encodeURIComponent('Chữ ký không hợp lệ')}`);
        }
    } catch (error) {
        console.error('Error processing VNPay return:', error);
        res.redirect(`http://localhost:3000/payment/result?status=failed&message=${encodeURIComponent('Lỗi xử lý kết quả thanh toán')}`);
    }
});

// API query transaction status
app.post('/api/payment/vnpay_ipn', (req, res) => {
    try {
        let vnp_Params = req.query;
        const secureHash = vnp_Params['vnp_SecureHash'];

        const orderId = vnp_Params['vnp_TxnRef'];
        const rspCode = vnp_Params['vnp_ResponseCode'];

        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];

        vnp_Params = sortObject(vnp_Params);
        const signData = querystring.stringify(vnp_Params, { encode: false });
        const hmac = crypto.createHmac("sha512", config.vnp_HashSecret);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

        let paymentStatus = '0'; // Lỗi
        let returnCode = '97'; // Chữ ký không hợp lệ

        if (secureHash === signed) {
            if (rspCode == '00') {
                paymentStatus = '1'; // Thành công
                returnCode = '00';
                
                // TODO: Cập nhật trạng thái đơn hàng trong database
                console.log('IPN - Payment successful for order:', orderId);
            } else {
                paymentStatus = '0';
                returnCode = '00';
                
                console.log('IPN - Payment failed for order:', orderId);
            }
        } else {
            returnCode = '97';
        }

        res.status(200).json({ 'RspCode': returnCode, 'Message': 'success' });
    } catch (error) {
        console.error('Error processing VNPay IPN:', error);
        res.status(200).json({ 'RspCode': '99', 'Message': 'Unknow error' });
    }
});

// API lấy danh sách ngân hàng
app.get('/api/payment/banks', (req, res) => {
    const banks = [
        { code: '', name: 'Cổng thanh toán VNPay' },
        { code: 'VNPAYQR', name: 'Thanh toán qua ứng dụng hỗ trợ VNPAYQR' },
        { code: 'VNBANK', name: 'Thanh toán qua ATM-Tài khoản ngân hàng nội địa' },
        { code: 'INTCARD', name: 'Thanh toán qua thẻ quốc tế' },
        { code: 'VISA', name: 'Thẻ quốc tế Visa' },
        { code: 'MASTERCARD', name: 'Thẻ quốc tế MasterCard' },
        { code: 'JCB', name: 'Thẻ quốc tế JCB' },
        { code: 'VCB', name: 'Ngân hàng Vietcombank' },
        { code: 'TCB', name: 'Ngân hàng Techcombank' },
        { code: 'MB', name: 'Ngân hàng MB' },
        { code: 'BIDV', name: 'Ngân hàng BIDV' },
        { code: 'VTB', name: 'Ngân hàng Vietinbank' },
        { code: 'TPB', name: 'Ngân hàng TPBank' },
        { code: 'ACB', name: 'Ngân hàng ACB' },
        { code: 'VPB', name: 'Ngân hàng VPBank' },
        { code: 'AGRIBANK', name: 'Ngân hàng Agribank' },
        { code: 'SCB', name: 'Ngân hàng SCB' },
        { code: 'SACOMBANK', name: 'Ngân hàng SacomBank' }
    ];

    res.json({
        success: true,
        data: banks
    });
});

app.listen(PORT, () => {
    console.log(`Server đang chạy tại port ${PORT}`);
});

// Export để test
module.exports = app;