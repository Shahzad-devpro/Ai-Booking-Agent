const express = require("express");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");
const healthRoutes = require("./routes/healthRoutes");
const leadRoutes = require("./routes/leadRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "AI Booking & Recieptionist Agent API is running"
    });
});

app.use("/api/health", healthRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/auth", authRoutes);


app.use(errorHandler);
module.exports = app;