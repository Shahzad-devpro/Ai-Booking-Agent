
import { useEffect, useState } from "react";

import {
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    Filter,
    Loader2,
    Search,
    Users,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

import {
    getLeads,
} from "../../services/leadApi";


const STATUS_OPTIONS = [
    {
        value: "",
        label: "All statuses",
    },
    {
        value: "NEW",
        label: "New",
    },
    {
        value: "AI_QUALIFIED",
        label: "AI Qualified",
    },
    {
        value: "CONTACTED",
        label: "Contacted",
    },
    {
        value: "BOOKED",
        label: "Booked",
    },
    {
        value: "CANCELLED",
        label: "Cancelled",
    },
];


const URGENCY_OPTIONS = [
    {
        value: "",
        label: "All urgency",
    },
    {
        value: "NORMAL",
        label: "Normal",
    },
    {
        value: "HIGH",
        label: "High",
    },
    {
        value: "EMERGENCY",
        label: "Emergency",
    },
];


const formatService = (service) => {

    if (!service) {
        return "—";
    }

    return service
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (letter) =>
            letter.toUpperCase()
        );
};


const formatDate = (date) => {

    if (!date) {
        return "—";
    }

    return new Intl.DateTimeFormat(
        "en-US",
        {
            month: "short",
            day: "numeric",
            year: "numeric",
        }
    ).format(new Date(date));
};


const getStatusClasses = (status) => {

    switch (status) {

        case "NEW":
            return "bg-sky-50 text-sky-700";

        case "AI_QUALIFIED":
            return "bg-violet-50 text-violet-700";

        case "CONTACTED":
            return "bg-amber-50 text-amber-700";

        case "BOOKED":
            return "bg-emerald-50 text-emerald-700";

        case "CANCELLED":
            return "bg-slate-100 text-slate-600";

        default:
            return "bg-slate-100 text-slate-600";
    }
};


const getUrgencyClasses = (urgency) => {

    switch (urgency) {

        case "EMERGENCY":
            return "bg-red-50 text-red-700";

        case "HIGH":
            return "bg-orange-50 text-orange-700";

        case "NORMAL":
            return "bg-slate-100 text-slate-600";

        default:
            return "bg-slate-100 text-slate-600";
    }
};


