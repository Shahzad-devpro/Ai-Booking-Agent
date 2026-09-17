import {
    Mail,
    Settings as SettingsIcon,
    User,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

const Settings = () => {

    const user = JSON.parse(
        localStorage.getItem("authUser") || "null"
    );

    return (
        <DashboardLayout
            activePath="/admin/settings"
        >
            <div className="min-h-screen">

                <div className="border-b border-slate-200 bg-white">
                    <div className="px-5 py-7 sm:px-8 lg:px-10">

                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-sky-600">
                            Workspace
                        </p>

                        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                            Settings
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            Manage your administrator account and business workspace.
                        </p>

                    </div>
                </div>


                <div className="space-y-5 px-5 py-6 sm:px-8 lg:px-10">

                    {/* ACCOUNT */}

                    <section className="rounded-2xl border border-slate-200 bg-white">

                        <div className="border-b border-slate-200 p-5">

                            <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                                    <User size={18} />
                                </div>

                                <div>
                                    <h2 className="text-sm font-bold text-slate-900">
                                        Administrator account
                                    </h2>

                                    <p className="mt-0.5 text-xs text-slate-400">
                                        Your authenticated workspace identity
                                    </p>
                                </div>

                            </div>

                        </div>


                        <div className="grid gap-5 p-5 sm:grid-cols-2">

                            <div>

                                <div className="mb-2 flex items-center gap-2">

                                    <User
                                        size={14}
                                        className="text-slate-400"
                                    />

                                    <label className="text-xs font-bold text-slate-500">
                                        Name
                                    </label>

                                </div>

                                <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-700">
                                    {user?.name || "Administrator"}
                                </div>

                            </div>


                            <div>

                                <div className="mb-2 flex items-center gap-2">

                                    <Mail
                                        size={14}
                                        className="text-slate-400"
                                    />

                                    <label className="text-xs font-bold text-slate-500">
                                        Email
                                    </label>

                                </div>

                                <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-700">
                                    {user?.email || "—"}
                                </div>

                            </div>

                        </div>

                    </section>


                    {/* BUSINESS */}

                    <section className="rounded-2xl border border-slate-200 bg-white">

                        <div className="border-b border-slate-200 p-5">

                            <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                                    <SettingsIcon size={18} />
                                </div>

                                <div>
                                    <h2 className="text-sm font-bold text-slate-900">
                                        Business configuration
                                    </h2>

                                    <p className="mt-0.5 text-xs text-slate-400">
                                        Business settings will be connected here.
                                    </p>
                                </div>

                            </div>

                        </div>


                        <div className="p-5">

                            <div className="rounded-xl bg-slate-50 p-4">

                                <p className="text-xs font-bold text-slate-600">
                                    AI receptionist configuration
                                </p>

                                <p className="mt-1 text-xs leading-5 text-slate-400">
                                    Business hours, timezone, services, technicians and receptionist behavior will be configurable here once the settings API is connected.
                                </p>

                            </div>

                        </div>

                    </section>

                </div>

            </div>
        </DashboardLayout>
    );
};

export default Settings;