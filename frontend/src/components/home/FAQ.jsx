import { useState } from "react";
import {
    ChevronDown,
    MessageCircle,
} from "lucide-react";

const faqs = [
    {
        question: "What HVAC services do you provide?",
        answer:
            "CoolAir provides AC repair, AC installation, heating services, HVAC maintenance, and emergency service support. Our AI receptionist can help understand your request and guide you toward the appropriate service.",
    },
    {
        question: "Can I schedule a service appointment online?",
        answer:
            "Yes. You can use our AI receptionist to describe your issue, provide your details, and check available appointment times. Once you select an available slot, the appointment can be scheduled without needing to call.",
    },
    {
        question: "What happens if my preferred time isn't available?",
        answer:
            "Our receptionist checks the appointment schedule and can offer alternative available time slots when your preferred time is already occupied.",
    },
    {
        question: "Do you provide emergency HVAC service?",
        answer:
            "Emergency requests can be submitted through the receptionist. If your situation involves an immediate safety risk, the system will prioritize appropriate safety guidance and recommend contacting emergency services when necessary.",
    },
    {
        question: "Will the AI diagnose my HVAC problem?",
        answer:
            "No. The AI receptionist is designed to collect information, qualify your request, and help with scheduling. A qualified technician is responsible for inspecting the system and determining the appropriate repair.",
    },
    {
        question: "Do I need to call to change my appointment?",
        answer:
            "No. You can use the receptionist to request a cancellation or reschedule an existing appointment. The system checks availability before making changes.",
    },
];

const FAQ = () => {
    const [openIndex, setOpenIndex] =
        useState(0);

    const toggleFAQ = (index) => {
        setOpenIndex((currentIndex) =>
            currentIndex === index
                ? null
                : index
        );
    };

    return (
        <section className="bg-slate-50 py-20 sm:py-24">
            <div className="mx-auto max-w-4xl px-5 sm:px-6">

                {/* Heading */}
                <div className="text-center">
                    <p className="text-sm font-bold uppercase tracking-[0.16em] text-sky-600">
                        Frequently asked questions
                    </p>

                    <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
                        Questions? We've got answers.
                    </h2>

                    <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-500">
                        Everything you need to know about our services,
                        scheduling, and AI receptionist.
                    </p>
                </div>

                {/* FAQ list */}
                <div className="mt-12 overflow-hidden rounded-3xl border border-slate-200 bg-white">
                    {faqs.map((faq, index) => {
                        const isOpen =
                            openIndex === index;

                        return (
                            <div
                                key={faq.question}
                                className="border-b border-slate-200 last:border-b-0"
                            >
                                <button
                                    type="button"
                                    onClick={() =>
                                        toggleFAQ(index)
                                    }
                                    aria-expanded={isOpen}
                                    className="flex w-full items-center justify-between gap-6 px-5 py-5 text-left transition-colors hover:bg-slate-50 sm:px-7"
                                >
                                    <span className="text-sm font-bold text-slate-900 sm:text-base">
                                        {faq.question}
                                    </span>

                                    <span
                                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-200 ${
                                            isOpen
                                                ? "rotate-180 bg-sky-100 text-sky-600"
                                                : "bg-slate-100 text-slate-500"
                                        }`}
                                    >
                                        <ChevronDown
                                            size={17}
                                        />
                                    </span>
                                </button>

                                {isOpen && (
                                    <div className="px-5 pb-5 sm:px-7 sm:pb-6">
                                        <p className="max-w-3xl text-sm leading-7 text-slate-500">
                                            {faq.answer}
                                        </p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Still need help */}
                <div className="mt-8 flex flex-col items-center justify-between gap-5 rounded-3xl border border-sky-100 bg-sky-50 p-6 sm:flex-row sm:px-7">
                    <div className="flex items-center gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-sky-600 shadow-sm">
                            <MessageCircle size={20} />
                        </div>

                        <div>
                            <p className="text-sm font-bold text-slate-900">
                                Still need help?
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                                Ask our AI receptionist directly.
                            </p>
                        </div>
                    </div>

                    <a
                        href="/chat"
                        className="inline-flex items-center justify-center rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-sky-600"
                    >
                        Start a conversation
                    </a>
                </div>
            </div>
        </section>
    );
};

export default FAQ;