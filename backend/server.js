const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "1mb" }));

// Welcome Route
app.get("/", (req, res) => {
  res.send("Welcome to HabitFlow API");
});

// Health Check Route
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "success", message: "HabitFlow API is running" });
});

// API Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/habits", require("./routes/habitRoutes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});