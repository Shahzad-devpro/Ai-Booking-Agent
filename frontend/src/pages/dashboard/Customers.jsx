import {
    AlertCircle,
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    Loader2,
    Mail,
    MapPin,
    Phone,
    Search,
    Users,
    X
} from "lucide-react";

import {
    useEffect,
    useState
} from "react";

import DashboardLayout
    from "../../components/dashboard/DashboardLayout";

import CustomerDetails
    from "./CustomerDetails";

import {
    getCustomers,
    getCustomerById
} from "../../services/customerApi";


const Customers = () => {

    const [
        customers,
        setCustomers
    ] = useState([]);


    const [
        loading,
        setLoading
    ] = useState(true);


    const [
        customerLoading,
        setCustomerLoading
    ] = useState(false);


    const [
        error,
        setError
    ] = useState("");


    const [
        searchInput,
        setSearchInput
    ] = useState("");


    const [
        search,
        setSearch
    ] = useState("");


    const [
        page,
        setPage
    ] = useState(1);


    const [
        pagination,
        setPagination
    ] = useState({
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 1
    });


    const [
        selectedCustomer,
        setSelectedCustomer
    ] = useState(null);


    /*
    |--------------------------------------------------------------------------
    | SEARCH DEBOUNCE
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        const timer =
            setTimeout(() => {

                setSearch(
                    searchInput.trim()
                );

                setPage(1);

            }, 300);


        return () =>
            clearTimeout(timer);

    }, [searchInput]);


    /*
    |--------------------------------------------------------------------------
    | FETCH CUSTOMERS
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        let cancelled = false;


        const loadCustomers =
            async () => {

                try {

                    setLoading(true);
                    setError("");


                    const response =
                        await getCustomers({

                            search,

                            page,

                            limit: 10

                        });


                    if (cancelled) {
                        return;
                    }


                    setCustomers(
                        response?.data
                            ?.customers || []
                    );


                    setPagination({

                        total:
                            response?.data
                                ?.total || 0,

                        page:
                            response?.data
                                ?.page || page,

                        limit:
                            response?.data
                                ?.limit || 10,

                        totalPages:
                            response?.data
                                ?.totalPages || 1

                    });

                } catch (err) {

                    if (cancelled) {
                        return;
                    }

                    console.error(
                        "Failed to fetch customers:",
                        err
                    );

                    setError(
                        err.message ||
                        "Failed to load customers"
                    );

                } finally {

                    if (!cancelled) {
                        setLoading(false);
                    }

                }

            };


        loadCustomers();


        return () => {
            cancelled = true;
        };

    }, [
        search,
        page
    ]);


    /*
    |--------------------------------------------------------------------------
    | OPEN CUSTOMER
    |--------------------------------------------------------------------------
    */

    const openCustomer =
        async (customerId) => {

            try {

                setCustomerLoading(true);
                setError("");


                const response =
                    await getCustomerById(
                        customerId
                    );


                setSelectedCustomer(
                    response?.data || null
                );

            } catch (err) {

                console.error(
                    "Failed to fetch customer:",
                    err
                );

                setError(
                    err.message ||
                    "Failed to load customer"
                );

            } finally {

                setCustomerLoading(false);

            }

        };


    const clearSearch = () => {

        setSearchInput("");
        setSearch("");
        setPage(1);

    };


    const previousPage = () => {

        if (page <= 1) {
            return;
        }

        setPage(
            current =>
                current - 1
        );

    };


    const nextPage = () => {

        if (
            page >=
            pagination.totalPages
        ) {
            return;
        }

        setPage(
            current =>
                current + 1
        );

    };


    return (

        <DashboardLayout
            activePath="/admin/customers"
        >

            <div className="min-h-screen">

                {/* HEADER */}

                <div
                    className="
                        border-b
                        border-slate-200
                        bg-white
                    "
                >

                    <div
                        className="
                            px-5
                            py-7
                            sm:px-8
                            lg:px-10
                        "
                    >

                        <div
                            className="
                                flex
                                flex-col
                                justify-between
                                gap-5
                                sm:flex-row
                                sm:items-end
                            "
                        >

                            <div>

                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        text-xs
                                        font-bold
                                        uppercase
                                        tracking-[0.16em]
                                        text-sky-600
                                    "
                                >

                                    <Users size={14} />

                                    CRM

                                </div>


                                <h1
                                    className="
                                        mt-2
                                        text-2xl
                                        font-black
                                        tracking-tight
                                        text-slate-950
                                        sm:text-3xl
                                    "
                                >
                                    Customers
                                </h1>


                                <p
                                    className="
                                        mt-2
                                        max-w-2xl
                                        text-sm
                                        leading-6
                                        text-slate-500
                                    "
                                >
                                    Manage customer profiles,
                                    service history, leads and
                                    appointments from one place.
                                </p>

                            </div>


                            <div
                                className="
                                    flex
                                    items-center
                                    gap-2
                                    rounded-2xl
                                    border
                                    border-slate-200
                                    bg-slate-50
                                    px-4
                                    py-3
                                "
                            >

                                <Users
                                    size={17}
                                    className="text-sky-500"
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
                                        Total customers
                                    </p>

                                    <p
                                        className="
                                            text-lg
                                            font-black
                                            text-slate-900
                                        "
                                    >
                                        {pagination.total}
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>


                {/* MAIN */}

                <div
                    className="
                        px-5
                        py-6
                        sm:px-8
                        lg:px-10
                    "
                >

                    {/* SEARCH */}

                    <div
                        className="
                            rounded-2xl
                            border
                            border-slate-200
                            bg-white
                            p-3
                            shadow-sm
                        "
                    >

                        <div
                            className="
                                relative
                            "
                        >

                            <Search
                                size={17}
                                className="
                                    pointer-events-none
                                    absolute
                                    left-3
                                    top-1/2
                                    -translate-y-1/2
                                    text-slate-400
                                "
                            />


                            <input
                                value={
                                    searchInput
                                }
                                onChange={
                                    event =>
                                        setSearchInput(
                                            event.target.value
                                        )
                                }
                                placeholder="
                                    Search customers by
                                    name, phone, email or address...
                                "
                                className="
                                    h-11
                                    w-full
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-slate-50
                                    pl-10
                                    pr-10
                                    text-sm
                                    font-medium
                                    text-slate-700
                                    outline-none
                                    transition
                                    placeholder:text-slate-400
                                    focus:border-sky-400
                                    focus:bg-white
                                    focus:ring-2
                                    focus:ring-sky-100
                                "
                            />


                            {searchInput && (

                                <button
                                    type="button"
                                    onClick={
                                        clearSearch
                                    }
                                    className="
                                        absolute
                                        right-2
                                        top-1/2
                                        flex
                                        h-8
                                        w-8
                                        -translate-y-1/2
                                        items-center
                                        justify-center
                                        rounded-lg
                                        text-slate-400
                                        hover:bg-slate-200
                                        hover:text-slate-700
                                    "
                                >
                                    <X size={15} />
                                </button>

                            )}

                        </div>

                    </div>


                    {/* ERROR */}

                    {error && (

                        <div
                            className="
                                mt-4
                                flex
                                items-start
                                gap-3
                                rounded-2xl
                                border
                                border-red-200
                                bg-red-50
                                p-4
                            "
                        >

                            <AlertCircle
                                size={18}
                                className="
                                    mt-0.5
                                    shrink-0
                                    text-red-500
                                "
                            />

                            <div>

                                <p
                                    className="
                                        text-sm
                                        font-bold
                                        text-red-700
                                    "
                                >
                                    Something went wrong
                                </p>

                                <p
                                    className="
                                        mt-1
                                        text-xs
                                        text-red-600
                                    "
                                >
                                    {error}
                                </p>

                            </div>

                        </div>

                    )}


                    {/* TABLE */}

                    <div
                        className="
                            mt-4
                            overflow-hidden
                            rounded-2xl
                            border
                            border-slate-200
                            bg-white
                            shadow-sm
                        "
                    >

                        {loading ? (

                            <div
                                className="
                                    flex
                                    min-h-[380px]
                                    items-center
                                    justify-center
                                "
                            >

                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-3
                                        text-sm
                                        font-semibold
                                        text-slate-500
                                    "
                                >

                                    <Loader2
                                        size={19}
                                        className="
                                            animate-spin
                                            text-sky-500
                                        "
                                    />

                                    Loading customers...

                                </div>

                            </div>

                        ) : customers.length === 0 ? (

                            <div
                                className="
                                    flex
                                    min-h-[380px]
                                    flex-col
                                    items-center
                                    justify-center
                                    px-6
                                    text-center
                                "
                            >

                                <div
                                    className="
                                        flex
                                        h-14
                                        w-14
                                        items-center
                                        justify-center
                                        rounded-2xl
                                        bg-slate-100
                                        text-slate-400
                                    "
                                >
                                    <Users size={25} />
                                </div>


                                <h3
                                    className="
                                        mt-4
                                        text-sm
                                        font-bold
                                        text-slate-800
                                    "
                                >
                                    No customers found
                                </h3>


                                <p
                                    className="
                                        mt-1
                                        max-w-sm
                                        text-xs
                                        leading-5
                                        text-slate-500
                                    "
                                >
                                    Try changing your search
                                    or wait for your first
                                    customer record.
                                </p>

                            </div>

                        ) : (

                            <>

                                {/* DESKTOP TABLE */}

                                <div
                                    className="
                                        hidden
                                        overflow-x-auto
                                        md:block
                                    "
                                >

                                    <table
                                        className="
                                            w-full
                                            min-w-[760px]
                                        "
                                    >

                                        <thead>

                                            <tr
                                                className="
                                                    border-b
                                                    border-slate-200
                                                    bg-slate-50/80
                                                "
                                            >

                                                <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-slate-400">
                                                    Customer
                                                </th>

                                                <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-slate-400">
                                                    Contact
                                                </th>

                                                <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-slate-400">
                                                    Address
                                                </th>

                                                <th className="px-5 py-3 text-center text-[11px] font-bold uppercase tracking-wide text-slate-400">
                                                    Leads
                                                </th>

                                                <th className="px-5 py-3 text-center text-[11px] font-bold uppercase tracking-wide text-slate-400">
                                                    Appointments
                                                </th>

                                                <th className="px-5 py-3" />

                                            </tr>

                                        </thead>


                                        <tbody>

                                            {customers.map(
                                                customer => (

                                                    <tr
                                                        key={
                                                            customer.id
                                                        }
                                                        onClick={() =>
                                                            openCustomer(
                                                                customer.id
                                                            )
                                                        }
                                                        className="
                                                            cursor-pointer
                                                            border-b
                                                            border-slate-100
                                                            transition
                                                            hover:bg-sky-50/40
                                                        "
                                                    >

                                                        <td className="px-5 py-4">

                                                            <div
                                                                className="
                                                                    flex
                                                                    items-center
                                                                    gap-3
                                                                "
                                                            >

                                                                <div
                                                                    className="
                                                                        flex
                                                                        h-10
                                                                        w-10
                                                                        shrink-0
                                                                        items-center
                                                                        justify-center
                                                                        rounded-xl
                                                                        bg-sky-100
                                                                        text-sm
                                                                        font-black
                                                                        text-sky-700
                                                                    "
                                                                >
                                                                    {customer.name
                                                                        ?.charAt(
                                                                            0
                                                                        )
                                                                        ?.toUpperCase()}
                                                                </div>


                                                                <div
                                                                    className="
                                                                        min-w-0
                                                                    "
                                                                >

                                                                    <p
                                                                        className="
                                                                            truncate
                                                                            text-sm
                                                                            font-bold
                                                                            text-slate-900
                                                                        "
                                                                    >
                                                                        {
                                                                            customer.name
                                                                        }
                                                                    </p>

                                                                    <p
                                                                        className="
                                                                            mt-0.5
                                                                            text-xs
                                                                            text-slate-400
                                                                        "
                                                                    >
                                                                        Customer
                                                                    </p>

                                                                </div>

                                                            </div>

                                                        </td>


                                                        <td className="px-5 py-4">

                                                            <div
                                                                className="
                                                                    space-y-1
                                                                    text-xs
                                                                    text-slate-500
                                                                "
                                                            >

                                                                {customer.phone && (

                                                                    <div
                                                                        className="
                                                                            flex
                                                                            items-center
                                                                            gap-2
                                                                        "
                                                                    >

                                                                        <Phone
                                                                            size={13}
                                                                        />

                                                                        {
                                                                            customer.phone
                                                                        }

                                                                    </div>

                                                                )}


                                                                {customer.email && (

                                                                    <div
                                                                        className="
                                                                            flex
                                                                            items-center
                                                                            gap-2
                                                                            max-w-[220px]
                                                                        "
                                                                    >

                                                                        <Mail
                                                                            size={13}
                                                                        />

                                                                        <span
                                                                            className="
                                                                                truncate
                                                                            "
                                                                        >
                                                                            {
                                                                                customer.email
                                                                            }
                                                                        </span>

                                                                    </div>

                                                                )}

                                                            </div>

                                                        </td>


                                                        <td className="px-5 py-4">

                                                            <div
                                                                className="
                                                                    flex
                                                                    max-w-[180px]
                                                                    items-center
                                                                    gap-2
                                                                    text-xs
                                                                    text-slate-500
                                                                "
                                                            >

                                                                <MapPin
                                                                    size={14}
                                                                    className="
                                                                        shrink-0
                                                                    "
                                                                />

                                                                <span
                                                                    className="
                                                                        truncate
                                                                    "
                                                                >
                                                                    {
                                                                        customer.address ||
                                                                        "—"
                                                                    }
                                                                </span>

                                                            </div>

                                                        </td>


                                                        <td className="px-5 py-4 text-center">

                                                            <span
                                                                className="
                                                                    inline-flex
                                                                    min-w-8
                                                                    justify-center
                                                                    rounded-full
                                                                    bg-violet-50
                                                                    px-2.5
                                                                    py-1
                                                                    text-xs
                                                                    font-bold
                                                                    text-violet-700
                                                                "
                                                            >
                                                                {customer
                                                                    ._count
                                                                    ?.leads ||
                                                                    0}
                                                            </span>

                                                        </td>


                                                        <td className="px-5 py-4 text-center">

                                                            <span
                                                                className="
                                                                    inline-flex
                                                                    min-w-8
                                                                    justify-center
                                                                    rounded-full
                                                                    bg-sky-50
                                                                    px-2.5
                                                                    py-1
                                                                    text-xs
                                                                    font-bold
                                                                    text-sky-700
                                                                "
                                                            >
                                                                {customer
                                                                    ._count
                                                                    ?.appointments ||
                                                                    0}
                                                            </span>

                                                        </td>


                                                        <td className="px-5 py-4 text-right">

                                                            <button
                                                                type="button"
                                                                onClick={
                                                                    event => {
                                                                        event.stopPropagation();
                                                                        openCustomer(
                                                                            customer.id
                                                                        );
                                                                    }
                                                                }
                                                                className="
                                                                    rounded-xl
                                                                    border
                                                                    border-slate-200
                                                                    px-3
                                                                    py-2
                                                                    text-xs
                                                                    font-bold
                                                                    text-slate-600
                                                                    transition
                                                                    hover:border-sky-200
                                                                    hover:bg-sky-50
                                                                    hover:text-sky-700
                                                                "
                                                            >
                                                                View
                                                            </button>

                                                        </td>

                                                    </tr>

                                                )
                                            )}

                                        </tbody>

                                    </table>

                                </div>


                                {/* MOBILE CARDS */}

                                <div
                                    className="
                                        divide-y
                                        divide-slate-100
                                        md:hidden
                                    "
                                >

                                    {customers.map(
                                        customer => (

                                            <button
                                                key={
                                                    customer.id
                                                }
                                                type="button"
                                                onClick={() =>
                                                    openCustomer(
                                                        customer.id
                                                    )
                                                }
                                                className="
                                                    block
                                                    w-full
                                                    p-4
                                                    text-left
                                                    transition
                                                    hover:bg-sky-50/40
                                                "
                                            >

                                                <div
                                                    className="
                                                        flex
                                                        items-start
                                                        gap-3
                                                    "
                                                >

                                                    <div
                                                        className="
                                                            flex
                                                            h-11
                                                            w-11
                                                            shrink-0
                                                            items-center
                                                            justify-center
                                                            rounded-xl
                                                            bg-sky-100
                                                            text-sm
                                                            font-black
                                                            text-sky-700
                                                        "
                                                    >
                                                        {customer.name
                                                            ?.charAt(
                                                                0
                                                            )
                                                            ?.toUpperCase()}
                                                    </div>


                                                    <div className="min-w-0 flex-1">

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
                                                                        truncate
                                                                        text-sm
                                                                        font-bold
                                                                        text-slate-900
                                                                    "
                                                                >
                                                                    {
                                                                        customer.name
                                                                    }
                                                                </p>

                                                                <p
                                                                    className="
                                                                        mt-1
                                                                        text-xs
                                                                        text-slate-500
                                                                    "
                                                                >
                                                                    {
                                                                        customer.phone ||
                                                                        customer.email ||
                                                                        "No contact information"
                                                                    }
                                                                </p>

                                                            </div>


                                                            <span
                                                                className="
                                                                    shrink-0
                                                                    rounded-xl
                                                                    bg-sky-50
                                                                    px-2
                                                                    py-1
                                                                    text-[11px]
                                                                    font-bold
                                                                    text-sky-700
                                                                "
                                                            >
                                                                View
                                                            </span>

                                                        </div>


                                                        <div
                                                            className="
                                                                mt-3
                                                                flex
                                                                flex-wrap
                                                                gap-2
                                                            "
                                                        >

                                                            <span
                                                                className="
                                                                    rounded-lg
                                                                    bg-violet-50
                                                                    px-2.5
                                                                    py-1.5
                                                                    text-[11px]
                                                                    font-bold
                                                                    text-violet-700
                                                                "
                                                            >
                                                                {
                                                                    customer
                                                                        ._count
                                                                        ?.leads ||
                                                                    0
                                                                }{" "}
                                                                leads
                                                            </span>


                                                            <span
                                                                className="
                                                                    rounded-lg
                                                                    bg-sky-50
                                                                    px-2.5
                                                                    py-1.5
                                                                    text-[11px]
                                                                    font-bold
                                                                    text-sky-700
                                                                "
                                                            >
                                                                {
                                                                    customer
                                                                        ._count
                                                                        ?.appointments ||
                                                                    0
                                                                }{" "}
                                                                appointments
                                                            </span>

                                                        </div>

                                                    </div>

                                                </div>

                                            </button>

                                        )
                                    )}

                                </div>


                                {/* PAGINATION */}

                                <div
                                    className="
                                        flex
                                        flex-col
                                        gap-3
                                        border-t
                                        border-slate-200
                                        bg-slate-50/60
                                        px-4
                                        py-3
                                        sm:flex-row
                                        sm:items-center
                                        sm:justify-between
                                        sm:px-5
                                    "
                                >

                                    <p
                                        className="
                                            text-xs
                                            font-semibold
                                            text-slate-500
                                        "
                                    >
                                        Page{" "}
                                        {pagination.page}{" "}
                                        of{" "}
                                        {
                                            pagination.totalPages
                                        }
                                    </p>


                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-2
                                        "
                                    >

                                        <button
                                            type="button"
                                            onClick={
                                                previousPage
                                            }
                                            disabled={
                                                page <= 1
                                            }
                                            className="
                                                flex
                                                h-9
                                                items-center
                                                gap-1
                                                rounded-xl
                                                border
                                                border-slate-200
                                                bg-white
                                                px-3
                                                text-xs
                                                font-bold
                                                text-slate-600
                                                transition
                                                hover:bg-slate-100
                                                disabled:cursor-not-allowed
                                                disabled:opacity-40
                                            "
                                        >

                                            <ChevronLeft
                                                size={15}
                                            />

                                            Previous

                                        </button>


                                        <button
                                            type="button"
                                            onClick={
                                                nextPage
                                            }
                                            disabled={
                                                page >=
                                                pagination.totalPages
                                            }
                                            className="
                                                flex
                                                h-9
                                                items-center
                                                gap-1
                                                rounded-xl
                                                bg-slate-900
                                                px-3
                                                text-xs
                                                font-bold
                                                text-white
                                                transition
                                                hover:bg-slate-800
                                                disabled:cursor-not-allowed
                                                disabled:opacity-40
                                            "
                                        >

                                            Next

                                            <ChevronRight
                                                size={15}
                                            />

                                        </button>

                                    </div>

                                </div>

                            </>

                        )}

                    </div>

                </div>

            </div>


            {/* CUSTOMER LOADING */}

            {customerLoading && (

                <div
                    className="
                        fixed
                        inset-0
                        z-[60]
                        flex
                        items-center
                        justify-center
                        bg-slate-950/20
                        backdrop-blur-[2px]
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            gap-3
                            rounded-2xl
                            border
                            border-slate-200
                            bg-white
                            px-5
                            py-4
                            shadow-xl
                        "
                    >

                        <Loader2
                            size={18}
                            className="
                                animate-spin
                                text-sky-500
                            "
                        />

                        <span
                            className="
                                text-sm
                                font-bold
                                text-slate-700
                            "
                        >
                            Loading customer...
                        </span>

                    </div>

                </div>

            )}


            {selectedCustomer && (

                <CustomerDetails
                    customer={
                        selectedCustomer
                    }
                    onClose={() =>
                        setSelectedCustomer(
                            null
                        )
                    }
                />

            )}

        </DashboardLayout>
    );
};


export default Customers;