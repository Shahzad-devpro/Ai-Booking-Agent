import {
    ArrowUpRight,
    MapPin,
    Phone,
} from "lucide-react";

import Logo from "../ui/Logo";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-slate-950 text-white">
            <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

                {/* Main Footer */}
                <div className="grid gap-12 py-14 sm:py-16 lg:grid-cols-[1.4fr_0.7fr_0.7fr_1fr] lg:gap-10">

                    {/* Brand */}
                    <div className="max-w-sm">
                        <a
                            href="/"
                            aria-label="CoolAir home"
                            className="inline-flex"
                        >
                            <Logo dark />
                        </a>

                        <p className="mt-6 text-sm leading-7 text-slate-400">
                            Professional heating and cooling services
                            with a simpler way to request help and
                            schedule your next appointment.
                        </p>

                        <a
                            href="/chat"
                            className="group mt-6 inline-flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2.5 text-xs font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-sky-400 hover:shadow-lg hover:shadow-sky-500/20"
                        >
                            Try the AI receptionist

                            <ArrowUpRight
                                size={14}
                                className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            />
                        </a>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-white">
                            Company
                        </h3>

                        <nav className="mt-5 flex flex-col gap-3">
                            <a
                                href="/"
                                className="w-fit text-sm text-slate-400 transition-colors hover:text-white"
                            >
                                Home
                            </a>

                            <a
                                href="/#services"
                                className="w-fit text-sm text-slate-400 transition-colors hover:text-white"
                            >
                                Services
                            </a>

                            <a
                                href="/#why-us"
                                className="w-fit text-sm text-slate-400 transition-colors hover:text-white"
                            >
                                Why CoolAir
                            </a>

                            <a
                                href="/#how-it-works"
                                className="w-fit text-sm text-slate-400 transition-colors hover:text-white"
                            >
                                How It Works
                            </a>

                            <a
                                href="/#testimonials"
                                className="w-fit text-sm text-slate-400 transition-colors hover:text-white"
                            >
                                Testimonials
                            </a>

                            <a
                                href="/#faq"
                                className="w-fit text-sm text-slate-400 transition-colors hover:text-white"
                            >
                                FAQ
                            </a>
                        </nav>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-white">
                            Services
                        </h3>

                        <nav className="mt-5 flex flex-col gap-3">
                            <a
                                href="/chat"
                                className="w-fit text-sm text-slate-400 transition-colors hover:text-white"
                            >
                                AC Repair
                            </a>

                            <a
                                href="/chat"
                                className="w-fit text-sm text-slate-400 transition-colors hover:text-white"
                            >
                                AC Installation
                            </a>

                            <a
                                href="/chat"
                                className="w-fit text-sm text-slate-400 transition-colors hover:text-white"
                            >
                                Heating Services
                            </a>

                            <a
                                href="/chat"
                                className="w-fit text-sm text-slate-400 transition-colors hover:text-white"
                            >
                                HVAC Maintenance
                            </a>

                            <a
                                href="/chat"
                                className="w-fit text-sm text-slate-400 transition-colors hover:text-white"
                            >
                                Emergency Service
                            </a>
                        </nav>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-white">
                            Contact
                        </h3>

                        <div className="mt-5 space-y-4">
                            <div className="flex items-start gap-3">
                                <MapPin
                                    size={17}
                                    className="mt-0.5 shrink-0 text-sky-400"
                                />

                                <div>
                                    <p className="text-sm font-medium text-slate-300">
                                        Service Area
                                    </p>

                                    <p className="mt-1 text-xs leading-5 text-slate-500">
                                        New York & surrounding areas
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Phone
                                    size={17}
                                    className="mt-0.5 shrink-0 text-sky-400"
                                />

                                <div>
                                    <p className="text-sm font-medium text-slate-300">
                                        Phone
                                    </p>

                                    <a
                                        href="tel:+10000000000"
                                        className="mt-1 block text-xs text-slate-500 transition-colors hover:text-sky-400"
                                    >
                                        (000) 000-0000
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 flex h-4 w-4 items-center justify-center">
                                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-slate-300">
                                        Business Hours
                                    </p>

                                    <p className="mt-1 text-xs leading-5 text-slate-500">
                                        Monday – Saturday
                                        <br />
                                        9 AM – 5 PM
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col gap-4 border-t border-white/10 py-6 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-slate-500">
                        © {currentYear} CoolAir HVAC Services. All rights
                        reserved.
                    </p>

                    <div className="flex items-center gap-5">
                        <a
                            href="/"
                            className="text-xs text-slate-500 transition-colors hover:text-white"
                        >
                            Privacy
                        </a>

                        <a
                            href="/"
                            className="text-xs text-slate-500 transition-colors hover:text-white"
                        >
                            Terms
                        </a>

                        <a
                            href="/chat"
                            className="group inline-flex items-center gap-1.5 text-xs font-semibold text-sky-400 transition-colors hover:text-sky-300"
                        >
                            Book a service

                            <ArrowUpRight
                                size={12}
                                className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

