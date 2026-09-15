import { useState } from "react";
import {
    ArrowUpRight,
    Menu,
    X,
} from "lucide-react";

import Logo from "../ui/Logo";

const navItems = [
    {
        label: "Services",
        href: "#services",
    },
    {
        label: "Why CoolAir",
        href: "#why-us",
    },
    {
        label: "How It Works",
        href: "#how-it-works",
    },
];

const Navbar = () => {
    const [isOpen, setIsOpen] =
        useState(false);

    const closeMenu = () => {
        setIsOpen(false);
    };

    return (
        <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
            <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">

                {/* Logo */}
                <a
                    href="/"
                    aria-label="CoolAir home"
                    onClick={closeMenu}
                >
                    <Logo />
                </a>

                {/* Desktop Navigation */}
                <nav className="hidden items-center gap-8 md:flex">
                    {navItems.map((item) => (
                        <a
                            key={item.href}
                            href={item.href}
                            className="text-sm font-medium text-slate-500 transition-colors duration-200 hover:text-slate-950"
                        >
                            {item.label}
                        </a>
                    ))}
                </nav>

                {/* Desktop CTA */}
                <div className="hidden md:block">
                    <a
                        href="/chat"
                        className="group inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-sky-600 hover:shadow-lg hover:shadow-sky-600/20"
                    >
                        Book a Service

                        <ArrowUpRight
                            size={16}
                            className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                    </a>
                </div>

                {/* Mobile Button */}
                <button
                    type="button"
                    aria-label={
                        isOpen
                            ? "Close menu"
                            : "Open menu"
                    }
                    aria-expanded={isOpen}
                    onClick={() =>
                        setIsOpen((current) => !current)
                    }
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-700 transition hover:bg-slate-100 md:hidden"
                >
                    {isOpen ? (
                        <X size={21} />
                    ) : (
                        <Menu size={21} />
                    )}
                </button>
            </div>

            {/* Mobile Navigation */}
            {isOpen && (
                <div className="border-t border-slate-200 bg-white px-5 py-4 md:hidden">
                    <nav className="flex flex-col">
                        {navItems.map((item) => (
                            <a
                                key={item.href}
                                href={item.href}
                                onClick={closeMenu}
                                className="rounded-xl px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
                            >
                                {item.label}
                            </a>
                        ))}

                        <a
                            href="/chat"
                            onClick={closeMenu}
                            className="mt-3 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-600"
                        >
                            Book a Service
                            <ArrowUpRight size={16} />
                        </a>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Navbar;