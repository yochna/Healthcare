require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");

const app = express();

// ✅ Security middleware
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());

// ✅ Rate limiting — all routes
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: { success: false, message: "Too many requests, try again after 15 minutes" }
});
app.use(limiter);

// ✅ Strict rate limit — auth routes only
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { success: false, message: "Too many login attempts, try again after 15 minutes" }
});

// ✅ Logging
if(process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// ✅ Body parsing with size limit
app.use(express.json({ limit: "10kb" }));
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000" }));

// ✅ Public routes
app.use("/api/auth/login", authLimiter);
app.use("/api/auth", require("./routes/auth"));
app.use("/api/contacts", require("./routes/contacts"));
app.use("/api/chatbot", require("./routes/chatbot"));

// ✅ Protected routes
app.use("/api/patients", require("./routes/patients"));
app.use("/api/volunteers", require("./routes/volunteers"));

// ✅ Health check
app.get("/api/health", (req, res) => res.json({ status: "ok", timestamp: new Date() }));

// ✅ 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: "Route not found" });
});

// ✅ Global error handler
app.use((err, req, res, next) => {
    console.error(err.message);
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Server error"
    });
});

// ✅ Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/healthcare_support";
mongoose
    .connect(MONGO_URI)
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.log("⚠️ MongoDB not connected:", err.message));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));