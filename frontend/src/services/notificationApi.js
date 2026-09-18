const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:5000/api";


const getAuthHeaders = () => {

    const token =
        localStorage.getItem(
            "authToken"
        );

    return {
        Authorization:
            `Bearer ${token}`
    };
};


const parseResponse =
    async response => {

        let data = null;

        try {
            data =
                await response.json();
        } catch {
            data = null;
        }

        if (!response.ok) {

            throw new Error(
                data?.message ||
                "Request failed"
            );
        }

        return data;
    };


// ============================================================
// GET NOTIFICATIONS
// ============================================================

const getNotifications =
    async ({
        page = 1,
        limit = 20,
        unreadOnly = false
    } = {}) => {

        const params =
            new URLSearchParams();

        params.set(
            "page",
            String(page)
        );

        params.set(
            "limit",
            String(limit)
        );

        params.set(
            "unreadOnly",
            String(unreadOnly)
        );

        const response =
            await fetch(
                `${API_BASE_URL}/notifications?${params.toString()}`,
                {
                    method: "GET",
                    headers:
                        getAuthHeaders()
                }
            );

        return parseResponse(
            response
        );
    };


// ============================================================
// UNREAD COUNT
// ============================================================

const getUnreadCount =
    async () => {

        const response =
            await fetch(
                `${API_BASE_URL}/notifications/unread-count`,
                {
                    method: "GET",
                    headers:
                        getAuthHeaders()
                }
            );

        return parseResponse(
            response
        );
    };


// ============================================================
// MARK READ
// ============================================================

const markNotificationAsRead =
    async id => {

        const response =
            await fetch(
                `${API_BASE_URL}/notifications/${id}/read`,
                {
                    method: "PATCH",
                    headers:
                        getAuthHeaders()
                }
            );

        return parseResponse(
            response
        );
    };


// ============================================================
// MARK ALL READ
// ============================================================

const markAllNotificationsAsRead =
    async () => {

        const response =
            await fetch(
                `${API_BASE_URL}/notifications/read-all`,
                {
                    method: "PATCH",
                    headers:
                        getAuthHeaders()
                }
            );

        return parseResponse(
            response
        );
    };


// ============================================================
// SETTINGS
// ============================================================

const getNotificationSettings =
    async () => {

        const response =
            await fetch(
                `${API_BASE_URL}/notifications/settings`,
                {
                    method: "GET",
                    headers:
                        getAuthHeaders()
                }
            );

        return parseResponse(
            response
        );
    };


const updateNotificationSettings =
    async settings => {

        const response =
            await fetch(
                `${API_BASE_URL}/notifications/settings`,
                {
                    method: "PATCH",

                    headers: {
                        ...getAuthHeaders(),
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            settings
                        )
                }
            );

        return parseResponse(
            response
        );
    };


export {
    getNotifications,
    getUnreadCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    getNotificationSettings,
    updateNotificationSettings
};