const express = require("express");

const {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    getSettings,
    updateSettings
} = require("../controllers/notificationController");

const authMiddleware =
    require("../middleware/authMiddleware");

const router = express.Router();


// ============================================================
// SETTINGS
// ============================================================

router.get(
    "/settings",
    authMiddleware,
    getSettings
);

router.patch(
    "/settings",
    authMiddleware,
    updateSettings
);


// ============================================================
// NOTIFICATIONS
// ============================================================

router.get(
    "/",
    authMiddleware,
    getNotifications
);

router.get(
    "/unread-count",
    authMiddleware,
    getUnreadCount
);

router.patch(
    "/read-all",
    authMiddleware,
    markAllAsRead
);

router.patch(
    "/:id/read",
    authMiddleware,
    markAsRead
);


module.exports = router;