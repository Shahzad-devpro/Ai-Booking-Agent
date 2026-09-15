const testimonials = [
    {
        quote:
            "Our AC stopped cooling on one of the hottest days of the summer. CoolAir made scheduling incredibly simple and the technician arrived right on time.",
        name: "Michael R.",
        role: "Homeowner",
        initials: "MR",
    },
    {
        quote:
            "I loved being able to explain the problem through the AI receptionist instead of waiting on hold. The appointment process was quick and straightforward.",
        name: "Jessica T.",
        role: "Homeowner",
        initials: "JT",
    },
    {
        quote:
            "The technician was professional, explained what needed attention, and got our system back to normal. Great experience from start to finish.",
        name: "David K.",
        role: "Homeowner",
        initials: "DK",
    },
];

const Testimonials = () => {
    return (
        <section className="bg-white py-20 sm:py-24">
            <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

                {/* Heading */}
                <div className="mx-auto max-w-2xl text-center">
                    <p className="text-sm font-bold uppercase tracking-[0.16em] text-sky-600">
                        Customer experiences
                    </p>

                    <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
                        Trusted by homeowners who value great service.
                    </h2>

                    <p className="mt-4 text-base leading-7 text-slate-500">
                        From the first conversation to the completed service,
                        we keep the experience simple and transparent.
                    </p>
                </div>

                {/* Testimonials */}
                <div className="mt-12 grid gap-5 lg:grid-cols-3">
                    {testimonials.map((testimonial) => (
                        <article
                            key={testimonial.name}
                            className="group rounded-3xl border border-slate-200 bg-slate-50 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-sky-200 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50"
                        >
                            {/* Stars */}
                            <div className="flex gap-1 text-amber-400">
                                {Array.from({
                                    length: 5,
                                }).map((_, index) => (
                                    <span
                                        key={index}
                                        aria-hidden="true"
                                    >
                                        ★
                                    </span>
                                ))}
                            </div>

                            {/* Quote */}
                            <blockquote className="mt-5 text-sm leading-7 text-slate-600">
                                “{testimonial.quote}”
                            </blockquote>

                            {/* Customer */}
                            <div className="mt-7 flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                                    {testimonial.initials}
                                </div>

                                <div>
                                    <p className="text-sm font-bold text-slate-900">
                                        {testimonial.name}
                                    </p>

                                    <p className="mt-0.5 text-xs text-slate-400">
                                        {testimonial.role}
                                    </p>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                {/* Trust row */}
                <div className="mt-12 flex flex-col items-center justify-center gap-4 border-t border-slate-200 pt-8 text-center sm:flex-row sm:gap-8">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                        <span className="text-amber-400">★★★★★</span>
                        4.9/5 customer rating
                    </div>

                    <div className="hidden h-4 w-px bg-slate-200 sm:block" />

                    <p className="text-sm text-slate-400">
                        Professional service. Simple scheduling.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;