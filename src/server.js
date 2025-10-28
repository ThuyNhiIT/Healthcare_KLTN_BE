require("dotenv").config();
const connectDB = require("./config/db.config");
const express = require("express");
const AuthRoutes = require("./routes/AuthRoute");
const ChatBotRouter = require("./routes/ChatBotRouter");
const configCORS = require("./config/cors");
const PatientRoutes = require("./routes/PatientRouter");
const BookingRoutes = require("./routes/BookingRoute");
const DoctorRoutes = require("./routes/DoctorRoute");
const WorkShiftRoutes = require("./routes/WorkShiftRoute");
const WalletRoutes = require("./routes/WalletRouter");
const NotificationRoutes = require("./routes/NotificationRoute");
const PayWithVnPayController = require("./controllers/PayWithVnPayController");

const app = express();
configCORS(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Kết nối MongoDB
connectDB();

// Routes
AuthRoutes(app);
ChatBotRouter(app);
PatientRoutes(app);
BookingRoutes(app);
DoctorRoutes(app);
WorkShiftRoutes(app);
WalletRoutes(app);
NotificationRoutes(app);
PayWithVnPayController(app);

app.use((req, res) => {
  return res.send("404 not found");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
