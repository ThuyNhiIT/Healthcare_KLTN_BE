require("dotenv").config();
const connectDB = require("./config/db.config");
const express = require("express");
const AuthRoutes = require("./routes/AuthRoute");
<<<<<<< Updated upstream
const ChatBotRouter = require("./routes/ChatBotRouter");
=======
const DoctorRoutes = require("./routes/DoctorRouter");
>>>>>>> Stashed changes
const configCORS = require("./config/cors");
const PatientRoutes = require("./routes/PatientRouter");

const app = express();
configCORS(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Kết nối MongoDB
connectDB();

// Routes
<<<<<<< Updated upstream
AuthRoutes(app);
ChatBotRouter(app);
PatientRoutes(app)
=======
// AuthRoutes(app);
app.use("/doctor", DoctorRoutes);
>>>>>>> Stashed changes

app.use((req, res) => {
  return res.send("404 not found");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
