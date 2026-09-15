import {
    ArrowRight,
    CalendarCheck,
    CheckCircle2,
    Clock3,
} from "lucide-react";

const AvailabilityCard = ({
    date,
    slots = [],
    onSelectSlot,
    disabled = false,
}) => {
    if (!slots.length) return null;

    return (
        <div className="w-full max-w-md overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-sm">
            {/* Header */}
            <div className="border-b border-slate-100 bg-sky-50/70 px-4 py-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
                        <CalendarCheck size={17} />
                    </div>

                    <div>
                        <p className="text-xs font-bold text-slate-900">
                            Available appointments
                        </p>

                        <p className="mt-0.5 text-[11px] text-slate-500">
                            Choose a time that works for you
                        </p>
                    </div>
                </div>

                {date && (
                    <div className="mt-4 flex items-center gap-2 text-sm font-bold text-slate-800">
                        <Clock3
                            size={15}
                            className="text-sky-500"
                        />

                        {date}
                    </div>
                )}
            </div>

            {/* Slots */}
            <div className="space-y-2 p-3">
                {slots.map((slot) => {
                    const slotId =
                        slot.id ??
                        `${slot.start}-${slot.end}`;

                    return (
                        <button
                            key={slotId}
                            type="button"
                            disabled={disabled}
                            onClick={() =>
                                onSelectSlot?.(slot)
                            }
                            className="
                                group
                                flex
                                w-full
                                items-center
                                gap-3
                                rounded-xl
                                border
                                border-slate-200
                                bg-white
                                p-3
                                text-left
                                transition-all
                                duration-200
                                hover:-translate-y-0.5
                                hover:border-sky-200
                                hover:bg-sky-50/40
                                hover:shadow-sm
                                active:translate-y-0
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500 transition-colors group-hover:bg-sky-100 group-hover:text-sky-600">
                                <Clock3 size={16} />
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-bold text-slate-900">
                                    {slot.start}
                                    {" – "}
                                    {slot.end}
                                </p>

                                <div className="mt-1 flex items-center gap-1.5">
                                    <CheckCircle2
                                        size={12}
                                        className="text-emerald-500"
                                    />

                                    <span className="text-[10px] font-semibold text-emerald-600">
                                        Available
                                    </span>
                                </div>
                            </div>

                            <ArrowRight
                                size={16}
                                className="shrink-0 text-slate-300 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-sky-500"
                            />
                        </button>
                    );
                })}
            </div>

            {/* Footer */}
            <div className="border-t border-slate-100 px-4 py-3">
                <p className="text-center text-[10px] leading-4 text-slate-400">
                    Appointments are scheduled in 1-hour service windows.
                </p>
            </div>
        </div>
    );
};

export default AvailabilityCard;

