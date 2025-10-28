require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db.config");

// Routers
const AuthRoutes = require("./routes/AuthRoute");
const ChatBotRouter = require("./routes/ChatBotRouter");
const PatientRoutes = require("./routes/PatientRouter");
const BookingRoutes = require("./routes/BookingRoute");
const DoctorRoutes = require("./routes/DoctorRoute");
const WorkShiftRoutes = require("./routes/WorkShiftRoute");
const WalletRoutes = require("./routes/WalletRouter");
const NotificationRoutes = require("./routes/NotificationRoute");
const PayWithVnPayController = require("./controllers/PayWithVnPayController");

const corsMiddleware = require("./config/cors");

const app = express();

app.use(corsMiddleware);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
connectDB();

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
  res.status(404).send("404 Not Found");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
