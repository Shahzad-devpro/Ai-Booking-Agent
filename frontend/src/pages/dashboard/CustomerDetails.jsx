import {
    CalendarDays,
    Clock3,
    Mail,
    MapPin,
    Phone,
    User,
    Wrench,
    X
} from "lucide-react";


const BUSINESS_TIMEZONE =
    "America/New_York";


const formatDate =
    (value) => {

        if (!value) {
            return "—";
        }

        return new Intl.DateTimeFormat(
            "en-US",
            {
                timeZone:
                    BUSINESS_TIMEZONE,

                month: "short",
                day: "numeric",
                year: "numeric"
            }
        ).format(
            new Date(value)
        );
    };


const formatDateTime =
    (value) => {

        if (!value) {
            return "—";
        }

        return new Intl.DateTimeFormat(
            "en-US",
            {
                timeZone:
                    BUSINESS_TIMEZONE,

                month: "short",
                day: "numeric",
                year: "numeric",

                hour: "numeric",
                minute: "2-digit"
            }
        ).format(
            new Date(value)
        );
    };


const getStatusClasses =
    (status) => {

        switch (status) {

            case "BOOKED":
                return "bg-emerald-50 text-emerald-700 border-emerald-200";

            case "COMPLETED":
                return "bg-sky-50 text-sky-700 border-sky-200";

            case "CANCELLED":
                return "bg-red-50 text-red-700 border-red-200";

            case "NEW":
                return "bg-violet-50 text-violet-700 border-violet-200";

            default:
                return "bg-slate-50 text-slate-600 border-slate-200";
        }
    };