const Leads = () => {

    const [leads, setLeads] = useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [status, setStatus] =
        useState("");

    const [urgency, setUrgency] =
        useState("");

    const [page, setPage] =
        useState(1);

    const [pagination, setPagination] =
        useState({
            total: 0,
            page: 1,
            limit: 10,
            totalPages: 1,
        });


    const fetchLeads = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await getLeads({
                    status,
                    urgency,
                    page,
                    limit: 10,
                });

            setLeads(
                response?.data?.leads || []
            );

            setPagination({
                total:
                    response?.data?.total || 0,

                page:
                    response?.data?.page || page,

                limit:
                    response?.data?.limit || 10,

                totalPages:
                    response?.data?.totalPages || 1,
            });

        } catch (err) {

            console.error(
                "Failed to fetch leads:",
                err
            );

            setError(
                err.message ||
                "Failed to load leads"
            );

        } finally {

            setLoading(false);
        }
    };


    useEffect(() => {
        fetchLeads();
    }, [status, urgency, page]);


    const handleStatusChange = (value) => {
        setStatus(value);
        setPage(1);
    };


    const handleUrgencyChange = (value) => {
        setUrgency(value);
        setPage(1);
    };


    const handlePreviousPage = () => {

        if (page <= 1) {
            return;
        }

        setPage(
            (currentPage) =>
                currentPage - 1
        );
    };


    const handleNextPage = () => {

        if (
            page >=
            pagination.totalPages
        ) {
            return;
        }

        setPage(
            (currentPage) =>
                currentPage + 1
        );
    };


    return (
        <DashboardLayout
            activePath="/admin/leads"
        >
            <div className="min-h-screen">

                {/* PAGE HEADER */}

                <div className="border-b border-slate-200 bg-white">

                    <div className="px-5 py-7 sm:px-8 lg:px-10">

                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

                            <div>

                                <p className="text-xs font-bold uppercase tracking-[0.16em] text-sky-600">
                                    Lead management
                                </p>

                                <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                                    Leads
                                </h1>

                                <p className="mt-1 max-w-xl text-sm text-slate-500">
                                    Manage customer inquiries captured by your AI receptionist.
                                </p>

                            </div>

                            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">

                                <Users
                                    size={15}
                                    className="text-sky-500"
                                />

                                {pagination.total}{" "}
                                total leads

                            </div>

                        </div>

                    </div>

                </div>


                {/* CONTENT */}

                <div className="px-5 py-6 sm:px-8 lg:px-10">

                    {/* FILTERS */}

                    <div className="rounded-2xl border border-slate-200 bg-white p-4">

                        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">

                            <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">

                                <Search
                                    size={17}
                                    className="text-slate-400"
                                />

                                <span className="text-sm text-slate-400">
                                    Search will be added in the next step
                                </span>

                            </div>


                            <div className="flex items-center gap-2">

                                <div className="hidden items-center gap-2 text-xs font-semibold text-slate-400 sm:flex">
                                    <Filter size={15} />
                                    Filters
                                </div>


                                <select
                                    value={status}
                                    onChange={(event) =>
                                        handleStatusChange(
                                            event.target.value
                                        )
                                    }
                                    className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-600 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                                >
                                    {STATUS_OPTIONS.map(
                                        (option) => (
                                            <option
                                                key={
                                                    option.value
                                                }
                                                value={
                                                    option.value
                                                }
                                            >
                                                {
                                                    option.label
                                                }
                                            </option>
                                        )
                                    )}
                                </select>


                                <select
                                    value={urgency}
                                    onChange={(event) =>
                                        handleUrgencyChange(
                                            event.target.value
                                        )
                                    }
                                    className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-600 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                                >
                                    {URGENCY_OPTIONS.map(
                                        (option) => (
                                            <option
                                                key={
                                                    option.value
                                                }
                                                value={
                                                    option.value
                                                }
                                            >
                                                {
                                                    option.label
                                                }
                                            </option>
                                        )
                                    )}
                                </select>

                            </div>

                        </div>

                    </div>


                    {/* ERROR */}

                    {error && (
                        <div className="mt-4 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">

                            <AlertCircle
                                size={18}
                                className="mt-0.5 shrink-0 text-red-500"
                            />

                            <div>

                                <p className="text-sm font-bold text-red-700">
                                    Unable to load leads
                                </p>

                                <p className="mt-1 text-xs text-red-600">
                                    {error}
                                </p>

                            </div>

                        </div>
                    )}


                    {/* TABLE */}

                    <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white">

                        {loading ? (

                            <div className="flex min-h-[360px] items-center justify-center">

                                <div className="flex items-center gap-3 text-sm font-semibold text-slate-500">

                                    <Loader2
                                        size={19}
                                        className="animate-spin text-sky-500"
                                    />

                                    Loading leads...

                                </div>

                            </div>

                        ) : leads.length === 0 ? (

                            <div className="flex min-h-[360px] flex-col items-center justify-center px-6 text-center">

                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">

                                    <Users size={23} />

                                </div>

                                <h2 className="mt-4 text-base font-bold text-slate-900">
                                    No leads found
                                </h2>

                                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                                    Try changing your filters or wait for your AI receptionist to capture a new customer inquiry.
                                </p>

                            </div>

                        ) : (

                            <>

                                {/* DESKTOP TABLE */}

                                <div className="hidden overflow-x-auto md:block">

                                    <table className="w-full min-w-[850px]">

                                        <thead className="border-b border-slate-200 bg-slate-50">

                                            <tr>

                                                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                                                    Customer
                                                </th>

                                                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                                                    Service
                                                </th>

                                                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                                                    Urgency
                                                </th>

                                                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                                                    Status
                                                </th>

                                                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                                                    Created
                                                </th>

                                            </tr>

                                        </thead>


                                        <tbody className="divide-y divide-slate-100">

                                            {leads.map(
                                                (lead) => (

                                                    <tr
                                                        key={
                                                            lead.id
                                                        }
                                                        className="transition hover:bg-slate-50"
                                                    >

                                                        <td className="px-5 py-4">

                                                            <div className="flex items-center gap-3">

                                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-50 text-xs font-bold text-sky-700">
                                                                    {lead
                                                                        .customer
                                                                        ?.name
                                                                        ?.charAt(
                                                                            0
                                                                        )
                                                                        ?.toUpperCase() ||
                                                                        "?"}
                                                                </div>

                                                                <div className="min-w-0">

                                                                    <p className="truncate text-sm font-bold text-slate-800">
                                                                        {
                                                                            lead
                                                                                .customer
                                                                                ?.name
                                                                        }
                                                                    </p>

                                                                    <p className="truncate text-xs text-slate-400">
                                                                        {
                                                                            lead
                                                                                .customer
                                                                                ?.phone
                                                                        }
                                                                    </p>

                                                                </div>

                                                            </div>

                                                        </td>


                                                        <td className="px-5 py-4">

                                                            <span className="text-sm font-semibold text-slate-700">
                                                                {formatService(
                                                                    lead.service
                                                                )}
                                                            </span>

                                                        </td>


                                                        <td className="px-5 py-4">

                                                            <span
                                                                className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${getUrgencyClasses(
                                                                    lead.urgency
                                                                )}`}
                                                            >
                                                                {
                                                                    lead.urgency
                                                                }
                                                            </span>

                                                        </td>


                                                        <td className="px-5 py-4">

                                                            <span
                                                                className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${getStatusClasses(
                                                                    lead.status
                                                                )}`}
                                                            >
                                                                {lead.status
                                                                    ?.replace(
                                                                        /_/g,
                                                                        " "
                                                                    )}
                                                            </span>

                                                        </td>


                                                        <td className="px-5 py-4 text-sm font-medium text-slate-500">

                                                            {formatDate(
                                                                lead.createdAt
                                                            )}

                                                        </td>

                                                    </tr>

                                                )
                                            )}

                                        </tbody>

                                    </table>

                                </div>


                                {/* MOBILE CARDS */}

                                <div className="divide-y divide-slate-100 md:hidden">

                                    {leads.map(
                                        (lead) => (

                                            <div
                                                key={
                                                    lead.id
                                                }
                                                className="p-4"
                                            >

                                                <div className="flex items-start justify-between gap-3">

                                                    <div className="flex min-w-0 items-center gap-3">

                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-50 text-sm font-bold text-sky-700">

                                                            {lead
                                                                .customer
                                                                ?.name
                                                                ?.charAt(
                                                                    0
                                                                )
                                                                ?.toUpperCase() ||
                                                                "?"}

                                                        </div>

                                                        <div className="min-w-0">

                                                            <p className="truncate text-sm font-bold text-slate-800">
                                                                {
                                                                    lead
                                                                        .customer
                                                                        ?.name
                                                                }
                                                            </p>

                                                            <p className="truncate text-xs text-slate-400">
                                                                {
                                                                    lead
                                                                        .customer
                                                                        ?.phone
                                                                }
                                                            </p>

                                                        </div>

                                                    </div>


                                                    <span
                                                        className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${getStatusClasses(
                                                            lead.status
                                                        )}`}
                                                    >
                                                        {lead.status
                                                            ?.replace(
                                                                /_/g,
                                                                " "
                                                            )}
                                                    </span>

                                                </div>


                                                <div className="mt-4 flex flex-wrap items-center gap-2">

                                                    <span className="rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-600">
                                                        {formatService(
                                                            lead.service
                                                        )}
                                                    </span>

                                                    <span
                                                        className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold ${getUrgencyClasses(
                                                            lead.urgency
                                                        )}`}
                                                    >
                                                        {
                                                            lead.urgency
                                                        }
                                                    </span>

                                                    <span className="text-xs text-slate-400">
                                                        {formatDate(
                                                            lead.createdAt
                                                        )}
                                                    </span>

                                                </div>

                                            </div>

                                        )
                                    )}

                                </div>

                            </>

                        )}

                    </div>


                    {/* PAGINATION */}

                    {!loading &&
                        leads.length > 0 && (
                            <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">

                                <p className="text-xs font-medium text-slate-400">

                                    Showing{" "}

                                    <span className="font-bold text-slate-600">
                                        {(page - 1) *
                                            pagination.limit +
                                            1}
                                    </span>

                                    {" "}–{" "}

                                    <span className="font-bold text-slate-600">
                                        {Math.min(
                                            page *
                                                pagination.limit,
                                            pagination.total
                                        )}
                                    </span>

                                    {" "}of{" "}

                                    <span className="font-bold text-slate-600">
                                        {
                                            pagination.total
                                        }
                                    </span>

                                </p>


                                <div className="flex items-center gap-2">

                                    <button
                                        type="button"
                                        onClick={
                                            handlePreviousPage
                                        }
                                        disabled={
                                            page <=
                                            1
                                        }
                                        className="flex h-9 items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        <ChevronLeft
                                            size={15}
                                        />
                                        Previous
                                    </button>


                                    <span className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600">
                                        Page {page} of{" "}
                                        {
                                            pagination.totalPages
                                        }
                                    </span>


                                    <button
                                        type="button"
                                        onClick={
                                            handleNextPage
                                        }
                                        disabled={
                                            page >=
                                            pagination.totalPages
                                        }
                                        className="flex h-9 items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        Next
                                        <ChevronRight
                                            size={15}
                                        />
                                    </button>

                                </div>

                            </div>
                        )}

                </div>

            </div>
        </DashboardLayout>
    );
};


export default Leads;

