require("dotenv").config();

const corsMiddleware = (req, res, next) => {
  const allowedOrigins = [
    process.env.REACT_URL,
    process.env.REACT_NATIVE_URL,
    "10.0.2.2", // login bằng giả lập android
    "*", // login bằng điện thoại
  ];

  const origin = req.headers.origin;
  console.log("🛰️ Request origin:", origin);

  if (!origin || allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
  } else {
    console.warn(`🚫 Blocked CORS request from: ${origin}`);
  }

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With, Content-Type, Authorization"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
};

module.exports = corsMiddleware;
