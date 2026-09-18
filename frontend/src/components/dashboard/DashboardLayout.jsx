import React from "react";
import {
    CalendarDays,
    ChevronRight,
    LayoutDashboard,
    LogOut,
    Menu,
    Settings,
    UserRound,
    Users,
    X,
} from "lucide-react";

import Logo from "../ui/Logo";
import NotificationCenter from "../NotificationCenter";


const navigationItems = [
    {
        label: "Overview",
        path: "/admin",
        icon: LayoutDashboard,
    },
    {
        label: "Leads",
        path: "/admin/leads",
        icon: Users,
    },
    {
        label: "Appointments",
        path: "/admin/appointments",
        icon: CalendarDays,
    },
    {
        label: "Customers",
        path: "/admin/customers",
        icon: UserRound,
    },
];

const bottomNavigationItems = [
    {
        label: "Settings",
        path: "/admin/settings",
        icon: Settings,
    },
];


const DashboardLayout = ({
    children,
    activePath = "/admin",
}) => {

    const [
        mobileOpen,
        setMobileOpen
    ] = React.useState(false);


    const user = JSON.parse(
        localStorage.getItem("authUser") || "null"
    );


    const handleLogout = () => {

        localStorage.removeItem(
            "authToken"
        );

        localStorage.removeItem(
            "authUser"
        );

        window.location.href =
            "/admin/login";
    };


    const isActive = (path) => {

        if (path === "/admin") {
            return activePath === "/admin";
        }

        return activePath.startsWith(path);
    };


    const sidebarContent = (
        <div className="flex h-full flex-col">

            {/* BRAND */}

            <div className="flex h-20 shrink-0 items-center border-b border-slate-200 px-5">
                <Logo />
            </div>


            {/* NAVIGATION */}

            <div className="flex-1 overflow-y-auto px-3 py-5">

                <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                    Workspace
                </p>


                <nav className="space-y-1">

                    {navigationItems.map((item) => {

                        const Icon =
                            item.icon;

                        const active =
                            isActive(
                                item.path
                            );


                        return (
                            <a
                                key={item.path}
                                href={item.path}
                                onClick={() =>
                                    setMobileOpen(
                                        false
                                    )
                                }
                                className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                                    active
                                        ? "bg-sky-50 text-sky-700"
                                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                }`}
                            >

                                <Icon
                                    size={18}
                                    strokeWidth={
                                        active
                                            ? 2.3
                                            : 2
                                    }
                                    className={
                                        active
                                            ? "text-sky-600"
                                            : "text-slate-400 group-hover:text-slate-600"
                                    }
                                />


                                <span className="flex-1">
                                    {item.label}
                                </span>


                                {active && (
                                    <ChevronRight
                                        size={15}
                                        className="text-sky-400"
                                    />
                                )}

                            </a>
                        );
                    })}

                </nav>


                <p className="mb-3 mt-8 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                    Management
                </p>


                <nav className="space-y-1">

                    {bottomNavigationItems.map(
                        (item) => {

                            const Icon =
                                item.icon;

                            const active =
                                isActive(
                                    item.path
                                );


                            return (
                                <a
                                    key={item.path}
                                    href={item.path}
                                    onClick={() =>
                                        setMobileOpen(
                                            false
                                        )
                                    }
                                    className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                                        active
                                            ? "bg-sky-50 text-sky-700"
                                            : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                    }`}
                                >

                                    <Icon
                                        size={18}
                                        strokeWidth={
                                            active
                                                ? 2.3
                                                : 2
                                        }
                                        className={
                                            active
                                                ? "text-sky-600"
                                                : "text-slate-400 group-hover:text-slate-600"
                                        }
                                    />


                                    <span className="flex-1">
                                        {item.label}
                                    </span>


                                    {active && (
                                        <ChevronRight
                                            size={15}
                                            className="text-sky-400"
                                        />
                                    )}

                                </a>
                            );
                        }
                    )}

                </nav>

            </div>


            {/* USER / LOGOUT */}

            <div className="shrink-0 border-t border-slate-200 p-3">

                <div className="mb-2 flex items-center gap-3 rounded-xl px-3 py-2.5">

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sm font-bold text-sky-700">

                        {user?.name
                            ? user.name
                                  .charAt(0)
                                  .toUpperCase()
                            : "A"}

                    </div>


                    <div className="min-w-0 flex-1">

                        <p className="truncate text-xs font-bold text-slate-800">
                            {user?.name ||
                                "Administrator"}
                        </p>

                        <p className="truncate text-[10px] text-slate-400">
                            {user?.role ||
                                "ADMIN"}
                        </p>

                    </div>

                </div>


                <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                >

                    <LogOut size={17} />

                    <span>
                        Sign out
                    </span>

                </button>

            </div>

        </div>
    );


    return (
        <div className="min-h-screen bg-slate-50">

            {/* DESKTOP SIDEBAR */}

            <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-slate-200 bg-white lg:block">
                {sidebarContent}
            </aside>


            {/* MOBILE HEADER */}

            <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:hidden">

                <Logo compact />

                <div className="flex items-center gap-2">

                    <NotificationCenter />

                    <button
                        type="button"
                        onClick={() =>
                            setMobileOpen(
                                true
                            )
                        }
                        className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100"
                        aria-label="Open navigation"
                    >
                        <Menu size={21} />
                    </button>

                </div>

            </header>


            {/* DESKTOP NOTIFICATION BAR */}

            <div className="fixed right-0 top-0 z-30 hidden h-20 items-center px-6 lg:flex">

                <NotificationCenter />

            </div>


            {/* MOBILE SIDEBAR */}

            {mobileOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">

                    <button
                        type="button"
                        aria-label="Close navigation"
                        onClick={() =>
                            setMobileOpen(
                                false
                            )
                        }
                        className="absolute inset-0 bg-slate-950/40"
                    />


                    <aside className="relative h-full w-72 max-w-[85vw] bg-white shadow-xl">

                        <button
                            type="button"
                            onClick={() =>
                                setMobileOpen(
                                    false
                                )
                            }
                            className="absolute right-4 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
                            aria-label="Close navigation"
                        >
                            <X size={19} />
                        </button>


                        {sidebarContent}

                    </aside>

                </div>
            )}


            {/* MAIN */}

            <main className="min-h-screen lg:pl-64">
                {children}
            </main>

        </div>
    );
};


export default DashboardLayout;