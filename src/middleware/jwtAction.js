require("dotenv").config();
require("../../firebaseConfig");
const { getAuth } = require("firebase-admin/auth");

// createJwt: tạo token từ firebase - refresh cũng do firebase xử lý

const verifyToken = async (accessToken) => {
  try {
    const decodedToken = await getAuth().verifyIdToken(accessToken);
    return decodedToken;
  } catch (err) {
    console.error("verifyToken error: ", err.code || err.message);
    return null;
  }
};

const nonSecurePaths = [
  "/",
  "/api/login",
  "/api/logout",
  "/api/register",
  "/api/refreshToken",
]; // kh check middleware url (1)

// token từ BE sẽ lưu vào header bên FE
const extractToken = (req) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    return req.headers.authorization.split(" ")[1];
  }
  return null;
};

// middleware jwt check user đã đăng nhập chưa
const checkUserJwt = async (req, res, next) => {
  if (
    nonSecurePaths.some(
      (path) => req.path === path || req.path.startsWith(`${path}/`)
    )
  )
    return next(); // kh check middleware url (2)
  let tokenFromHeader = extractToken(req);

  if (tokenFromHeader) {
    // bug vừa vào đã check quyền xác thực khi chưa login của Context
    let access_Token = tokenFromHeader;
    let decoded = await verifyToken(access_Token);

    if (decoded && decoded !== "TokenExpiredError") {
      req.user = decoded; // gán thêm .user(data cookie) vào req BE nhận từ FE
      req.access_Token = access_Token; // gán thêm .token(data cookie) vào req BE nhận từ FE
      next();
    } else {
      return res.status(403).json({
        EC: -1,
        DT: "",
        EM: "Not authenticated the user",
      });
    }
  }
  // ngược lại khi không có cookies or header thì trả ra lỗi không xác thực
  else {
    return res.status(401).json({
      EC: -1,
      DT: "",
      EM: "Not authenticated the user(access_Token | JWT)",
    });
  }
};

//middleware check user có quyền không(lấy role -> ss URL)
const checkUserPermission = (req, res, next) => {
  if (nonSecurePaths.includes(req.path) || req.path === "/api/account")
    return next(); // kh check middleware url (2)
  if (req.user) {
    next();
  } else {
    return res.status(401).json({
      EC: -1,
      DT: "",
      EM: "Not authenticated the user",
    });
  }
};

module.exports = {
  checkUserJwt,
  checkUserPermission,
};
