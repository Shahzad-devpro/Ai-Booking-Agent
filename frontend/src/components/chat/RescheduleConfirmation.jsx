import {
    CalendarCheck,
    Check,
    Clock3,
    UserRound,
} from "lucide-react";

const BUSINESS_TIMEZONE = "America/New_York";

const formatDate = (value) => {
    if (!value) return null;

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
        timeZone: BUSINESS_TIMEZONE,
    }).format(date);
};

const formatTime = (value) => {
    if (!value) return null;

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
        timeZone: BUSINESS_TIMEZONE,
    }).format(date);
};

const AppointmentPeriod = ({
    label,
    appointment,
}) => {
    if (!appointment) {
        return null;
    }

    const date =
        formatDate(appointment.startTime) ||
        formatDate(appointment.start);

    const startTime =
        formatTime(appointment.startTime) ||
        formatTime(appointment.start);

    const endTime =
        formatTime(appointment.endTime) ||
        formatTime(appointment.end);

    if (!date && !startTime && !endTime) {
        return null;
    }

    return (
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">

            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {label}
            </p>

            {date && (
                <p className="mt-1 text-xs font-bold text-slate-900">
                    {date}
                </p>
            )}

            {(startTime || endTime) && (
                <p className="mt-0.5 text-sm font-bold text-slate-900">
                    {startTime}
                    {endTime && ` – ${endTime}`}
                </p>
            )}

        </div>
    );
};

const RescheduleConfirmation = ({
    appointment,
    previousAppointment,
    lead,
}) => {
    if (!appointment) {
        return null;
    }

    const technician =
        appointment.technician?.name ||
        appointment.technician?.fullName ||
        appointment.technicianName ||
        null;

    const service =
        lead?.serviceType ||
        lead?.service ||
        appointment.serviceType ||
        appointment.service ||
        null;

    return (
        <div className="w-full max-w-md overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm">

            {/* HEADER */}
            <div className="border-b border-emerald-100 bg-emerald-50/70 px-5 py-5">
                <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm">
                        <Check
                            size={20}
                            strokeWidth={2.5}
                        />
                    </div>

                    <div className="min-w-0">

                        <p className="text-sm font-extrabold text-slate-950">
                            Appointment rescheduled
                        </p>

                        <p className="mt-0.5 text-xs text-emerald-600">
                            Your service appointment has been updated.
                        </p>

                    </div>

                </div>
            </div>

            {/* DETAILS */}
            <div className="space-y-4 p-5">

                <AppointmentPeriod
                    label="Previous appointment"
                    appointment={previousAppointment}
                />

                <div className="flex items-center justify-center">
                    <div className="h-px flex-1 bg-slate-100" />

                    <div className="mx-3 flex h-7 w-7 items-center justify-center rounded-full bg-sky-50 text-sky-600">
                        <CalendarCheck size={14} />
                    </div>

                    <div className="h-px flex-1 bg-slate-100" />
                </div>

                <AppointmentPeriod
                    label="New appointment"
                    appointment={appointment}
                />

                {service && (
                    <div className="flex items-start gap-3">

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                            <CalendarCheck size={17} />
                        </div>

                        <div className="min-w-0">

                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                Service
                            </p>

                            <p className="mt-1 break-words text-sm font-bold text-slate-900">
                                {service}
                            </p>

                        </div>
                    </div>
                )}

                {technician && (
                    <div className="flex items-start gap-3">

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
                            <UserRound size={17} />
                        </div>

                        <div className="min-w-0">

                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                Technician
                            </p>

                            <p className="mt-1 text-sm font-bold text-slate-900">
                                {technician}
                            </p>

                        </div>
                    </div>
                )}

            </div>

            {/* FOOTER */}
            <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-3">
                <p className="text-center text-[10px] leading-4 text-slate-400">
                    Please keep this updated confirmation for your records.
                </p>
            </div>

        </div>
    );
};

export default RescheduleConfirmation;