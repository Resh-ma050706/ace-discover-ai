const express = require("express");
const cors = require("cors");
require("dotenv").config();
const pool = require("./config/database");
const eventRoutes = require("./routes/eventRoutes");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const savedEventRoutes = require("./routes/savedEventRoutes");
const searchRoutes = require("./routes/searchRoutes");
const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  }),
);

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/saved-events", savedEventRoutes);
app.use("/api/search", searchRoutes);
app.get("/api/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW() AS database_time");

    res.status(200).json({
      success: true,
      project: "ACE Discover AI",
      message: "Backend server and PostgreSQL are running",
      databaseConnected: true,
      databaseTime: result.rows[0].database_time,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "PostgreSQL connection failed",
      databaseConnected: false,
      error: error.message,
    });
  }
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`ACE Discover AI backend running on port ${PORT}`);
});
