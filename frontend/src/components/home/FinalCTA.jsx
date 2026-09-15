import {
    ArrowRight,
    MessageCircle,
    ShieldCheck,
} from "lucide-react";

const FinalCTA = () => {
    return (
        <section className="relative overflow-hidden bg-white py-24 sm:py-28">
            {/* Decorative background */}
            <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-sky-100/70 blur-3xl" />

            <div className="relative mx-auto max-w-5xl px-6 lg:px-8">
                <div className="overflow-hidden rounded-3xl bg-slate-950 px-6 py-16 text-center shadow-2xl shadow-slate-900/10 sm:px-12 sm:py-20">

                    {/* Decorative circles */}
                    <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full border border-white/5" />
                    <div className="pointer-events-none absolute -bottom-32 -right-20 h-80 w-80 rounded-full border border-white/5" />

                    <div className="relative">

                        {/* Icon */}
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-500 text-white shadow-lg shadow-sky-500/20">
                            <MessageCircle size={25} />
                        </div>

                        <span className="mt-6 block text-sm font-bold uppercase tracking-[0.18em] text-sky-400">
                            Ready when you are
                        </span>

                        <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
                            Get your HVAC service
                            <span className="block text-slate-400">
                                scheduled without the hassle.
                            </span>
                        </h2>

                        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-400">
                            Tell our AI receptionist what's going on. We'll
                            collect the details, check available appointment
                            times, and help you take the next step.
                        </p>

                        {/* CTA */}
                        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">

                            <a
                                href="/chat"
                                className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sky-500 px-6 py-3.5 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-sky-400 sm:w-auto"
                            >
                                <MessageCircle size={18} />

                                Start with AI Receptionist

                                <ArrowRight
                                    size={17}
                                    className="transition-transform duration-200 group-hover:translate-x-1"
                                />
                            </a>

                            <a
                                href="#services"
                                className="w-full rounded-xl border border-white/15 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/5 sm:w-auto"
                            >
                                View our services
                            </a>

                        </div>

                        {/* Trust */}
                        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-slate-500">
                            <ShieldCheck
                                size={17}
                                className="text-emerald-400"
                            />

                            No phone tag. Simple scheduling.
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FinalCTA;