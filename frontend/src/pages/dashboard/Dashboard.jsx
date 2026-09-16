import {
    Activity,
    ArrowUpRight,
    CalendarDays,
    Clock3,
    Users,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

const Dashboard = () => {
    const user = JSON.parse(
        localStorage.getItem("authUser") || "null"
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
                                    Here's what's happening
                                    with your service business.
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

                {/* CONTENT */}
                <div className="px-5 py-6 sm:px-8 lg:px-10">

                    {/* STAT CARDS */}
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                        <div className="rounded-2xl border border-slate-200 bg-white p-5">
                            <div className="flex items-center justify-between">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                                    <Users size={19} />
                                </div>

                                <ArrowUpRight
                                    size={17}
                                    className="text-slate-300"
                                />
                            </div>

                            <p className="mt-5 text-xs font-semibold text-slate-400">
                                Total leads
                            </p>

                            <p className="mt-1 text-2xl font-bold text-slate-900">
                                —
                            </p>

                            <p className="mt-1 text-[11px] text-slate-400">
                                Connected to live data soon
                            </p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-5">
                            <div className="flex items-center justify-between">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                    <CalendarDays size={19} />
                                </div>

                                <ArrowUpRight
                                    size={17}
                                    className="text-slate-300"
                                />
                            </div>

                            <p className="mt-5 text-xs font-semibold text-slate-400">
                                Appointments
                            </p>

                            <p className="mt-1 text-2xl font-bold text-slate-900">
                                —
                            </p>

                            <p className="mt-1 text-[11px] text-slate-400">
                                Connected to live data soon
                            </p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-5">
                            <div className="flex items-center justify-between">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                                    <Clock3 size={19} />
                                </div>

                                <ArrowUpRight
                                    size={17}
                                    className="text-slate-300"
                                />
                            </div>

                            <p className="mt-5 text-xs font-semibold text-slate-400">
                                Pending leads
                            </p>

                            <p className="mt-1 text-2xl font-bold text-slate-900">
                                —
                            </p>

                            <p className="mt-1 text-[11px] text-slate-400">
                                Connected to live data soon
                            </p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-5">
                            <div className="flex items-center justify-between">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                                    <Activity size={19} />
                                </div>

                                <ArrowUpRight
                                    size={17}
                                    className="text-slate-300"
                                />
                            </div>

                            <p className="mt-5 text-xs font-semibold text-slate-400">
                                AI activity
                            </p>

                            <p className="mt-1 text-2xl font-bold text-slate-900">
                                Active
                            </p>

                            <p className="mt-1 text-[11px] text-slate-400">
                                Receptionist is online
                            </p>
                        </div>
                    </div>

                    {/* EMPTY STATE */}
                    <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center sm:p-12">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
                            <Users size={21} />
                        </div>

                        <h2 className="mt-4 text-base font-bold text-slate-900">
                            Your business workspace
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                            Your AI receptionist is already
                            capturing customer requests. The
                            Leads workspace will bring those
                            conversations into one place.
                        </p>

                        <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-500">
                            <Clock3 size={13} />

                            Leads module coming next
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Dashboard;

