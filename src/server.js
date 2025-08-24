require("dotenv").config();
const connectDB = require("./config/db.config");
const express = require("express");
const AuthRoutes = require("./routes/AuthRoute");
const ChatBotRouter = require("./routes/ChatBotRouter");
const DoctorRoutes = require("./routes/DoctorRouter");
const OverviewRoutes = require("./routes/OverviewRoutes");
const AppointmentRoutes = require("./routes/AppointmentRoutes");
const WorkShiftRoutes = require("./routes/WorkShiftRoutes");
const configCORS = require("./config/cors");
const PatientRoutes = require("./routes/PatientRouter");

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
DoctorRoutes(app);
OverviewRoutes(app);
WorkShiftRoutes(app);
AppointmentRoutes(app);

app.use((req, res) => {
  return res.send("404 not found");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
