import {
    useEffect,
    useState
} from "react";

import {
    AlertCircle,
    Ban,
    CalendarDays,
    Check,
    Clock3,
    Mail,
    MapPin,
    Phone,
    RefreshCw,
    Save,
    User,
    Wrench,
    X
} from "lucide-react";


const BUSINESS_TIMEZONE =
    "America/New_York";


// ============================================================
// FORMATTING
// ============================================================

const formatDateTime =
    date => {

        if (!date) {
            return "—";
        }

        return new Intl.DateTimeFormat(
            "en-US",
            {
                timeZone:
                    BUSINESS_TIMEZONE,

                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",

                hour: "numeric",
                minute: "2-digit"
            }
        ).format(
            new Date(date)
        );
    };


const formatDate =
    date => {

        if (!date) {
            return "—";
        }

        return new Intl.DateTimeFormat(
            "en-US",
            {
                timeZone:
                    BUSINESS_TIMEZONE,

                month: "short",
                day: "numeric",
                year: "numeric"
            }
        ).format(
            new Date(date)
        );
    };


const formatTime =
    date => {

        if (!date) {
            return "—";
        }

        return new Intl.DateTimeFormat(
            "en-US",
            {
                timeZone:
                    BUSINESS_TIMEZONE,

                hour: "numeric",
                minute: "2-digit"
            }
        ).format(
            new Date(date)
        );
    };


const formatService =
    service => {

        if (!service) {
            return "—";
        }

        return service
            .replace(/_/g, " ")
            .toLowerCase()
            .replace(
                /\b\w/g,
                letter =>
                    letter.toUpperCase()
            );
    };


// ============================================================
// STATUS
// ============================================================

const getStatusConfig =
    status => {

        switch (status) {

            case "BOOKED":
                return {
                    label: "Booked",
                    classes:
                        "border-emerald-200 bg-emerald-50 text-emerald-700",
                    dot:
                        "bg-emerald-500"
                };

            case "COMPLETED":
                return {
                    label: "Completed",
                    classes:
                        "border-violet-200 bg-violet-50 text-violet-700",
                    dot:
                        "bg-violet-500"
                };

            case "CANCELLED":
                return {
                    label: "Cancelled",
                    classes:
                        "border-slate-200 bg-slate-100 text-slate-600",
                    dot:
                        "bg-slate-400"
                };

            default:
                return {
                    label: status || "Unknown",
                    classes:
                        "border-slate-200 bg-slate-100 text-slate-600",
                    dot:
                        "bg-slate-400"
                };
        }
    };


// ============================================================
// NEW YORK DATE / TIME
// ============================================================

const getNewYorkDate =
    date => {

        if (!date) {
            return "";
        }

        return new Intl.DateTimeFormat(
            "en-CA",
            {
                timeZone:
                    BUSINESS_TIMEZONE,

                year: "numeric",
                month: "2-digit",
                day: "2-digit"
            }
        ).format(
            new Date(date)
        );
    };


const getNewYorkTime =
    date => {

        if (!date) {
            return "";
        }

        const formatter =
            new Intl.DateTimeFormat(
                "en-US",
                {
                    timeZone:
                        BUSINESS_TIMEZONE,

                    hour: "2-digit",
                    minute: "2-digit",

                    hour12: false
                }
            );

        let value =
            formatter.format(
                new Date(date)
            );

        if (value === "24:00") {
            value = "00:00";
        }

        return value;
    };


// ============================================================
// IMPORTANT
// Convert New York wall-clock time into a real ISO instant.
// Browser timezone is deliberately ignored.
// ============================================================

