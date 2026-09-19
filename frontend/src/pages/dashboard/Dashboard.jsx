import { useEffect, useMemo, useState } from "react";

import {
    Activity,
    AlertCircle,
    ArrowUpRight,
    CalendarDays,
    Clock3,
    Loader2,
    MapPin,
    UserRound,
    Users,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

import {
    getLeads,
} from "../../services/leadApi";


const BUSINESS_TIMEZONE = "America/New_York";

const getAuthToken = () => {
    return localStorage.getItem("authToken");
};


const formatDateTime = (value) => {
    if (!value) return "—";

    return new Intl.DateTimeFormat("en-US", {
        timeZone: BUSINESS_TIMEZONE,
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    }).format(new Date(value));
};


const formatTime = (value) => {
    if (!value) return "—";

    return new Intl.DateTimeFormat("en-US", {
        timeZone: BUSINESS_TIMEZONE,
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    }).format(new Date(value));
};


const getBusinessDateKey = (value = new Date()) => {
    return new Intl.DateTimeFormat("en-US", {
        timeZone: BUSINESS_TIMEZONE,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    })
        .formatToParts(value)
        .reduce((result, part) => {
            if (part.type === "year") result.year = part.value;
            if (part.type === "month") result.month = part.value;
            if (part.type === "day") result.day = part.value;

            return result;
        }, {});
};


const getBusinessDateString = (value = new Date()) => {
    const parts = getBusinessDateKey(value);

    return `${parts.year}-${parts.month}-${parts.day}`;
};


const getAppointmentBusinessDate = (value) => {
    return getBusinessDateString(new Date(value));
};


const getRelativeTime = (value) => {
    if (!value) return "—";

    const createdAt = new Date(value);
    const now = new Date();

    const difference =
        Math.floor(
            (now.getTime() - createdAt.getTime()) / 1000
        );

    if (difference < 60) {
        return "Just now";
    }

    const minutes = Math.floor(
        difference / 60
    );

    if (minutes < 60) {
        return `${minutes}m ago`;
    }

    const hours = Math.floor(
        minutes / 60
    );

    if (hours < 24) {
        return `${hours}h ago`;
    }

    const days = Math.floor(
        hours / 24
    );

    if (days < 7) {
        return `${days}d ago`;
    }

    return formatDateTime(value);
};


const formatService = (service) => {
    if (!service) return "Service request";

    return String(service)
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (letter) =>
            letter.toUpperCase()
        );
};


const getUrgencyClass = (urgency) => {
    switch (urgency) {
        case "HIGH":
            return "bg-red-50 text-red-700";

        case "LOW":
            return "bg-slate-100 text-slate-600";

        default:
            return "bg-amber-50 text-amber-700";
    }
};


const getStatusClass = (status) => {
    switch (status) {
        case "BOOKED":
            return "bg-emerald-50 text-emerald-700";

        case "CANCELLED":
            return "bg-red-50 text-red-700";

        case "AI_QUALIFIED":
            return "bg-amber-50 text-amber-700";

        case "NEW":
            return "bg-sky-50 text-sky-700";

        default:
            return "bg-slate-100 text-slate-600";
    }
};


