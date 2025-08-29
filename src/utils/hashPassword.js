const bcrypt = require("bcryptjs");

/**
 * Hash password sử dụng bcrypt
 * @param {string} password - Mật khẩu gốc
 * @param {number} saltRounds - Độ mạnh salt (mặc định 10)
 * @returns {string} hashed password
 */
const hashPassword = (password, saltRounds = 10) => {
    if (!password) return "";
    const salt = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hashSync(password, salt);
};

/**
 * So sánh mật khẩu nhập vào với hash đã lưu
 * @param {string} password - Mật khẩu người dùng nhập
 * @param {string} hashedPassword - Mật khẩu đã hash trong DB
 * @returns {boolean} true nếu khớp
 */
const comparePassword = (password, hashedPassword) => {
    return bcrypt.compareSync(password, hashedPassword);
};

module.exports = {
    hashPassword,
    comparePassword,
};
