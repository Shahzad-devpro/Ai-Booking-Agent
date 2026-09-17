import {
    AlertCircle,
    CalendarDays,
    Mail,
    MapPin,
    Phone,
    User,
    X,
} from "lucide-react";

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

const getUrgencyClasses = (urgency) => {
    switch (urgency) {
        case "EMERGENCY":
            return "bg-red-50 text-red-700";

        case "HIGH":
            return "bg-orange-50 text-orange-700";

        default:
            return "bg-slate-100 text-slate-600";
    }
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

const formatDate = (date) => {
    if (!date) {
        return "—";
    }

    return new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    }).format(new Date(date));
};

const LeadDetails = ({
    lead,
    loading = false,
    onClose,
    onStatusChange,
    updatingStatus = false,
}) => {
    if (!lead && !loading) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-[60]">

            <button
                type="button"
                aria-label="Close lead details"
                onClick={onClose}
                className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px]"
            />

            <aside className="absolute right-0 top-0 flex h-full w-full max-w-xl flex-col bg-white shadow-2xl">

                {/* HEADER */}

                <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-5 py-5 sm:px-7">

                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-sky-600">
                            Lead details
                        </p>

                        <h2 className="mt-1 text-lg font-bold text-slate-950">
                            Customer inquiry
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    >
                        <X size={19} />
                    </button>

                </div>


                {/* BODY */}

                <div className="flex-1 overflow-y-auto">

                    {loading ? (
                        <div className="flex min-h-[400px] items-center justify-center">

                            <div className="text-sm font-semibold text-slate-400">
                                Loading lead...
                            </div>

                        </div>
                    ) : (
                        <div className="space-y-6 p-5 sm:p-7">

                            {/* CUSTOMER */}

                            <section>

                                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                                    Customer
                                </p>

                                <div className="rounded-2xl border border-slate-200 p-4">

                                    <div className="flex items-center gap-3">

                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sky-50 text-sm font-bold text-sky-700">
                                            {lead.customer?.name
                                                ?.charAt(0)
                                                ?.toUpperCase() || "?"}
                                        </div>

                                        <div className="min-w-0">
                                            <p className="font-bold text-slate-900">
                                                {lead.customer?.name || "Unknown customer"}
                                            </p>

                                            <p className="mt-0.5 text-xs text-slate-400">
                                                Customer
                                            </p>
                                        </div>

                                    </div>

                                    <div className="mt-4 grid gap-3 sm:grid-cols-2">

                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <Phone
                                                size={15}
                                                className="text-slate-400"
                                            />
                                            {lead.customer?.phone || "—"}
                                        </div>

                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <Mail
                                                size={15}
                                                className="text-slate-400"
                                            />
                                            <span className="truncate">
                                                {lead.customer?.email || "—"}
                                            </span>
                                        </div>

                                    </div>

                                </div>

                            </section>


                            {/* LEAD */}

                            <section>

                                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                                    Inquiry
                                </p>

                                <div className="space-y-4 rounded-2xl border border-slate-200 p-4">

                                    <div className="flex flex-wrap items-center gap-2">

                                        <span className="rounded-lg bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-600">
                                            {formatService(lead.service)}
                                        </span>

                                        <span
                                            className={`rounded-lg px-3 py-1.5 text-xs font-bold ${getUrgencyClasses(
                                                lead.urgency
                                            )}`}
                                        >
                                            {lead.urgency || "NORMAL"}
                                        </span>

                                    </div>


                                    <div>

                                        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                                            Problem description
                                        </p>

                                        <p className="mt-2 text-sm leading-6 text-slate-700">
                                            {lead.problemDescription || "No description provided."}
                                        </p>

                                    </div>

                                </div>

                            </section>


                            {/* ADDRESS */}

                            <section>

                                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                                    Location
                                </p>

                                <div className="flex gap-3 rounded-2xl border border-slate-200 p-4">

                                    <MapPin
                                        size={18}
                                        className="mt-0.5 shrink-0 text-sky-500"
                                    />

                                    <p className="text-sm leading-6 text-slate-600">
                                        {lead.customer?.address || "No address provided."}
                                    </p>

                                </div>

                            </section>


                            {/* STATUS */}

                            <section>

                                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                                    Lead status
                                </p>

                                <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">

                                    <span
                                        className={`inline-flex w-fit rounded-full px-3 py-1.5 text-xs font-bold ${getStatusClasses(
                                            lead.status
                                        )}`}
                                    >
                                        {lead.status?.replace(/_/g, " ")}
                                    </span>

                                    <select
                                        value={lead.status || ""}
                                        disabled={updatingStatus}
                                        onChange={(event) =>
                                            onStatusChange(
                                                event.target.value
                                            )
                                        }
                                        className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-600 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        <option value="NEW">
                                            New
                                        </option>

                                        <option value="AI_QUALIFIED">
                                            AI Qualified
                                        </option>

                                        <option value="CONTACTED">
                                            Contacted
                                        </option>

                                        <option value="BOOKED">
                                            Booked
                                        </option>

                                        <option value="CANCELLED">
                                            Cancelled
                                        </option>
                                    </select>

                                </div>

                            </section>


                            {/* META */}

                            <section>

                                <div className="grid gap-3 sm:grid-cols-2">

                                    <div className="rounded-2xl bg-slate-50 p-4">

                                        <div className="flex items-center gap-2 text-slate-400">
                                            <CalendarDays size={15} />

                                            <span className="text-[10px] font-bold uppercase tracking-[0.12em]">
                                                Created
                                            </span>
                                        </div>

                                        <p className="mt-2 text-sm font-semibold text-slate-700">
                                            {formatDate(lead.createdAt)}
                                        </p>

                                    </div>


                                    <div className="rounded-2xl bg-slate-50 p-4">

                                        <div className="flex items-center gap-2 text-slate-400">
                                            <User size={15} />

                                            <span className="text-[10px] font-bold uppercase tracking-[0.12em]">
                                                Lead ID
                                            </span>
                                        </div>

                                        <p className="mt-2 truncate text-xs font-medium text-slate-500">
                                            {lead.id}
                                        </p>

                                    </div>

                                </div>

                            </section>

                        </div>
                    )}

                </div>


                {/* FOOTER */}

                {!loading && lead && (
                    <div className="shrink-0 border-t border-slate-200 bg-white p-4">

                        <div className="flex items-center gap-2 text-xs text-slate-400">

                            <AlertCircle size={14} />

                            Changes to lead status are saved immediately.

                        </div>

                    </div>
                )}

            </aside>
        </div>
    );
};

export default LeadDetails;