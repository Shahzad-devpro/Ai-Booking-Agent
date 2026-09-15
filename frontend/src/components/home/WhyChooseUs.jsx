import {
    ArrowRight,
    CalendarCheck,
    CheckCircle2,
    Clock3,
    MessageCircle,
    ShieldCheck,
    Sparkles,
} from "lucide-react";

const reasons = [
    {
        title: "Experienced Technicians",
        description:
            "Get professional HVAC service from technicians focused on solving the problem properly and keeping your home comfortable.",
        icon: ShieldCheck,
    },
    {
        title: "Simple Scheduling",
        description:
            "No back-and-forth phone calls. Tell us what you need and find an available appointment in just a few steps.",
        icon: CalendarCheck,
    },
    {
        title: "AI Receptionist",
        description:
            "Our AI receptionist is available around the clock to qualify your request and help you find the right next step.",
        icon: Sparkles,
    },
    {
        title: "Customer First",
        description:
            "Clear communication, straightforward service, and a booking experience designed around your convenience.",
        icon: MessageCircle,
    },
];

const stats = [
    {
        value: "24/7",
        label: "AI receptionist",
        icon: MessageCircle,
    },
    {
        value: "1 min",
        label: "Average booking process",
        icon: Clock3,
    },
    {
        value: "100%",
        label: "Customer-focused",
        icon: CheckCircle2,
    },
];

const WhyChooseUs = () => {
    return (
        <section
            id="why-us"
            className="relative overflow-hidden bg-slate-950 py-20 text-white sm:py-24"
        >
            {/* Background decoration */}
            <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />
            <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl" />

            <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="max-w-2xl">
                    <p className="text-sm font-bold uppercase tracking-[0.16em] text-sky-400">
                        Why CoolAir
                    </p>

                    <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                        A better way to get HVAC service.
                    </h2>

                    <p className="mt-4 text-base leading-7 text-slate-400">
                        Professional service backed by a simpler,
                        smarter way to request help and schedule an
                        appointment.
                    </p>
                </div>

                {/* Reasons */}
                <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {reasons.map((reason) => {
                        const Icon = reason.icon;

                        return (
                            <article
                                key={reason.title}
                                className="group rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-sky-400/30 hover:bg-white/[0.07] hover:shadow-2xl hover:shadow-sky-950/30"
                            >
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-400 transition-all duration-300 group-hover:bg-sky-500 group-hover:text-white group-hover:scale-105">
                                    <Icon size={20} />
                                </div>

                                <h3 className="mt-6 text-base font-bold text-white">
                                    {reason.title}
                                </h3>

                                <p className="mt-3 text-sm leading-6 text-slate-400">
                                    {reason.description}
                                </p>

                                <div className="mt-5 h-px w-0 bg-sky-400 transition-all duration-300 group-hover:w-12" />
                            </article>
                        );
                    })}
                </div>

                {/* Stats */}
                <div className="mt-10 grid overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] sm:grid-cols-3">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;

                        return (
                            <div
                                key={stat.label}
                                className={`flex items-center gap-4 p-6 sm:p-7 ${
                                    index !== 0
                                        ? "border-t border-white/10 sm:border-l sm:border-t-0"
                                        : ""
                                }`}
                            >
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/5 text-sky-400">
                                    <Icon size={19} />
                                </div>

                                <div>
                                    <p className="text-xl font-extrabold tracking-tight text-white">
                                        {stat.value}
                                    </p>

                                    <p className="mt-1 text-xs font-medium text-slate-500">
                                        {stat.label}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* CTA */}
                <div className="mt-10 flex flex-col gap-5 rounded-3xl border border-sky-400/10 bg-linear-to-r from-sky-500/10 to-transparent p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
                    <div>
                        <p className="text-lg font-bold text-white">
                            Need HVAC service?
                        </p>

                        <p className="mt-1 text-sm leading-6 text-slate-400">
                            Tell our AI receptionist what's going on and
                            we'll help you with the next step.
                        </p>
                    </div>

                    <a
                        href="/chat"
                        className="group inline-flex w-fit shrink-0 items-center gap-2 rounded-xl bg-sky-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-sky-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-sky-400 hover:shadow-xl hover:shadow-sky-500/25"
                    >
                        Start a conversation

                        <ArrowRight
                            size={16}
                            className="transition-transform duration-200 group-hover:translate-x-1"
                        />
                    </a>
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;

