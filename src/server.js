require("dotenv").config();
const connectDB = require("./config/db.config");
const express = require("express");
const AuthRoutes = require("./routes/AuthRoute");
const ChatBotRouter = require("./routes/ChatBotRouter");
const configCORS = require("./config/cors");

const app = express();
configCORS(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Kết nối MongoDB
connectDB();

// Routes
AuthRoutes(app);
ChatBotRouter(app);

app.use((req, res) => {
  return res.send("404 not found");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
