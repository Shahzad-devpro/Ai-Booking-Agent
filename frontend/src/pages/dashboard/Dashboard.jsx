import { useEffect, useState } from "react";

import {
    Activity,
    AlertCircle,
    ArrowUpRight,
    CalendarDays,
    Clock3,
    Loader2,
    Users,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

import {
    getLeads,
} from "../../services/leadApi";


const Dashboard = () => {

    const user = JSON.parse(
        localStorage.getItem("authUser") || "null"
    );

    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        booked: 0,
    });

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    useEffect(() => {

        const loadStats = async () => {

            try {

                setLoading(true);

                const [
                    allLeads,
                    pendingLeads,
                    bookedLeads,
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

                ]);


                setStats({
                    total:
                        allLeads?.data?.total || 0,

                    pending:
                        pendingLeads?.data?.total || 0,

                    booked:
                        bookedLeads?.data?.total || 0,
                });

            } catch (err) {

                console.error(
                    "Failed to load dashboard stats:",
                    err
                );

                setError(
                    err.message ||
                    "Failed to load dashboard statistics"
                );

            } finally {

                setLoading(false);
            }
        };


        loadStats();

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