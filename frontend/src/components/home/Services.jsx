import {
    ArrowUpRight,
    Flame,
    LifeBuoy,
    Snowflake,
    Sparkles,
    Wrench,
} from "lucide-react";

const services = [
    {
        title: "AC Repair",
        description:
            "Get help with cooling issues, unusual noises, airflow problems, and other AC concerns.",
        icon: Snowflake,
    },
    {
        title: "AC Installation",
        description:
            "Professional installation support for new or replacement air conditioning systems.",
        icon: Wrench,
    },
    {
        title: "Heating Services",
        description:
            "Keep your home comfortable with professional heating inspection, repair, and service.",
        icon: Flame,
    },
    {
        title: "HVAC Maintenance",
        description:
            "Routine maintenance designed to help keep your heating and cooling system running reliably.",
        icon: Wrench,
    },
    {
        title: "Emergency Service",
        description:
            "Submit urgent HVAC requests and get guidance on the appropriate next step.",
        icon: LifeBuoy,
    },
];

const Services = () => {
    return (
        <section
            id="services"
            className="bg-slate-50 py-20 sm:py-24"
        >
            <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-2xl">
                        <p className="text-sm font-bold uppercase tracking-[0.16em] text-sky-600">
                            Our services
                        </p>

                        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
                            Heating and cooling help,
                            without the hassle.
                        </h2>

                        <p className="mt-4 text-base leading-7 text-slate-500">
                            From routine maintenance to urgent repairs,
                            our team helps you get the service you need.
                        </p>
                    </div>

                    <a
                        href="/chat"
                        className="group inline-flex w-fit items-center gap-2 text-sm font-bold text-slate-900 transition hover:text-sky-600"
                    >
                        Talk to our AI receptionist

                        <ArrowUpRight
                            size={16}
                            className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                    </a>
                </div>

                <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {services.map((service) => {
                        const Icon = service.icon;

                        return (
                            <a
                                key={service.title}
                                href="/chat"
                                aria-label={`Get help with ${service.title}`}
                                className="group relative block overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-sky-200 hover:shadow-xl hover:shadow-slate-200/60 focus:outline-none focus:ring-4 focus:ring-sky-100"
                            >
                                <div className="relative z-10">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 transition-all duration-300 group-hover:bg-sky-600 group-hover:text-white group-hover:scale-105">
                                        <Icon size={21} />
                                    </div>

                                    <h3 className="mt-6 text-lg font-bold text-slate-950">
                                        {service.title}
                                    </h3>

                                    <p className="mt-3 text-sm leading-6 text-slate-500">
                                        {service.description}
                                    </p>

                                    <div className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-bold text-white transition-all duration-200 group-hover:bg-sky-600 group-hover:shadow-md group-hover:shadow-sky-600/20">
                                        Get help

                                        <ArrowUpRight
                                            size={14}
                                            className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                        />
                                    </div>
                                </div>

                                <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-sky-50 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />
                            </a>
                        );
                    })}

                    <a
                        href="/chat"
                        aria-label="Start a conversation with the AI receptionist"
                        className="group relative block overflow-hidden rounded-3xl bg-slate-950 p-6 text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-300/30 focus:outline-none focus:ring-4 focus:ring-sky-200"
                    >
                        <div className="relative z-10">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500 text-white transition-transform duration-300 group-hover:scale-105">
                                <Sparkles size={21} />
                            </div>

                            <h3 className="mt-6 text-lg font-bold">
                                AI Receptionist
                            </h3>

                            <p className="mt-3 text-sm leading-6 text-slate-400">
                                Describe your HVAC issue, answer a few
                                questions, and find an available service
                                appointment through our AI-powered
                                receptionist.
                            </p>

                            <div className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-slate-950 transition-all duration-200 group-hover:bg-sky-500 group-hover:text-white">
                                Start a conversation

                                <ArrowUpRight
                                    size={14}
                                    className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                />
                            </div>
                        </div>

                        <div className="pointer-events-none absolute -bottom-20 -right-10 h-52 w-52 rounded-full bg-sky-500/20 blur-3xl transition-transform duration-500 group-hover:scale-125" />

                        <div className="pointer-events-none absolute right-8 top-8 h-20 w-20 rounded-full border border-white/5" />
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Services;
