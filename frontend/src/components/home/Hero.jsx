import {
    ArrowRight,
    CalendarCheck,
    CheckCircle2,
    MessageCircle,
    ShieldCheck,
    Sparkles,
} from "lucide-react";

const trustPoints = [
    "Licensed technicians",
    "Fast appointment scheduling",
    "AI-powered receptionist",
];

const Hero = () => {
    return (
        <section className="relative overflow-hidden bg-white">
            {/* Background decoration */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-sky-100/70 blur-3xl" />
                <div className="absolute -left-40 bottom-0 h-80 w-80 rounded-full bg-blue-50 blur-3xl" />
            </div>

            <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-14 sm:px-6 sm:pt-20 lg:px-8 lg:pb-28 lg:pt-24">
                <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">

                    {/* Left */}
                    <div>
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3.5 py-2 text-xs font-semibold text-sky-700">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                            </span>

                            AI receptionist available now
                        </div>

                        {/* Heading */}
                        <h1 className="mt-7 max-w-3xl text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl lg:leading-[1.05]">
                            Your comfort.
                            <span className="block text-sky-600">
                                Our priority.
                            </span>
                        </h1>

                        {/* Description */}
                        <p className="mt-6 max-w-xl text-base leading-7 text-slate-500 sm:text-lg">
                            Reliable heating and cooling service without
                            the phone tag. Tell our AI receptionist what's
                            wrong, and we'll help you find the right next
                            step and schedule your service.
                        </p>

                        {/* CTA */}
                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <a
                                href="/chat"
                                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-slate-950/10 transition-all duration-200 hover:-translate-y-0.5 hover:bg-sky-600 hover:shadow-xl hover:shadow-sky-600/20"
                            >
                                <MessageCircle size={18} />

                                Chat with AI Receptionist

                                <ArrowRight
                                    size={16}
                                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                                />
                            </a>

                            <a
                                href="#services"
                                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-bold text-slate-700 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50"
                            >
                                View Services
                            </a>
                        </div>

                        {/* Trust points */}
                        <div className="mt-9 grid gap-3 sm:grid-cols-3 lg:max-w-2xl">
                            {trustPoints.map((point) => (
                                <div
                                    key={point}
                                    className="flex items-center gap-2 text-xs font-medium text-slate-500"
                                >
                                    <CheckCircle2
                                        size={15}
                                        className="shrink-0 text-emerald-500"
                                    />

                                    {point}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right — Product Preview */}
                    <div className="relative mx-auto w-full max-w-xl lg:ml-auto">

                        {/* Main card */}
                        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 p-3 shadow-2xl shadow-slate-950/15">

                            {/* Browser/header */}
                            <div className="flex items-center justify-between rounded-2xl bg-slate-900 px-4 py-3">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500 text-white">
                                        <Sparkles size={16} />
                                    </div>

                                    <div>
                                        <p className="text-xs font-bold text-white">
                                            CoolAir AI
                                        </p>

                                        <p className="text-[10px] text-slate-400">
                                            AI Receptionist
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-400">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                    Online
                                </div>
                            </div>

                            {/* Chat preview */}
                            <div className="space-y-4 px-3 py-7 sm:px-6">

                                {/* AI */}
                                <div className="flex items-start gap-3">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-500 text-white">
                                        <Sparkles size={15} />
                                    </div>

                                    <div className="max-w-[82%] rounded-2xl rounded-tl-md bg-slate-800 px-4 py-3 text-xs leading-5 text-slate-200">
                                        Hi! I'm the CoolAir AI
                                        receptionist. What can I help
                                        you with today?
                                    </div>
                                </div>

                                {/* Customer */}
                                <div className="flex justify-end">
                                    <div className="max-w-[75%] rounded-2xl rounded-br-md bg-sky-500 px-4 py-3 text-xs leading-5 text-white">
                                        My AC is running but it's not
                                        producing cold air.
                                    </div>
                                </div>

                                {/* AI */}
                                <div className="flex items-start gap-3">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-500 text-white">
                                        <Sparkles size={15} />
                                    </div>

                                    <div className="max-w-[82%] rounded-2xl rounded-tl-md bg-slate-800 px-4 py-3 text-xs leading-5 text-slate-200">
                                        I can help with that. Let's get
                                        a service visit scheduled.
                                    </div>
                                </div>

                                {/* Availability */}
                                <div className="ml-11 rounded-2xl border border-slate-700 bg-slate-900 p-4">
                                    <div className="flex items-center gap-2">
                                        <CalendarCheck
                                            size={15}
                                            className="text-sky-400"
                                        />

                                        <span className="text-xs font-bold text-white">
                                            Available appointment
                                        </span>
                                    </div>

                                    <div className="mt-3 flex items-center justify-between rounded-xl bg-slate-800 px-3 py-3">
                                        <div>
                                            <p className="text-xs font-bold text-white">
                                                Tomorrow
                                            </p>

                                            <p className="mt-0.5 text-[10px] text-slate-400">
                                                11:00 AM – 12:00 PM
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            className="rounded-lg bg-sky-500 px-3 py-2 text-[10px] font-bold text-white"
                                        >
                                            Select
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Input preview */}
                            <div className="flex items-center gap-2 rounded-2xl bg-slate-900 p-2">
                                <div className="flex-1 rounded-xl bg-slate-800 px-3 py-2.5 text-[10px] text-slate-500">
                                    Type your message...
                                </div>

                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500 text-white">
                                    <ArrowRight size={15} />
                                </div>
                            </div>
                        </div>

                        {/* Floating scheduling card */}
                        <div className="absolute -bottom-5 -left-3 hidden items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl sm:flex lg:-left-10">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                <CalendarCheck size={18} />
                            </div>

                            <div>
                                <p className="text-xs font-bold text-slate-900">
                                    Appointment secured
                                </p>

                                <p className="mt-0.5 text-[10px] text-slate-400">
                                    No phone tag required
                                </p>
                            </div>
                        </div>

                        {/* Floating trust card */}
                        <div className="absolute -right-3 top-12 hidden items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl sm:flex lg:-right-8">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                                <ShieldCheck size={18} />
                            </div>

                            <div>
                                <p className="text-xs font-bold text-slate-900">
                                    Secure & reliable
                                </p>

                                <p className="mt-0.5 text-[10px] text-slate-400">
                                    Built for your convenience
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;