const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const healthRoutes = require("./routes/healthRoutes");
const leadRoutes = require("./routes/leadRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoute");
const appointmentRoutes = require("./routes/appointmentRoutes");
const chatRoutes = require("./routes/chatRoutes");
const customerRoutes = require("./routes/customerRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const errorHandler = require("./middleware/errorHandler");

const app = express();

const isProduction = process.env.NODE_ENV === "production";

// ============================================================
// SECURITY
// ============================================================

app.disable("x-powered-by");

if (
    isProduction ||
    process.env.TRUST_PROXY === "true" ||
    process.env.TRUST_PROXY === "1"
) {
    app.set("trust proxy", 1);
}

// ============================================================
// CORS
// ============================================================

const configuredFrontendUrl =
    process.env.FRONTEND_URL?.trim();

const defaultLocalOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "http://127.0.0.1:3000",
];

let allowedOrigins;

if (isProduction) {
    allowedOrigins = configuredFrontendUrl
        ? configuredFrontendUrl
            .split(",")
            .map((origin) => origin.trim())
            .filter(Boolean)
        : [];
} else {
    allowedOrigins = configuredFrontendUrl
        ? Array.from(
            new Set([
                ...configuredFrontendUrl
                    .split(",")
                    .map((origin) => origin.trim())
                    .filter(Boolean),
                ...defaultLocalOrigins,
            ])
        )
        : defaultLocalOrigins;
}

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow server-to-server requests and tools
            // that do not send an Origin header.
            if (!origin) {
                return callback(null, true);
            }

            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            return callback(
                new Error("CORS origin not allowed")
            );
        },

        methods: [
            "GET",
            "POST",
            "PUT",
            "PATCH",
            "DELETE",
            "OPTIONS",
        ],

        allowedHeaders: [
            "Content-Type",
            "Authorization",
        ],

        credentials: false,
    })
);

// ============================================================
// SECURITY HEADERS
// ============================================================

app.use(helmet());

// ============================================================
// REQUEST SIZE LIMITS
// ============================================================

app.use(
    express.json({
        limit: "1mb",
    })
);

app.use(
    express.urlencoded({
        extended: false,
        limit: "100kb",
    })
);

// ============================================================
// RATE LIMITERS
// ============================================================

const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,

    max: 300,

    standardHeaders: true,

    legacyHeaders: false,

    message: {
        success: false,
        message:
            "Too many requests. Please try again later.",
    },
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,

    max: 20,

    standardHeaders: true,

    legacyHeaders: false,

    skipSuccessfulRequests: true,

    message: {
        success: false,
        message:
            "Too many authentication attempts. Please try again later.",
    },
});

const chatLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,

    max: 60,

    standardHeaders: true,

    legacyHeaders: false,

    message: {
        success: false,
        message:
            "Too many chat requests. Please try again later.",
    },
});

// ============================================================
// GENERAL API RATE LIMIT
// ============================================================

app.use(
    "/api",
    generalLimiter
);

// ============================================================
// AUTH RATE LIMIT
// ============================================================

app.use(
    "/api/auth/login",
    authLimiter
);

app.use(
    "/api/auth/register",
    authLimiter
);

// ============================================================
// AI CHAT RATE LIMIT
// ============================================================

app.use(
    "/api/chat",
    chatLimiter
);

// ============================================================
// ROUTES
// ============================================================

app.use(
    "/api/health",
    healthRoutes
);

app.use(
    "/api/leads",
    leadRoutes
);

app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/admin",
    adminRoutes
);

app.use(
    "/api/appointments",
    appointmentRoutes
);

app.use(
    "/api/chat",
    chatRoutes
);

app.use(
    "/api/customers",
    customerRoutes
);

app.use(
    "/api/notifications",
    notificationRoutes
);

// ============================================================
// 404 HANDLER
// ============================================================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`,
    });
});

// ============================================================
// CENTRAL ERROR HANDLER
// ============================================================

app.use(errorHandler);

module.exports = app;