import {
    Bell,
    Check,
    CheckCheck,
    Loader2,
    X
} from "lucide-react";

import {
    useEffect,
    useState
} from "react";

import {
    getNotifications,
    getUnreadCount,
    markNotificationAsRead,
    markAllNotificationsAsRead
} from "../services/notificationApi";


const formatDate = value => {

    if (!value) {
        return "";
    }

    return new Intl.DateTimeFormat(
        "en-US",
        {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit"
        }
    ).format(
        new Date(value)
    );
};


const NotificationCenter = () => {

    const [
        open,
        setOpen
    ] = useState(false);


    const [
        notifications,
        setNotifications
    ] = useState([]);


    const [
        unreadCount,
        setUnreadCount
    ] = useState(0);


    const [
        loading,
        setLoading
    ] = useState(false);


    const [
        error,
        setError
    ] = useState("");


    const loadUnreadCount =
        async () => {

            try {

                const response =
                    await getUnreadCount();

                setUnreadCount(
                    response?.data?.count || 0
                );

            } catch (error) {

                console.error(
                    "Failed to load notification count:",
                    error
                );
            }
        };


    const loadNotifications =
        async () => {

            try {

                setLoading(true);
                setError("");

                const response =
                    await getNotifications({
                        page: 1,
                        limit: 20
                    });

                setNotifications(
                    Array.isArray(
                        response?.data?.notifications
                    )
                        ? response.data.notifications
                        : []
                );

            } catch (error) {

                console.error(
                    "Failed to load notifications:",
                    error
                );

                setError(
                    error.message ||
                    "Failed to load notifications"
                );

            } finally {

                setLoading(false);
            }
        };


    useEffect(() => {

        loadUnreadCount();


        const interval =
            setInterval(
                loadUnreadCount,
                30000
            );


        return () =>
            clearInterval(
                interval
            );

    }, []);


    useEffect(() => {

        if (open) {
            loadNotifications();
        }

    }, [open]);


    const handleRead =
        async notification => {

            if (
                !notification ||
                notification.readAt
            ) {
                return;
            }


            try {

                await markNotificationAsRead(
                    notification.id
                );


                setNotifications(
                    current =>
                        current.map(
                            item =>
                                item.id ===
                                notification.id
                                    ? {
                                        ...item,
                                        readAt:
                                            new Date().toISOString()
                                    }
                                    : item
                        )
                );


                setUnreadCount(
                    current =>
                        Math.max(
                            0,
                            current - 1
                        )
                );

            } catch (error) {

                console.error(
                    "Failed to mark notification as read:",
                    error
                );
            }
        };


    const handleMarkAll =
        async () => {

            if (
                unreadCount === 0
            ) {
                return;
            }


            try {

                await markAllNotificationsAsRead();


                setNotifications(
                    current =>
                        current.map(
                            notification => ({
                                ...notification,
                                readAt:
                                    notification.readAt ||
                                    new Date().toISOString()
                            })
                        )
                );


                setUnreadCount(0);

            } catch (error) {

                console.error(
                    "Failed to mark notifications as read:",
                    error
                );
            }
        };


    return (
        <div className="relative">

            {/* BELL */}

            <button
                type="button"
                onClick={() =>
                    setOpen(
                        current =>
                            !current
                    )
                }
                className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
                aria-label="Notifications"
                aria-expanded={open}
            >

                <Bell
                    size={19}
                />


                {unreadCount > 0 && (

                    <span className="absolute -right-1 -top-1 flex min-w-5 h-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">

                        {unreadCount > 99
                            ? "99+"
                            : unreadCount}

                    </span>

                )}

            </button>


            {/* PANEL */}

            {open && (

                <>

                    {/* OUTSIDE CLICK */}

                    <div
                        className="fixed inset-0 z-40"
                        onClick={() =>
                            setOpen(false)
                        }
                    />


                    <div className="absolute right-0 top-12 z-50 w-[min(360px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">

                        {/* HEADER */}

                        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">

                            <div>

                                <h3 className="font-semibold text-slate-900">
                                    Notifications
                                </h3>

                                <p className="text-xs text-slate-500">
                                    Recent business activity
                                </p>

                            </div>


                            <div className="flex items-center gap-1">

                                {unreadCount > 0 && (

                                    <button
                                        type="button"
                                        onClick={
                                            handleMarkAll
                                        }
                                        className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                                        title="Mark all as read"
                                        aria-label="Mark all as read"
                                    >
                                        <CheckCheck
                                            size={16}
                                        />
                                    </button>

                                )}


                                <button
                                    type="button"
                                    onClick={() =>
                                        setOpen(
                                            false
                                        )
                                    }
                                    className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                                    aria-label="Close notifications"
                                >
                                    <X
                                        size={16}
                                    />
                                </button>

                            </div>

                        </div>


                        {/* CONTENT */}

                        <div className="max-h-[420px] overflow-y-auto">

                            {/* LOADING */}

                            {loading && (

                                <div className="flex items-center justify-center gap-2 py-12 text-sm text-slate-500">

                                    <Loader2
                                        size={16}
                                        className="animate-spin"
                                    />

                                    Loading notifications...

                                </div>

                            )}


                            {/* ERROR */}

                            {!loading &&
                                error && (

                                    <div className="px-5 py-10 text-center">

                                        <p className="text-sm font-medium text-red-600">
                                            {error}
                                        </p>

                                        <button
                                            type="button"
                                            onClick={
                                                loadNotifications
                                            }
                                            className="mt-3 text-xs font-semibold text-sky-600 hover:text-sky-700"
                                        >
                                            Try again
                                        </button>

                                    </div>

                                )}


                            {/* EMPTY */}

                            {!loading &&
                                !error &&
                                notifications.length ===
                                    0 && (

                                    <div className="px-5 py-12 text-center">

                                        <Bell
                                            size={26}
                                            className="mx-auto mb-3 text-slate-300"
                                        />

                                        <p className="text-sm font-medium text-slate-700">
                                            No notifications
                                        </p>

                                        <p className="mt-1 text-xs text-slate-400">
                                            New business activity will appear here.
                                        </p>

                                    </div>

                                )}


                            {/* LIST */}

                            {!loading &&
                                !error &&
                                notifications.map(
                                    notification => {

                                        const unread =
                                            !notification.readAt;


                                        return (
                                            <button
                                                key={
                                                    notification.id
                                                }
                                                type="button"
                                                onClick={() =>
                                                    handleRead(
                                                        notification
                                                    )
                                                }
                                                className={`flex w-full gap-3 border-b border-slate-100 px-4 py-4 text-left transition hover:bg-slate-50 ${
                                                    unread
                                                        ? "bg-sky-50/50"
                                                        : "bg-white"
                                                }`}
                                            >

                                                {/* ICON */}

                                                <div
                                                    className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                                                        unread
                                                            ? "bg-sky-100 text-sky-600"
                                                            : "bg-slate-100 text-slate-500"
                                                    }`}
                                                >

                                                    {unread ? (

                                                        <Bell
                                                            size={16}
                                                        />

                                                    ) : (

                                                        <Check
                                                            size={16}
                                                        />

                                                    )}

                                                </div>


                                                {/* CONTENT */}

                                                <div className="min-w-0 flex-1">

                                                    <div className="flex items-start justify-between gap-3">

                                                        <p
                                                            className={`text-sm ${
                                                                unread
                                                                    ? "font-semibold text-slate-900"
                                                                    : "font-medium text-slate-700"
                                                            }`}
                                                        >
                                                            {
                                                                notification.title
                                                            }
                                                        </p>


                                                        <span className="shrink-0 text-[10px] text-slate-400">
                                                            {formatDate(
                                                                notification.createdAt
                                                            )}
                                                        </span>

                                                    </div>


                                                    <p className="mt-1 text-xs leading-5 text-slate-500">
                                                        {
                                                            notification.message
                                                        }
                                                    </p>

                                                </div>

                                            </button>
                                        );
                                    }
                                )}

                        </div>

                    </div>

                </>
            )}

        </div>
    );
};


export default NotificationCenter;