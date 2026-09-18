const notificationService =
    require("../services/notificationService");


// ============================================================
// GET NOTIFICATIONS
// ============================================================

const getNotifications =
    async (req, res, next) => {

        try {

            const {
                page = 1,
                limit = 20,
                unreadOnly = "false"
            } = req.query;

            const result =
                await notificationService
                    .getNotifications({
                        page:
                            Number(page),

                        limit:
                            Number(limit),

                        unreadOnly:
                            unreadOnly === "true"
                    });

            res.status(200).json({
                success: true,
                data: result
            });

        } catch (error) {

            next(error);
        }
    };


// ============================================================
// UNREAD COUNT
// ============================================================

const getUnreadCount =
    async (req, res, next) => {

        try {

            const count =
                await notificationService
                    .getUnreadNotificationCount();

            res.status(200).json({
                success: true,

                data: {
                    count
                }
            });

        } catch (error) {

            next(error);
        }
    };


// ============================================================
// MARK READ
// ============================================================

const markAsRead =
    async (req, res, next) => {

        try {

            const notification =
                await notificationService
                    .markNotificationAsRead(
                        req.params.id
                    );

            res.status(200).json({
                success: true,
                data: notification
            });

        } catch (error) {

            next(error);
        }
    };


// ============================================================
// MARK ALL READ
// ============================================================

const markAllAsRead =
    async (req, res, next) => {

        try {

            const result =
                await notificationService
                    .markAllNotificationsAsRead();

            res.status(200).json({
                success: true,
                data: result
            });

        } catch (error) {

            next(error);
        }
    };


// ============================================================
// SETTINGS
// ============================================================

const getSettings =
    async (req, res, next) => {

        try {

            const settings =
                await notificationService
                    .getNotificationSettings();

            res.status(200).json({
                success: true,
                data: settings
            });

        } catch (error) {

            next(error);
        }
    };


const updateSettings =
    async (req, res, next) => {

        try {

            const settings =
                await notificationService
                    .updateNotificationSettings(
                        req.body
                    );

            res.status(200).json({
                success: true,
                message:
                    "Notification settings updated",
                data: settings
            });

        } catch (error) {

            next(error);
        }
    };


module.exports = {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    getSettings,
    updateSettings
};