const newYorkWallTimeToISO =
    (
        date,
        time
    ) => {

        if (
            !date ||
            !time
        ) {
            return null;
        }

        const wallClockAsUTC =
            new Date(
                `${date}T${time}:00Z`
            );

        if (
            Number.isNaN(
                wallClockAsUTC.getTime()
            )
        ) {
            return null;
        }

        const formatter =
            new Intl.DateTimeFormat(
                "en-US",
                {
                    timeZone:
                        BUSINESS_TIMEZONE,

                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",

                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",

                    hour12: false
                }
            );

        const parts =
            formatter.formatToParts(
                wallClockAsUTC
            );

        const values = {};

        parts.forEach(
            part => {

                if (
                    part.type !==
                    "literal"
                ) {
                    values[
                        part.type
                    ] =
                        part.value;
                }
            }
        );

        let targetHour =
            values.hour;

        if (
            targetHour === "24"
        ) {
            targetHour = "00";
        }

        const targetAsUTC =
            Date.UTC(
                Number(values.year),
                Number(values.month) - 1,
                Number(values.day),
                Number(targetHour),
                Number(values.minute),
                Number(values.second)
            );

        const offset =
            targetAsUTC -
            wallClockAsUTC.getTime();

        return new Date(
            wallClockAsUTC.getTime() -
            offset
        ).toISOString();
    };


// ============================================================
// REUSABLE UI
// ============================================================

const SectionHeader = ({
    icon: Icon,
    title,
    description
}) => {

    return (
        <div className="mb-3 flex items-center gap-3">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                <Icon
                    size={17}
                    strokeWidth={2.2}
                />
            </div>

            <div>

                <h3 className="text-sm font-extrabold text-slate-900">
                    {title}
                </h3>

                {description && (
                    <p className="mt-0.5 text-[11px] font-medium text-slate-400">
                        {description}
                    </p>
                )}

            </div>

        </div>
    );
};


const InfoRow = ({
    icon: Icon,
    children
}) => {

    return (
        <div className="flex items-start gap-3">

            <Icon
                size={15}
                className="mt-0.5 shrink-0 text-slate-400"
            />

            <div className="min-w-0 text-sm text-slate-600">
                {children}
            </div>

        </div>
    );
};


// ============================================================
// COMPONENT
// ============================================================