const Dashboard = () => {

    const user = JSON.parse(
        localStorage.getItem("authUser") || "null"
    );


    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        booked: 0,
    });


    const [todayAppointments, setTodayAppointments] =
        useState([]);


    const [recentLeads, setRecentLeads] =
        useState([]);


    const [loading, setLoading] =
        useState(true);


    const [error, setError] =
        useState("");


    useEffect(() => {

        const loadDashboard = async () => {

            try {

                setLoading(true);
                setError("");


                const token =
                    getAuthToken();


                if (!token) {
                    throw new Error(
                        "Authentication session not found"
                    );
                }


                const [
                    allLeads,
                    pendingLeads,
                    bookedLeads,
                    recentLeadsResponse,
                    appointmentsResponse,
                ] = await Promise.all([

                    getLeads({
                        page: 1,
                        limit: 1,
                    }),

                    getLeads({
                        status: "AI_QUALIFIED",
                        page: 1,
                        limit: 1,
                    }),

                    getLeads({
                        status: "BOOKED",
                        page: 1,
                        limit: 1,
                    }),

                    getLeads({
                        page: 1,
                        limit: 5,
                    }),

                    fetch(
                        `${import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/appointments?status=BOOKED&page=1&limit=100`,
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`,
                            },
                        }
                    ),
                ]);


                if (!appointmentsResponse.ok) {
                    const appointmentError =
                        await appointmentsResponse.json()
                            .catch(() => null);

                    throw new Error(
                        appointmentError?.message ||
                        "Failed to load appointments"
                    );
                }


                const appointmentsJson =
                    await appointmentsResponse.json();


                const appointmentsData =
                    appointmentsJson?.data || {};


                const appointments =
                    appointmentsData?.appointments ||
                    appointmentsData?.items ||
                    [];


                const today =
                    getBusinessDateString();


                const todaysAppointments =
                    appointments
                        .filter((appointment) => {
                            if (
                                !appointment?.startTime
                            ) {
                                return false;
                            }

                            return (
                                getAppointmentBusinessDate(
                                    appointment.startTime
                                ) === today
                            );
                        })
                        .sort((a, b) => {
                            return (
                                new Date(a.startTime)
                                    .getTime() -
                                new Date(b.startTime)
                                    .getTime()
                            );
                        });


                const leads =
                    recentLeadsResponse?.data?.leads ||
                    recentLeadsResponse?.data?.items ||
                    [];


                setStats({
                    total:
                        allLeads?.data?.total || 0,

                    pending:
                        pendingLeads?.data?.total || 0,

                    booked:
                        bookedLeads?.data?.total || 0,
                });


                setRecentLeads(
                    Array.isArray(leads)
                        ? leads.slice(0, 5)
                        : []
                );


                setTodayAppointments(
                    todaysAppointments
                );

            } catch (err) {

                console.error(
                    "Failed to load dashboard:",
                    err
                );

                setError(
                    err.message ||
                    "Failed to load dashboard"
                );

            } finally {

                setLoading(false);

            }
        };


        loadDashboard();

    }, []);


    const todayLabel = useMemo(() => {

        return new Intl.DateTimeFormat(
            "en-US",
            {
                timeZone:
                    BUSINESS_TIMEZONE,
                weekday: "long",
                month: "long",
                day: "numeric",
            }
        ).format(new Date());

    }, []);


    const StatCard = ({
        icon: Icon,
        label,
        value,
        description,
        iconClass,
    }) => (
        <div className="rounded-2xl border border-slate-200 bg-white p-5">

            <div className="flex items-center justify-between">

                <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}
                >
                    <Icon size={19} />
                </div>

                <ArrowUpRight
                    size={17}
                    className="text-slate-300"
                />

            </div>

            <p className="mt-5 text-xs font-semibold text-slate-400">
                {label}
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-900">

                {loading ? (
                    <Loader2
                        size={21}
                        className="animate-spin text-slate-300"
                    />
                ) : (
                    value
                )}

            </p>

            <p className="mt-1 text-[11px] text-slate-400">
                {description}
            </p>

        </div>
    );


    return (
        <DashboardLayout activePath="/admin">

            <div className="min-h-screen">

                {/* HEADER */}

                <div className="border-b border-slate-200 bg-white">

                    <div className="px-5 py-7 sm:px-8 lg:px-10">

                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-sky-600">
                            Business overview
                        </p>

                        <div className="mt-2 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">

                            <div>

                                <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">

                                    Welcome back
                                    {user?.name
                                        ? `, ${user.name}`
                                        : ""}

                                </h1>

                                <p className="mt-1 text-sm text-slate-500">
                                    Here's what's happening with your service business.
                                </p>

                            </div>


                            <div className="flex items-center gap-2 text-xs font-medium text-slate-400">

                                <Activity
                                    size={14}
                                    className="text-emerald-500"
                                />

                                System operational

                            </div>

                        </div>

                    </div>

                </div>


                <div className="px-5 py-6 sm:px-8 lg:px-10">

                    {error && (
                        <div className="mb-5 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">

                            <AlertCircle
                                size={17}
                                className="text-red-500"
                            />

                            <p className="text-sm font-medium text-red-700">
                                {error}
                            </p>

                        </div>
                    )}


                    {/* STATS */}

                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                        <StatCard
                            icon={Users}
                            label="Total leads"
                            value={stats.total}
                            description="All captured customer inquiries"
                            iconClass="bg-sky-50 text-sky-600"
                        />

                        <StatCard
                            icon={CalendarDays}
                            label="Booked leads"
                            value={stats.booked}
                            description="Leads connected to bookings"
                            iconClass="bg-emerald-50 text-emerald-600"
                        />

                        <StatCard
                            icon={Clock3}
                            label="AI qualified"
                            value={stats.pending}
                            description="Leads waiting for follow-up"
                            iconClass="bg-amber-50 text-amber-600"
                        />

                        <StatCard
                            icon={Activity}
                            label="AI receptionist"
                            value="Active"
                            description="Receptionist is online"
                            iconClass="bg-violet-50 text-violet-600"
                        />

                    </div>


                    {/* TODAY / RECENT */}

                    <div className="mt-6 grid gap-6 xl:grid-cols-2">

                        {/* TODAY'S APPOINTMENTS */}

                        <section className="rounded-2xl border border-slate-200 bg-white">

                            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

                                <div>

                                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                                        Schedule
                                    </p>

                                    <h2 className="mt-1 text-base font-bold text-slate-900">
                                        Today's appointments
                                    </h2>

                                </div>


                                <a
                                    href="/admin/appointments"
                                    className="text-xs font-bold text-sky-600 transition hover:text-sky-700"
                                >
                                    View all
                                </a>

                            </div>


                            <div className="p-5">

                                <div className="mb-4 flex items-center gap-2 text-xs font-medium text-slate-400">

                                    <CalendarDays
                                        size={14}
                                    />

                                    {todayLabel}

                                </div>


                                {loading ? (

                                    <div className="flex items-center justify-center py-10">

                                        <Loader2
                                            size={22}
                                            className="animate-spin text-slate-300"
                                        />

                                    </div>

                                ) : todayAppointments.length === 0 ? (

                                    <div className="rounded-xl bg-slate-50 px-4 py-8 text-center">

                                        <CalendarDays
                                            size={22}
                                            className="mx-auto text-slate-300"
                                        />

                                        <p className="mt-3 text-sm font-semibold text-slate-600">
                                            No appointments today
                                        </p>

                                        <p className="mt-1 text-xs text-slate-400">
                                            Your schedule is clear for today.
                                        </p>

                                    </div>

                                ) : (

                                    <div className="space-y-3">

                                        {todayAppointments.map(
                                            (appointment) => {

                                                const customer =
                                                    appointment.customer;

                                                const lead =
                                                    appointment.lead;

                                                const technician =
                                                    appointment.technician;


                                                return (
                                                    <a
                                                        key={
                                                            appointment.id
                                                        }
                                                        href="/admin/appointments"
                                                        className="block rounded-xl border border-slate-200 p-4 transition hover:border-sky-200 hover:bg-sky-50/40"
                                                    >

                                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                                                            <div className="min-w-0">

                                                                <div className="flex items-center gap-2">

                                                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-600">

                                                                        <Clock3
                                                                            size={16}
                                                                        />

                                                                    </div>


                                                                    <div className="min-w-0">

                                                                        <p className="truncate text-sm font-bold text-slate-900">
                                                                            {customer?.name ||
                                                                                "Customer"}
                                                                        </p>

                                                                        <p className="truncate text-xs text-slate-400">
                                                                            {formatService(
                                                                                lead?.service
                                                                            )}
                                                                        </p>

                                                                    </div>

                                                                </div>

                                                            </div>


                                                            <div className="flex shrink-0 flex-col sm:items-end">

                                                                <p className="text-sm font-bold text-slate-900">

                                                                    {formatTime(
                                                                        appointment.startTime
                                                                    )}

                                                                    {" – "}

                                                                    {formatTime(
                                                                        appointment.endTime
                                                                    )}

                                                                </p>

                                                                <p className="mt-1 text-xs text-slate-400">

                                                                    {technician?.name ||
                                                                        "Technician pending"}

                                                                </p>

                                                            </div>

                                                        </div>

                                                    </a>
                                                );
                                            }
                                        )}

                                    </div>

                                )}

                            </div>

                        </section>


                        {/* RECENT LEADS */}

                        <section className="rounded-2xl border border-slate-200 bg-white">

                            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

                                <div>

                                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                                        Customer activity
                                    </p>

                                    <h2 className="mt-1 text-base font-bold text-slate-900">
                                        Recent leads
                                    </h2>

                                </div>


                                <a
                                    href="/admin/leads"
                                    className="text-xs font-bold text-sky-600 transition hover:text-sky-700"
                                >
                                    View all
                                </a>

                            </div>


                            <div className="p-5">

                                {loading ? (

                                    <div className="flex items-center justify-center py-10">

                                        <Loader2
                                            size={22}
                                            className="animate-spin text-slate-300"
                                        />

                                    </div>

                                ) : recentLeads.length === 0 ? (

                                    <div className="rounded-xl bg-slate-50 px-4 py-8 text-center">

                                        <Users
                                            size={22}
                                            className="mx-auto text-slate-300"
                                        />

                                        <p className="mt-3 text-sm font-semibold text-slate-600">
                                            No leads yet
                                        </p>

                                        <p className="mt-1 text-xs text-slate-400">
                                            New customer inquiries will appear here.
                                        </p>

                                    </div>

                                ) : (

                                    <div className="space-y-3">

                                        {recentLeads.map(
                                            (lead) => {

                                                const customer =
                                                    lead.customer;


                                                return (
                                                    <a
                                                        key={lead.id}
                                                        href="/admin/leads"
                                                        className="block rounded-xl border border-slate-200 p-4 transition hover:border-sky-200 hover:bg-sky-50/40"
                                                    >

                                                        <div className="flex items-center justify-between gap-4">

                                                            <div className="flex min-w-0 items-center gap-3">

                                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">

                                                                    {customer?.name
                                                                        ? customer.name
                                                                            .charAt(0)
                                                                            .toUpperCase()
                                                                        : "C"}

                                                                </div>


                                                                <div className="min-w-0">

                                                                    <p className="truncate text-sm font-bold text-slate-900">
                                                                        {customer?.name ||
                                                                            "Customer"}
                                                                    </p>

                                                                    <p className="mt-0.5 truncate text-xs text-slate-400">
                                                                        {formatService(
                                                                            lead.service
                                                                        )}
                                                                    </p>

                                                                </div>

                                                            </div>


                                                            <div className="flex shrink-0 flex-col items-end gap-1">

                                                                <span
                                                                    className={`rounded-full px-2 py-1 text-[10px] font-bold ${getUrgencyClass(
                                                                        lead.urgency
                                                                    )}`}
                                                                >
                                                                    {lead.urgency ||
                                                                        "NORMAL"}
                                                                </span>

                                                                <span className="text-[10px] text-slate-400">
                                                                    {getRelativeTime(
                                                                        lead.createdAt
                                                                    )}
                                                                </span>

                                                            </div>

                                                        </div>


                                                        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">

                                                            <span
                                                                className={`rounded-full px-2 py-1 text-[10px] font-bold ${getStatusClass(
                                                                    lead.status
                                                                )}`}
                                                            >
                                                                {String(
                                                                    lead.status ||
                                                                    "NEW"
                                                                ).replace(
                                                                    /_/g,
                                                                    " "
                                                                )}
                                                            </span>


                                                            <div className="flex items-center gap-1 text-[10px] font-medium text-slate-400">

                                                                <MapPin
                                                                    size={11}
                                                                />

                                                                {customer?.address ||
                                                                    "Address unavailable"}

                                                            </div>

                                                        </div>

                                                    </a>
                                                );
                                            }
                                        )}

                                    </div>

                                )}

                            </div>

                        </section>

                    </div>


                    {/* SYSTEM STATUS */}

                    <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">

                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                            <div>

                                <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                                    Receptionist status
                                </p>

                                <h2 className="mt-2 text-base font-bold text-slate-900">
                                    Your AI receptionist is handling customer inquiries
                                </h2>

                                <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">
                                    Customer conversations are being converted into qualified leads and appointment requests.
                                </p>

                            </div>


                            <div className="flex shrink-0 items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700">

                                <span className="h-2 w-2 rounded-full bg-emerald-500" />

                                Online

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </DashboardLayout>
    );
};


export default Dashboard;