const CustomerDetails = ({
    customer,
    onClose
}) => {

    if (!customer) {
        return null;
    }


    const leads =
        customer.leads || [];

    const appointments =
        customer.appointments || [];


    return (

        <div className="fixed inset-0 z-50">

            {/* BACKDROP */}

            <div
                className="
                    absolute
                    inset-0
                    bg-slate-950/40
                    backdrop-blur-sm
                "
                onClick={onClose}
            />


            {/* DRAWER */}

            <aside
                className="
                    absolute
                    right-0
                    top-0
                    flex
                    h-full
                    w-full
                    max-w-xl
                    flex-col
                    bg-white
                    shadow-2xl
                "
            >

                {/* HEADER */}

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        border-b
                        border-slate-200
                        px-5
                        py-4
                        sm:px-6
                    "
                >

                    <div>

                        <p
                            className="
                                text-xs
                                font-bold
                                uppercase
                                tracking-[0.15em]
                                text-sky-600
                            "
                        >
                            Customer
                        </p>

                        <h2
                            className="
                                mt-1
                                text-xl
                                font-bold
                                text-slate-950
                            "
                        >
                            {customer.name}
                        </h2>

                    </div>


                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-slate-200
                            text-slate-500
                            transition
                            hover:bg-slate-100
                            hover:text-slate-900
                        "
                    >
                        <X size={18} />
                    </button>

                </div>


                {/* CONTENT */}

                <div
                    className="
                        flex-1
                        overflow-y-auto
                        px-5
                        py-6
                        sm:px-6
                    "
                >

                    {/* CUSTOMER HERO */}

                    <section
                        className="
                            rounded-3xl
                            border
                            border-slate-200
                            bg-gradient-to-br
                            from-sky-50
                            via-white
                            to-slate-50
                            p-5
                        "
                    >

                        <div
                            className="
                                flex
                                items-center
                                gap-4
                            "
                        >

                            <div
                                className="
                                    flex
                                    h-14
                                    w-14
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-2xl
                                    bg-sky-100
                                    text-lg
                                    font-black
                                    text-sky-700
                                "
                            >
                                {customer.name
                                    ?.charAt(0)
                                    ?.toUpperCase()}
                            </div>


                            <div
                                className="
                                    min-w-0
                                "
                            >

                                <h3
                                    className="
                                        truncate
                                        text-lg
                                        font-bold
                                        text-slate-950
                                    "
                                >
                                    {customer.name}
                                </h3>

                                <p
                                    className="
                                        mt-1
                                        text-xs
                                        text-slate-500
                                    "
                                >
                                    Customer since{" "}
                                    {formatDate(
                                        customer.createdAt
                                    )}
                                </p>

                            </div>

                        </div>


                        {/* STATS */}

                        <div
                            className="
                                mt-5
                                grid
                                grid-cols-2
                                gap-3
                            "
                        >

                            <div
                                className="
                                    rounded-2xl
                                    border
                                    border-slate-200
                                    bg-white
                                    p-4
                                "
                            >

                                <p
                                    className="
                                        text-xs
                                        font-semibold
                                        text-slate-500
                                    "
                                >
                                    Leads
                                </p>

                                <p
                                    className="
                                        mt-1
                                        text-2xl
                                        font-black
                                        text-slate-950
                                    "
                                >
                                    {customer._count
                                        ?.leads || 0}
                                </p>

                            </div>


                            <div
                                className="
                                    rounded-2xl
                                    border
                                    border-slate-200
                                    bg-white
                                    p-4
                                "
                            >

                                <p
                                    className="
                                        text-xs
                                        font-semibold
                                        text-slate-500
                                    "
                                >
                                    Appointments
                                </p>

                                <p
                                    className="
                                        mt-1
                                        text-2xl
                                        font-black
                                        text-slate-950
                                    "
                                >
                                    {customer._count
                                        ?.appointments || 0}
                                </p>

                            </div>

                        </div>

                    </section>


                    {/* CONTACT */}

                    <section className="mt-6">

                        <h3
                            className="
                                mb-3
                                text-sm
                                font-bold
                                text-slate-900
                            "
                        >
                            Contact information
                        </h3>


                        <div
                            className="
                                divide-y
                                divide-slate-100
                                overflow-hidden
                                rounded-2xl
                                border
                                border-slate-200
                                bg-white
                            "
                        >

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-3
                                    p-4
                                "
                            >

                                <Phone
                                    size={17}
                                    className="text-slate-400"
                                />

                                <div>

                                    <p
                                        className="
                                            text-[11px]
                                            font-bold
                                            uppercase
                                            tracking-wide
                                            text-slate-400
                                        "
                                    >
                                        Phone
                                    </p>

                                    <p
                                        className="
                                            mt-0.5
                                            text-sm
                                            font-semibold
                                            text-slate-700
                                        "
                                    >
                                        {customer.phone ||
                                            "Not provided"}
                                    </p>

                                </div>

                            </div>


                            <div
                                className="
                                    flex
                                    items-center
                                    gap-3
                                    p-4
                                "
                            >

                                <Mail
                                    size={17}
                                    className="text-slate-400"
                                />

                                <div>

                                    <p
                                        className="
                                            text-[11px]
                                            font-bold
                                            uppercase
                                            tracking-wide
                                            text-slate-400
                                        "
                                    >
                                        Email
                                    </p>

                                    <p
                                        className="
                                            mt-0.5
                                            break-all
                                            text-sm
                                            font-semibold
                                            text-slate-700
                                        "
                                    >
                                        {customer.email ||
                                            "Not provided"}
                                    </p>

                                </div>

                            </div>


                            <div
                                className="
                                    flex
                                    items-center
                                    gap-3
                                    p-4
                                "
                            >

                                <MapPin
                                    size={17}
                                    className="text-slate-400"
                                />

                                <div>

                                    <p
                                        className="
                                            text-[11px]
                                            font-bold
                                            uppercase
                                            tracking-wide
                                            text-slate-400
                                        "
                                    >
                                        Address
                                    </p>

                                    <p
                                        className="
                                            mt-0.5
                                            text-sm
                                            font-semibold
                                            text-slate-700
                                        "
                                    >
                                        {customer.address ||
                                            "Not provided"}
                                    </p>

                                </div>

                            </div>

                        </div>

                    </section>


                    {/* APPOINTMENTS */}

                    <section className="mt-7">

                        <div
                            className="
                                mb-3
                                flex
                                items-center
                                justify-between
                            "
                        >

                            <h3
                                className="
                                    text-sm
                                    font-bold
                                    text-slate-900
                                "
                            >
                                Appointments
                            </h3>

                            <span
                                className="
                                    rounded-full
                                    bg-slate-100
                                    px-2.5
                                    py-1
                                    text-xs
                                    font-bold
                                    text-slate-600
                                "
                            >
                                {appointments.length}
                            </span>

                        </div>


                        {appointments.length === 0 ? (

                            <div
                                className="
                                    rounded-2xl
                                    border
                                    border-dashed
                                    border-slate-300
                                    bg-slate-50
                                    p-6
                                    text-center
                                "
                            >

                                <CalendarDays
                                    size={22}
                                    className="
                                        mx-auto
                                        text-slate-400
                                    "
                                />

                                <p
                                    className="
                                        mt-2
                                        text-sm
                                        font-semibold
                                        text-slate-600
                                    "
                                >
                                    No appointments yet
                                </p>

                            </div>

                        ) : (

                            <div className="space-y-3">

                                {appointments.map(
                                    appointment => (

                                        <div
                                            key={
                                                appointment.id
                                            }
                                            className="
                                                rounded-2xl
                                                border
                                                border-slate-200
                                                bg-white
                                                p-4
                                            "
                                        >

                                            <div
                                                className="
                                                    flex
                                                    items-start
                                                    justify-between
                                                    gap-3
                                                "
                                            >

                                                <div>

                                                    <p
                                                        className="
                                                            text-sm
                                                            font-bold
                                                            text-slate-900
                                                        "
                                                    >
                                                        {appointment
                                                            .lead
                                                            ?.service ||
                                                            "Service appointment"}
                                                    </p>

                                                    <p
                                                        className="
                                                            mt-1
                                                            text-xs
                                                            text-slate-500
                                                        "
                                                    >
                                                        {formatDateTime(
                                                            appointment.startTime
                                                        )}
                                                    </p>

                                                </div>


                                                <span
                                                    className={`
                                                        rounded-full
                                                        border
                                                        px-2.5
                                                        py-1
                                                        text-[11px]
                                                        font-bold
                                                        ${getStatusClasses(
                                                            appointment.status
                                                        )}
                                                    `}
                                                >
                                                    {
                                                        appointment.status
                                                    }
                                                </span>

                                            </div>


                                            {appointment
                                                .technician && (

                                                <div
                                                    className="
                                                        mt-3
                                                        flex
                                                        items-center
                                                        gap-2
                                                        text-xs
                                                        font-medium
                                                        text-slate-500
                                                    "
                                                >

                                                    <Wrench
                                                        size={14}
                                                    />

                                                    {
                                                        appointment
                                                            .technician
                                                            .name
                                                    }

                                                </div>

                                            )}

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                    </section>


                    {/* LEADS */}

                    <section className="mt-7">

                        <div
                            className="
                                mb-3
                                flex
                                items-center
                                justify-between
                            "
                        >

                            <h3
                                className="
                                    text-sm
                                    font-bold
                                    text-slate-900
                                "
                            >
                                Lead history
                            </h3>

                            <span
                                className="
                                    rounded-full
                                    bg-slate-100
                                    px-2.5
                                    py-1
                                    text-xs
                                    font-bold
                                    text-slate-600
                                "
                            >
                                {leads.length}
                            </span>

                        </div>


                        {leads.length === 0 ? (

                            <div
                                className="
                                    rounded-2xl
                                    border
                                    border-dashed
                                    border-slate-300
                                    bg-slate-50
                                    p-6
                                    text-center
                                "
                            >

                                <User
                                    size={22}
                                    className="
                                        mx-auto
                                        text-slate-400
                                    "
                                />

                                <p
                                    className="
                                        mt-2
                                        text-sm
                                        font-semibold
                                        text-slate-600
                                    "
                                >
                                    No lead history
                                </p>

                            </div>

                        ) : (

                            <div className="space-y-3">

                                {leads.map(
                                    lead => (

                                        <div
                                            key={lead.id}
                                            className="
                                                rounded-2xl
                                                border
                                                border-slate-200
                                                bg-white
                                                p-4
                                            "
                                        >

                                            <div
                                                className="
                                                    flex
                                                    items-start
                                                    justify-between
                                                    gap-3
                                                "
                                            >

                                                <div>

                                                    <p
                                                        className="
                                                            text-sm
                                                            font-bold
                                                            text-slate-900
                                                        "
                                                    >
                                                        {lead.service ||
                                                            "Service request"}
                                                    </p>

                                                    <p
                                                        className="
                                                            mt-1
                                                            line-clamp-2
                                                            text-xs
                                                            leading-5
                                                            text-slate-500
                                                        "
                                                    >
                                                        {lead.problemDescription ||
                                                            lead.problem ||
                                                            "No problem description"}
                                                    </p>

                                                </div>


                                                <span
                                                    className={`
                                                        shrink-0
                                                        rounded-full
                                                        border
                                                        px-2.5
                                                        py-1
                                                        text-[11px]
                                                        font-bold
                                                        ${getStatusClasses(
                                                            lead.status
                                                        )}
                                                    `}
                                                >
                                                    {lead.status}
                                                </span>

                                            </div>


                                            <div
                                                className="
                                                    mt-3
                                                    flex
                                                    items-center
                                                    gap-2
                                                    text-xs
                                                    text-slate-400
                                                "
                                            >

                                                <Clock3
                                                    size={13}
                                                />

                                                {formatDate(
                                                    lead.createdAt
                                                )}

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                    </section>

                </div>

            </aside>

        </div>
    );
};


export default CustomerDetails;