const AppointmentDetails = ({
    appointment,
    loading,
    technicians = [],
    onClose,
    onCancel,
    onReschedule,
    onAssignTechnician,
    cancelling,
    rescheduling,
    assigning
}) => {

    const [
        showReschedule,
        setShowReschedule
    ] = useState(false);


    const [
        rescheduleDate,
        setRescheduleDate
    ] = useState("");


    const [
        rescheduleTime,
        setRescheduleTime
    ] = useState("");


    const [
        selectedTechnicianId,
        setSelectedTechnicianId
    ] = useState("");


    useEffect(() => {

        if (!appointment) {
            return;
        }

        setRescheduleDate(
            getNewYorkDate(
                appointment.startTime
            )
        );

        setRescheduleTime(
            getNewYorkTime(
                appointment.startTime
            )
        );

        setSelectedTechnicianId(
            appointment.technician?.id ||
            ""
        );

        setShowReschedule(
            false
        );

    }, [appointment]);


    // ============================================================
    // RESCHEDULE
    // ============================================================

    const handleReschedule =
        async () => {

            const startTime =
                newYorkWallTimeToISO(
                    rescheduleDate,
                    rescheduleTime
                );

            if (!startTime) {
                return;
            }

            const start =
                new Date(
                    startTime
                );

            const end =
                new Date(
                    start.getTime() +
                    60 *
                    60 *
                    1000
                );

            await onReschedule(
                start.toISOString(),
                end.toISOString()
            );
        };


    // ============================================================
    // TECHNICIAN
    // ============================================================

    const handleAssignTechnician =
        async () => {

            if (
                !selectedTechnicianId
            ) {
                return;
            }

            if (
                selectedTechnicianId ===
                appointment?.technician?.id
            ) {
                return;
            }

            await onAssignTechnician(
                selectedTechnicianId
            );
        };


    const status =
        getStatusConfig(
            appointment?.status
        );


    return (
        <div className="fixed inset-0 z-50">

            {/* BACKDROP */}

            <div
                className="absolute inset-0 bg-slate-950/45 backdrop-blur-[3px]"
                onClick={onClose}
            />


            {/* DRAWER */}

            <aside className="absolute right-0 top-0 flex h-full w-full max-w-xl flex-col overflow-hidden border-l border-slate-200 bg-white shadow-2xl">


                {/* ==================================================
                    HEADER
                ================================================== */}

                <div className="relative shrink-0 overflow-hidden border-b border-slate-200 bg-white">

                    {/* Decorative background */}

                    <div className="pointer-events-none absolute right-0 top-0 h-32 w-48 rounded-bl-full bg-sky-50/80" />

                    <div className="relative flex items-start justify-between gap-4 px-5 py-5 sm:px-6">

                        <div className="flex min-w-0 items-center gap-3">

                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sky-600 text-white shadow-lg shadow-sky-600/20">

                                <CalendarDays
                                    size={21}
                                    strokeWidth={2}
                                />

                            </div>


                            <div className="min-w-0">

                                <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-sky-600">
                                    Appointment
                                </p>

                                <h2 className="mt-0.5 truncate text-lg font-extrabold tracking-tight text-slate-950">
                                    Appointment details
                                </h2>

                            </div>

                        </div>


                        <button
                            type="button"
                            onClick={onClose}
                            className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700"
                        >
                            <X size={18} />
                        </button>

                    </div>

                </div>


                {/* ==================================================
                    BODY
                ================================================== */}

                <div className="min-h-0 flex-1 overflow-y-auto">

                    {loading ? (

                        <div className="flex min-h-[500px] items-center justify-center">

                            <div className="flex flex-col items-center">

                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50">

                                    <CalendarDays
                                        size={22}
                                        className="animate-pulse text-sky-600"
                                    />

                                </div>

                                <p className="mt-3 text-sm font-semibold text-slate-500">
                                    Loading appointment...
                                </p>

                            </div>

                        </div>

                    ) : appointment ? (

                        <div className="space-y-6 p-5 sm:p-6">


                            {/* ==================================================
                                HERO SUMMARY
                            ================================================== */}

                            <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 p-5 text-white shadow-lg">

                                <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-sky-400/10 blur-2xl" />

                                <div className="relative">

                                    <div className="flex items-start justify-between gap-4">

                                        <div>

                                            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                                                Appointment status
                                            </p>

                                            <span
                                                className={`mt-2 inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide ${status.classes}`}
                                            >

                                                <span
                                                    className={`h-1.5 w-1.5 rounded-full ${status.dot}`}
                                                />

                                                {status.label}

                                            </span>

                                        </div>


                                        <div className="text-right">

                                            <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-500">
                                                ID
                                            </p>

                                            <p className="mt-1 max-w-[150px] truncate text-[10px] font-semibold text-slate-300">
                                                {appointment.id}
                                            </p>

                                        </div>

                                    </div>


                                    <div className="mt-6">

                                        <p className="text-xs font-medium text-slate-400">
                                            Scheduled for
                                        </p>

                                        <p className="mt-1 text-xl font-extrabold tracking-tight">
                                            {formatDate(
                                                appointment.startTime
                                            )}
                                        </p>

                                        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-300">

                                            <Clock3
                                                size={15}
                                                className="text-sky-400"
                                            />

                                            <span>
                                                {formatTime(
                                                    appointment.startTime
                                                )}
                                            </span>

                                            <span className="text-slate-600">
                                                —
                                            </span>

                                            <span>
                                                {formatTime(
                                                    appointment.endTime
                                                )}
                                            </span>

                                            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[9px] font-bold text-slate-400">
                                                New York time
                                            </span>

                                        </div>

                                    </div>

                                </div>

                            </section>


                            {/* ==================================================
                                CUSTOMER
                            ================================================== */}

                            <section>

                                <SectionHeader
                                    icon={User}
                                    title="Customer"
                                    description="Customer contact information"
                                />


                                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                                    <div className="border-b border-slate-100 bg-slate-50/70 px-4 py-3.5">

                                        <p className="text-sm font-extrabold text-slate-900">
                                            {appointment.customer?.name ||
                                                "Unknown customer"}
                                        </p>

                                    </div>


                                    <div className="space-y-3 px-4 py-4">

                                        {appointment.customer?.phone && (

                                            <InfoRow icon={Phone}>

                                                <a
                                                    href={`tel:${appointment.customer.phone}`}
                                                    className="font-semibold transition hover:text-sky-600"
                                                    onClick={event =>
                                                        event.stopPropagation()
                                                    }
                                                >
                                                    {appointment.customer.phone}
                                                </a>

                                            </InfoRow>

                                        )}


                                        {appointment.customer?.email && (

                                            <InfoRow icon={Mail}>

                                                <a
                                                    href={`mailto:${appointment.customer.email}`}
                                                    className="break-all font-medium transition hover:text-sky-600"
                                                    onClick={event =>
                                                        event.stopPropagation()
                                                    }
                                                >
                                                    {appointment.customer.email}
                                                </a>

                                            </InfoRow>

                                        )}


                                        {appointment.customer?.address && (

                                            <InfoRow icon={MapPin}>

                                                <span className="leading-6">
                                                    {appointment.customer.address}
                                                </span>

                                            </InfoRow>

                                        )}

                                    </div>

                                </div>

                            </section>


                            {/* ==================================================
                                SERVICE
                            ================================================== */}

                            <section>

                                <SectionHeader
                                    icon={Wrench}
                                    title="Service"
                                    description="Issue reported by the customer"
                                />


                                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

                                    <div className="flex items-start justify-between gap-4">

                                        <div>

                                            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                                                Requested service
                                            </p>

                                            <p className="mt-1 text-base font-extrabold text-slate-900">
                                                {formatService(
                                                    appointment.lead?.service
                                                )}
                                            </p>

                                        </div>


                                        {appointment.lead?.urgency ===
                                            "EMERGENCY" && (

                                            <span className="inline-flex shrink-0 items-center rounded-full bg-red-50 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wide text-red-700 ring-1 ring-red-100">
                                                Emergency
                                            </span>

                                        )}

                                    </div>


                                    {appointment.lead?.problemDescription && (

                                        <div className="mt-4 rounded-xl bg-slate-50 p-3.5">

                                            <p className="text-[9px] font-extrabold uppercase tracking-[0.12em] text-slate-400">
                                                Problem description
                                            </p>

                                            <p className="mt-1.5 text-sm leading-6 text-slate-600">
                                                {appointment.lead.problemDescription}
                                            </p>

                                        </div>

                                    )}

                                </div>

                            </section>


                            {/* ==================================================
                                TECHNICIAN
                            ================================================== */}

                            <section>

                                <SectionHeader
                                    icon={User}
                                    title="Technician"
                                    description="Manage technician assignment"
                                />


                                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

                                    {/* Current technician */}

                                    <div className="mb-4 flex items-center gap-3 rounded-xl bg-slate-50 p-3">

                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-700">

                                            <User
                                                size={18}
                                            />

                                        </div>


                                        <div className="min-w-0">

                                            <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                                                Currently assigned
                                            </p>

                                            <p className="mt-0.5 truncate text-sm font-extrabold text-slate-800">

                                                {appointment.technician?.name ||
                                                    "No technician assigned"}

                                            </p>

                                            {appointment.technician?.phone && (

                                                <p className="mt-0.5 text-[11px] font-medium text-slate-400">
                                                    {appointment.technician.phone}
                                                </p>

                                            )}

                                        </div>


                                        {appointment.technician?.name && (

                                            <div className="ml-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">

                                                <Check
                                                    size={14}
                                                    strokeWidth={2.5}
                                                />

                                            </div>

                                        )}

                                    </div>


                                    {/* Assignment */}

                                    <div>

                                        <label className="mb-1.5 block text-[10px] font-extrabold uppercase tracking-[0.12em] text-slate-400">
                                            Change technician
                                        </label>


                                        <div className="flex flex-col gap-2 sm:flex-row">

                                            <select
                                                value={
                                                    selectedTechnicianId
                                                }
                                                onChange={event =>
                                                    setSelectedTechnicianId(
                                                        event.target.value
                                                    )
                                                }
                                                disabled={
                                                    assigning ||
                                                    appointment.status !==
                                                        "BOOKED"
                                                }
                                                className="h-11 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none transition hover:border-slate-300 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                                            >

                                                <option value="">
                                                    Select technician
                                                </option>

                                                {technicians.map(
                                                    technician => (

                                                        <option
                                                            key={
                                                                technician.id
                                                            }
                                                            value={
                                                                technician.id
                                                            }
                                                        >
                                                            {
                                                                technician.name
                                                            }
                                                        </option>

                                                    )
                                                )}

                                            </select>


                                            <button
                                                type="button"
                                                onClick={
                                                    handleAssignTechnician
                                                }
                                                disabled={
                                                    assigning ||
                                                    !selectedTechnicianId ||
                                                    selectedTechnicianId ===
                                                        appointment.technician?.id ||
                                                    appointment.status !==
                                                        "BOOKED"
                                                }
                                                className="flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 text-sm font-extrabold text-white shadow-sm shadow-sky-600/20 transition hover:bg-sky-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40"
                                            >

                                                {assigning ? (

                                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                                                ) : (

                                                    <Save
                                                        size={15}
                                                    />

                                                )}

                                                {assigning
                                                    ? "Saving..."
                                                    : "Assign"}

                                            </button>

                                        </div>


                                        {appointment.status !==
                                            "BOOKED" && (

                                            <p className="mt-2 text-[11px] font-medium text-slate-400">
                                                Technician assignment is only available for booked appointments.
                                            </p>

                                        )}

                                    </div>

                                </div>

                            </section>


                            {/* ==================================================
                                NOTES
                            ================================================== */}

                            {appointment.notes && (

                                <section>

                                    <SectionHeader
                                        icon={AlertCircle}
                                        title="Notes"
                                    />


                                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                                        {appointment.notes}
                                    </div>

                                </section>

                            )}


                            {/* ==================================================
                                RESCHEDULE
                            ================================================== */}

                            {showReschedule &&
                                appointment.status ===
                                    "BOOKED" && (

                                <section className="overflow-hidden rounded-2xl border border-sky-200 bg-sky-50 shadow-sm">

                                    <div className="border-b border-sky-100 px-4 py-3.5">

                                        <div className="flex items-center gap-3">

                                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-sky-600 shadow-sm">

                                                <RefreshCw
                                                    size={16}
                                                />

                                            </div>

                                            <div>

                                                <h3 className="text-sm font-extrabold text-sky-950">
                                                    Reschedule appointment
                                                </h3>

                                                <p className="mt-0.5 text-[11px] font-medium text-sky-700">
                                                    Select a new time in New York business time.
                                                </p>

                                            </div>

                                        </div>

                                    </div>


                                    <div className="p-4">

                                        <div className="grid gap-3 sm:grid-cols-2">

                                            <div>

                                                <label className="mb-1.5 block text-[10px] font-extrabold uppercase tracking-[0.12em] text-slate-500">
                                                    Date
                                                </label>

                                                <input
                                                    type="date"
                                                    value={
                                                        rescheduleDate
                                                    }
                                                    onChange={
                                                        event =>
                                                            setRescheduleDate(
                                                                event.target.value
                                                            )
                                                    }
                                                    className="h-11 w-full rounded-xl border border-sky-100 bg-white px-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                                                />

                                            </div>


                                            <div>

                                                <label className="mb-1.5 block text-[10px] font-extrabold uppercase tracking-[0.12em] text-slate-500">
                                                    Time
                                                </label>

                                                <input
                                                    type="time"
                                                    step="3600"
                                                    value={
                                                        rescheduleTime
                                                    }
                                                    onChange={
                                                        event =>
                                                            setRescheduleTime(
                                                                event.target.value
                                                            )
                                                    }
                                                    className="h-11 w-full rounded-xl border border-sky-100 bg-white px-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                                                />

                                            </div>

                                        </div>


                                        <div className="mt-3 flex items-center gap-2 rounded-xl bg-white/70 px-3 py-2.5">

                                            <Clock3
                                                size={14}
                                                className="shrink-0 text-sky-500"
                                            />

                                            <p className="text-[11px] font-semibold text-sky-700">
                                                Appointments are one hour long.
                                            </p>

                                        </div>


                                        <button
                                            type="button"
                                            onClick={
                                                handleReschedule
                                            }
                                            disabled={
                                                rescheduling ||
                                                !rescheduleDate ||
                                                !rescheduleTime
                                            }
                                            className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 text-sm font-extrabold text-white shadow-sm shadow-sky-600/20 transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-40"
                                        >

                                            {rescheduling ? (

                                                <>
                                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                                                    Rescheduling...
                                                </>

                                            ) : (

                                                <>
                                                    <RefreshCw
                                                        size={15}
                                                    />

                                                    Confirm new time
                                                </>

                                            )}

                                        </button>

                                    </div>

                                </section>

                            )}

                        </div>

                    ) : (

                        <div className="flex min-h-[450px] items-center justify-center px-6 text-center">

                            <div>

                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">

                                    <AlertCircle
                                        size={22}
                                        className="text-slate-400"
                                    />

                                </div>

                                <p className="mt-3 text-sm font-bold text-slate-600">
                                    Appointment could not be loaded.
                                </p>

                            </div>

                        </div>

                    )}

                </div>


                {/* ==================================================
                    FOOTER ACTIONS
                ================================================== */}

                {appointment &&
                    !loading &&
                    appointment.status ===
                        "BOOKED" && (

                    <div className="shrink-0 border-t border-slate-200 bg-white p-4 shadow-[0_-8px_20px_rgba(15,23,42,0.04)] sm:p-5">

                        <div className="flex flex-col gap-2 sm:flex-row">

                            <button
                                type="button"
                                onClick={() =>
                                    setShowReschedule(
                                        current =>
                                            !current
                                    )
                                }
                                disabled={
                                    cancelling ||
                                    rescheduling ||
                                    assigning
                                }
                                className={`flex h-11 flex-1 items-center justify-center gap-2 rounded-xl px-4 text-sm font-extrabold transition disabled:cursor-not-allowed disabled:opacity-40 ${
                                    showReschedule
                                        ? "border border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100"
                                        : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                                }`}
                            >

                                <RefreshCw
                                    size={15}
                                />

                                {showReschedule
                                    ? "Close reschedule"
                                    : "Reschedule"}

                            </button>


                            <button
                                type="button"
                                onClick={
                                    onCancel
                                }
                                disabled={
                                    cancelling ||
                                    rescheduling ||
                                    assigning
                                }
                                className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 text-sm font-extrabold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40"
                            >

                                {cancelling ? (

                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-red-300 border-t-red-700" />

                                ) : (

                                    <Ban
                                        size={15}
                                    />

                                )}

                                {cancelling
                                    ? "Cancelling..."
                                    : "Cancel appointment"}

                            </button>

                        </div>

                    </div>

                )}

            </aside>

        </div>
    );
};


export default AppointmentDetails;