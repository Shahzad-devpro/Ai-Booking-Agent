import {
    ArrowRight,
    CalendarCheck,
    CheckCircle2,
    Clock3,
    MessageSquareText,
    Wrench,
    ShieldCheck,
    Sparkles,
    ArrowDown
} from "lucide-react";

const steps = [
    {
        number: "01",
        icon: MessageSquareText,
        title: "Tell us what's wrong",
        description:
            "Describe your HVAC problem naturally, just like you would explain it to a receptionist.",
    },
    {
        number: "02",
        icon: Sparkles,
        title: "Our AI qualifies your request",
        description:
            "The AI receptionist collects the important details needed to understand your service request.",
    },
    {
        number: "03",
        icon: CalendarCheck,
        title: "Choose an available time",
        description:
            "The system checks the live schedule and shows appointment times that are actually available.",
    },
    {
        number: "04",
        icon: Wrench,
        title: "Your technician arrives",
        description:
            "Once your appointment is confirmed, your request is ready for the assigned technician.",
    },
];

const HowItWorks = () => {
    return (
        <section
            id="how-it-works"
            className="bg-slate-50 py-24 sm:py-28"
        >
            <div className="mx-auto max-w-7xl px-6 lg:px-8">

                {/* Header */}
                <div className="mx-auto max-w-2xl text-center">

                    <span className="text-sm font-bold uppercase tracking-[0.18em] text-sky-500">
                        How It Works
                    </span>

                    <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                        From problem to appointment
                        <span className="block text-slate-400">
                            without the phone tag.
                        </span>
                    </h2>

                    <p className="mt-5 text-lg leading-8 text-slate-600">
                        Our AI-powered booking experience makes scheduling
                        HVAC service simple, fast, and available whenever
                        you need it.
                    </p>
                </div>

                {/* Steps */}
                <div className="relative mt-16">

                    {/* Desktop connector */}
                    <div className="absolute left-[12.5%] right-[12.5%] top-16 hidden h-px bg-slate-200 lg:block" />

                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">

                        {steps.map((step) => {
                            const Icon = step.icon;

                            return (
                                <article
                                    key={step.number}
                                    className="group relative"
                                >
                                    {/* Number / Icon */}
                                    <div className="relative mx-auto flex h-32 w-32 items-center justify-center">

                                        {/* Outer ring */}
                                        <div className="absolute inset-0 rounded-full border border-slate-200 bg-white transition duration-300 group-hover:border-sky-300 group-hover:shadow-lg group-hover:shadow-sky-500/10" />

                                        {/* Icon */}
                                        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 transition duration-300 group-hover:scale-105 group-hover:bg-sky-500 group-hover:text-white">
                                            <Icon size={27} />
                                        </div>

                                        {/* Number */}
                                        <span className="absolute -right-1 top-1 flex h-8 w-8 items-center justify-center rounded-full border-4 border-slate-50 bg-slate-950 text-xs font-bold text-white">
                                            {step.number}
                                        </span>
                                    </div>

                                    {/* Content */}
                                    <div className="mt-7 text-center">

                                        <h3 className="text-lg font-bold text-slate-900">
                                            {step.title}
                                        </h3>

                                        <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-slate-600">
                                            {step.description}
                                        </p>

                                    </div>

                                    {/* Mobile connector */}
                                    {step.number !== "04" && (
                                        <div className="my-6 flex justify-center lg:hidden">
                                            <ArrowDown
                                                size={20}
                                                className="text-slate-300"
                                            />
                                        </div>
                                    )}
                                </article>
                            );
                        })}

                    </div>
                </div>


                {/* AI Receptionist Product Preview */}
                <div className="mt-20 overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-50 shadow-sm">
                    <div className="grid lg:grid-cols-2">

                        {/* Product Copy */}
                        <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14">

                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 text-sky-600">
                                <Sparkles size={20} />
                            </div>

                            <p className="mt-6 text-sm font-bold uppercase tracking-[0.16em] text-sky-600">
                                Meet your AI receptionist
                            </p>

                            <h3 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
                                Get help without waiting on hold.
                            </h3>

                            <p className="mt-4 max-w-lg text-sm leading-7 text-slate-500 sm:text-base">
                                Describe your issue naturally. Our AI
                                receptionist can collect your service
                                details, help with scheduling, and guide
                                you toward the appropriate next step.
                            </p>

                            {/* Benefits */}
                            <div className="mt-7 space-y-3">
                                {[
                                    "Available around the clock",
                                    "Checks real appointment availability",
                                    "No technical HVAC knowledge required",
                                ].map((item) => (
                                    <div
                                        key={item}
                                        className="flex items-center gap-3 text-sm font-medium text-slate-700"
                                    >
                                        <CheckCircle2
                                            size={17}
                                            className="shrink-0 text-emerald-500"
                                        />

                                        {item}
                                    </div>
                                ))}
                            </div>

                            {/* Primary CTA */}
                            <div className="mt-8">
                                <a
                                    href="/chat"
                                    className="group inline-flex items-center gap-3 rounded-2xl bg-sky-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-sky-600/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-sky-500 hover:shadow-xl hover:shadow-sky-600/30 active:translate-y-0"
                                >
                                    <span>
                                        Try the AI receptionist
                                    </span>

                                    <ArrowRight
                                        size={17}
                                        className="transition-transform duration-200 group-hover:translate-x-1"
                                    />
                                </a>

                                <p className="mt-3 text-xs text-slate-400">
                                    No phone call required. Start your
                                    service request online.
                                </p>
                            </div>
                        </div>

                        {/* Chat Preview */}
                      <div className="border-t border-sky-100 bg-sky-100/40 p-5 sm:p-8 lg:border-l lg:border-t-0 lg:p-10">

                            <div className="mx-auto max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/70">

                                {/* Chat Header */}
                                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                                    <div className="flex items-center gap-3">

                                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
                                            <Sparkles size={17} />
                                        </div>

                                        <div>
                                            <p className="text-xs font-bold text-slate-900">
                                                CoolAir AI
                                            </p>

                                            <div className="mt-0.5 flex items-center gap-1.5">
                                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                                                <span className="text-[10px] text-slate-400">
                                                    Online
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <ShieldCheck
                                        size={17}
                                        className="text-slate-300"
                                    />
                                </div>

                                {/* Chat Messages */}
                                <div className="space-y-4 bg-slate-50 p-5">

                                    {/* AI Message */}
                                    <div className="flex justify-start">
                                        <div className="max-w-[85%] rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 text-xs leading-5 text-slate-600 shadow-sm">
                                            Hi! What can I help you with
                                            today?
                                        </div>
                                    </div>

                                    {/* User Message */}
                                    <div className="flex justify-end">
                                        <div className="max-w-[82%] rounded-2xl rounded-br-md bg-slate-950 px-4 py-3 text-xs leading-5 text-white">
                                            My AC is running but it isn't
                                            producing cold air.
                                        </div>
                                    </div>

                                    {/* AI Response */}
                                    <div className="flex justify-start">
                                        <div className="max-w-[85%] rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 text-xs leading-5 text-slate-600 shadow-sm">
                                            I can help with that. Let's get
                                            a few details so we can arrange
                                            the right service.
                                        </div>
                                    </div>

                                    {/* Availability Card */}
                                    <div className="rounded-2xl border border-sky-100 bg-white p-4 shadow-sm">

                                        <div className="flex items-center gap-2">
                                            <CalendarCheck
                                                size={15}
                                                className="text-sky-600"
                                            />

                                            <span className="text-[11px] font-bold text-slate-900">
                                                Available appointment
                                            </span>
                                        </div>

                                        <div className="mt-3 flex items-center justify-between rounded-xl bg-sky-50 px-3 py-2.5">

                                            <div>
                                                <p className="text-[11px] font-bold text-slate-900">
                                                    Tomorrow
                                                </p>

                                                <p className="mt-0.5 text-[10px] text-slate-500">
                                                    11:00 AM – 12:00 PM
                                                </p>
                                            </div>

                                            <span className="rounded-lg bg-white px-2 py-1 text-[9px] font-bold text-sky-600 shadow-sm">
                                                Available
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Chat Input Preview */}
                                <div className="flex items-center gap-3 border-t border-slate-100 p-4">

                                    <div className="h-10 flex-1 rounded-xl bg-slate-50" />

                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white">
                                        <ArrowRight size={15} />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-slate-400">
                                <Clock3 size={13} />
                                Appointment availability checked in real time
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;

