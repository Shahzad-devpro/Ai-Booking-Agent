import {
    useEffect,
    useState
} from "react";

import {
    AlertCircle,
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    Clock3,
    Loader2,
    Search,
    Users,
    X
} from "lucide-react";

import DashboardLayout
    from "../../components/dashboard/DashboardLayout";

import AppointmentDetails
    from "./AppointmentDetails";

import {
    getAppointments,
    getAppointmentById,
    getTechnicians,
    cancelAppointment,
    rescheduleAppointment,
    assignTechnician
} from "../../services/appointmentApi";

import {
    formatBusinessDate,
    formatBusinessTime
} from "../../utils/timezone";


const STATUS_OPTIONS = [
    {
        value: "",
        label: "All statuses"
    },
    {
        value: "BOOKED",
        label: "Booked"
    },
    {
        value: "COMPLETED",
        label: "Completed"
    },
    {
        value: "CANCELLED",
        label: "Cancelled"
    }
];


const formatService =
    service => {

        if (!service) {
            return "—";
        }


        return service
            .replace(/_/g, " ")
            .toLowerCase()
            .replace(
                /\b\w/g,
                letter =>
                    letter.toUpperCase()
            );
    };


const getStatusClasses =
    status => {

        switch (status) {

            case "BOOKED":

                return "bg-emerald-50 text-emerald-700";

            case "COMPLETED":

                return "bg-violet-50 text-violet-700";

            case "CANCELLED":

                return "bg-slate-100 text-slate-600";

            default:

                return "bg-slate-100 text-slate-600";
        }
    };


const Appointments = () => {

    const [
        appointments,
        setAppointments
    ] = useState([]);


    const [
        technicians,
        setTechnicians
    ] = useState([]);


    const [
        loading,
        setLoading
    ] = useState(true);


    const [
        technicianLoading,
        setTechnicianLoading
    ] = useState(true);


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
        status,
        setStatus
    ] = useState("");


    const [
        technicianId,
        setTechnicianId
    ] = useState("");


    const [
        date,
        setDate
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
        selectedAppointment,
        setSelectedAppointment
    ] = useState(null);


    const [
        appointmentLoading,
        setAppointmentLoading
    ] = useState(false);


    const [
        cancelling,
        setCancelling
    ] = useState(false);


    const [
        rescheduling,
        setRescheduling
    ] = useState(false);


    const [
        assigning,
        setAssigning
    ] = useState(false);


    // ============================================================
    // SEARCH DEBOUNCE
    // ============================================================

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


    // ============================================================
    // LOAD TECHNICIANS
    // ============================================================

    useEffect(() => {

        let cancelled =
            false;


        const loadTechnicians =
            async () => {

                try {

                    setTechnicianLoading(
                        true
                    );


                    const response =
                        await getTechnicians();


                    if (cancelled) {
                        return;
                    }


                    const technicianData =
                        Array.isArray(
                            response?.data
                        )
                            ? response.data
                            : [];


                    setTechnicians(
                        technicianData
                    );


                } catch (err) {

                    if (!cancelled) {

                        console.error(
                            "Failed to load technicians:",
                            err
                        );

                        setError(
                            err.message ||
                            "Failed to load technicians"
                        );

                    }

                } finally {

                    if (!cancelled) {

                        setTechnicianLoading(
                            false
                        );

                    }
                }
            };


        loadTechnicians();


        return () => {

            cancelled = true;

        };

    }, []);


    // ============================================================
    // LOAD APPOINTMENTS
    // ============================================================

    useEffect(() => {

        let cancelled =
            false;


        const loadAppointments =
            async () => {

                try {

                    setLoading(
                        true
                    );

                    setError("");


                    const response =
                        await getAppointments({
                            search,
                            status,
                            technicianId,
                            date,
                            page,
                            limit: 10
                        });


                    if (cancelled) {
                        return;
                    }


                    const data =
                        response?.data;


                    setAppointments(
                        Array.isArray(
                            data?.appointments
                        )
                            ? data.appointments
                            : []
                    );


                    setPagination({

                        total:
                            Number(
                                data?.total
                            ) || 0,

                        page:
                            Number(
                                data?.page
                            ) || page,

                        limit:
                            Number(
                                data?.limit
                            ) || 10,

                        totalPages:
                            Math.max(
                                1,
                                Number(
                                    data?.totalPages
                                ) || 1
                            )

                    });


                } catch (err) {

                    if (cancelled) {
                        return;
                    }


                    console.error(
                        "Failed to load appointments:",
                        err
                    );


                    setError(
                        err.message ||
                        "Failed to load appointments"
                    );


                } finally {

                    if (!cancelled) {

                        setLoading(
                            false
                        );

                    }
                }
            };


        loadAppointments();


        return () => {

            cancelled = true;

        };

    }, [
        search,
        status,
        technicianId,
        date,
        page
    ]);


    // ============================================================
    // OPEN DETAILS
    // ============================================================

    const openAppointment =
        async appointmentId => {

            try {

                setAppointmentLoading(
                    true
                );

                setSelectedAppointment(
                    null
                );

                setError("");


                const response =
                    await getAppointmentById(
                        appointmentId
                    );


                if (!response?.data) {

                    throw new Error(
                        "Appointment data was not returned by the server"
                    );

                }


                setSelectedAppointment(
                    response.data
                );


            } catch (err) {

                console.error(
                    "Failed to fetch appointment:",
                    err
                );


                setError(
                    err.message ||
                    "Failed to load appointment"
                );


            } finally {

                setAppointmentLoading(
                    false
                );
            }
        };


    // ============================================================
    // CANCEL
    // ============================================================

    const handleCancel =
        async () => {

            if (!selectedAppointment) {
                return;
            }


            const confirmed =
                window.confirm(
                    "Cancel this appointment?"
                );


            if (!confirmed) {
                return;
            }


            try {

                setCancelling(
                    true
                );

                setError("");


                const response =
                    await cancelAppointment(
                        selectedAppointment.id
                    );


                if (response?.data) {

                    setSelectedAppointment(
                        response.data
                    );


                    setAppointments(
                        current =>
                            current.map(
                                appointment =>
                                    appointment.id ===
                                    response.data.id
                                        ? {
                                            ...appointment,
                                            ...response.data
                                        }
                                        : appointment
                            )
                    );

                }

            } catch (err) {

                console.error(
                    "Failed to cancel appointment:",
                    err
                );


                setError(
                    err.message ||
                    "Failed to cancel appointment"
                );


            } finally {

                setCancelling(
                    false
                );
            }
        };


    // ============================================================
    // RESCHEDULE
    // ============================================================

    const handleReschedule =
        async (
            startTime,
            endTime
        ) => {

            if (!selectedAppointment) {
                return;
            }


            try {

                setRescheduling(
                    true
                );

                setError("");


                const response =
                    await rescheduleAppointment({
                        appointmentId:
                            selectedAppointment.id,

                        startTime,

                        endTime
                    });


                if (response?.data) {

                    setSelectedAppointment(
                        response.data
                    );


                    setAppointments(
                        current =>
                            current.map(
                                appointment =>
                                    appointment.id ===
                                    response.data.id
                                        ? {
                                            ...appointment,
                                            ...response.data
                                        }
                                        : appointment
                            )
                    );

                }

            } catch (err) {

                console.error(
                    "Failed to reschedule appointment:",
                    err
                );


                setError(
                    err.message ||
                    "Failed to reschedule appointment"
                );


            } finally {

                setRescheduling(
                    false
                );
            }
        };


    // ============================================================
    // MANUAL TECHNICIAN ASSIGNMENT
    // ============================================================

    const handleAssignTechnician =
        async technicianIdValue => {

            if (
                !selectedAppointment ||
                !technicianIdValue
            ) {
                return;
            }


            try {

                setAssigning(
                    true
                );

                setError("");


                const response =
                    await assignTechnician({
                        appointmentId:
                            selectedAppointment.id,

                        technicianId:
                            technicianIdValue
                    });


                if (response?.data) {

                    setSelectedAppointment(
                        response.data
                    );


                    setAppointments(
                        current =>
                            current.map(
                                appointment =>
                                    appointment.id ===
                                    response.data.id
                                        ? {
                                            ...appointment,
                                            ...response.data
                                        }
                                        : appointment
                            )
                    );

                }

            } catch (err) {

                console.error(
                    "Failed to assign technician:",
                    err
                );


                setError(
                    err.message ||
                    "Failed to assign technician"
                );


            } finally {

                setAssigning(
                    false
                );
            }
        };


    // ============================================================
    // FILTERS
    // ============================================================

    const handleStatusChange =
        value => {

            setStatus(
                value
            );

            setPage(1);
        };


    const handleTechnicianChange =
        value => {

            setTechnicianId(
                value
            );

            setPage(1);
        };


    const handleDateChange =
        value => {

            setDate(
                value
            );

            setPage(1);
        };


    const clearDate =
        () => {

            setDate("");

            setPage(1);
        };


    const clearFilters =
        () => {

            setSearchInput("");
            setSearch("");
            setStatus("");
            setTechnicianId("");
            setDate("");
            setPage(1);
        };


    // ============================================================
    // PAGINATION
    // ============================================================

    const firstVisible =
        pagination.total === 0
            ? 0
            :
                (
                    (page - 1) *
                    pagination.limit
                ) + 1;


    const lastVisible =
        Math.min(
            page *
                pagination.limit,
            pagination.total
        );


    return (

        <DashboardLayout
            activePath="/admin/appointments"
        >

            <div className="min-h-screen">

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="border-b border-slate-200 bg-white">

                    <div className="px-5 py-7 sm:px-8 lg:px-10">

                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-sky-600">
                            Operations
                        </p>


                        <div className="mt-1 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

                            <div>

                                <h1 className="text-2xl font-extrabold tracking-tight text-slate-950">
                                    Appointments
                                </h1>


                                <p className="mt-1 text-sm text-slate-500">
                                    Manage bookings, technicians and schedules.
                                </p>

                            </div>


                            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">

                                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                                    Total appointments
                                </p>


                                <p className="mt-1 text-xl font-extrabold text-slate-900">
                                    {pagination.total}
                                </p>

                            </div>

                        </div>

                    </div>

                </div>


                <div className="px-5 py-6 sm:px-8 lg:px-10">

                    {/* =================================================
                        ERROR
                    ================================================= */}

                    {error && (

                        <div className="mb-5 flex items-start justify-between gap-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">

                            <div className="flex items-start gap-3">

                                <AlertCircle
                                    size={18}
                                    className="mt-0.5 shrink-0 text-red-600"
                                />


                                <p className="text-sm font-semibold text-red-700">
                                    {error}
                                </p>

                            </div>


                            <button
                                type="button"
                                onClick={() =>
                                    setError("")
                                }
                                className="text-red-400 hover:text-red-600"
                            >
                                <X size={16} />
                            </button>

                        </div>

                    )}


                    {/* =================================================
                        FILTER BAR
                    ================================================= */}

                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

                        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_180px_190px_180px_auto]">

                            <div className="relative">

                                <Search
                                    size={16}
                                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
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
                                    placeholder="Search customer, phone, service or technician..."
                                    className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                                />

                            </div>


                            <select
                                value={
                                    status
                                }
                                onChange={
                                    event =>
                                        handleStatusChange(
                                            event.target.value
                                        )
                                }
                                className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                            >

                                {STATUS_OPTIONS.map(
                                    option => (

                                        <option
                                            key={
                                                option.value
                                            }
                                            value={
                                                option.value
                                            }
                                        >
                                            {
                                                option.label
                                            }
                                        </option>

                                    )
                                )}

                            </select>


                            <select
                                value={
                                    technicianId
                                }
                                onChange={
                                    event =>
                                        handleTechnicianChange(
                                            event.target.value
                                        )
                                }
                                disabled={
                                    technicianLoading
                                }
                                className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 disabled:bg-slate-50"
                            >

                                <option value="">
                                    {
                                        technicianLoading
                                            ? "Loading technicians..."
                                            : "All technicians"
                                    }
                                </option>


                                {technicians.map(
                                    technician => (

                                        <option
                                            key={
                                                technician.id
                                            }
                                            value={
                                                technician.id
                                            }
                                        >
                                            {
                                                technician.name
                                            }
                                        </option>

                                    )
                                )}

                            </select>


                            <div className="relative">

                                <CalendarDays
                                    size={16}
                                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                />


                                <input
                                    type="date"
                                    value={
                                        date
                                    }
                                    onChange={
                                        event =>
                                            handleDateChange(
                                                event.target.value
                                            )
                                    }
                                    className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-9 text-sm font-semibold text-slate-600 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                                />


                                {date && (

                                    <button
                                        type="button"
                                        onClick={
                                            clearDate
                                        }
                                        className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                                    >
                                        <X
                                            size={14}
                                        />
                                    </button>

                                )}

                            </div>


                            <button
                                type="button"
                                onClick={
                                    clearFilters
                                }
                                className="h-11 rounded-xl border border-slate-200 px-4 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                            >
                                Clear
                            </button>

                        </div>

                    </div>


                    {/* =================================================
                        TABLE
                    ================================================= */}

                    <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                        {loading ? (

                            <div className="flex min-h-[420px] items-center justify-center">

                                <Loader2
                                    size={30}
                                    className="animate-spin text-sky-600"
                                />

                            </div>

                        ) : appointments.length === 0 ? (

                            <div className="flex min-h-[420px] items-center justify-center px-6 text-center">

                                <div>

                                    <CalendarDays
                                        size={34}
                                        className="mx-auto text-slate-300"
                                    />


                                    <h3 className="mt-3 text-sm font-bold text-slate-700">
                                        No appointments found
                                    </h3>


                                    <p className="mt-1 text-sm text-slate-400">
                                        Try changing your search or filters.
                                    </p>

                                </div>

                            </div>

                        ) : (

                            <div className="overflow-x-auto">

                                <table className="min-w-[900px] w-full">

                                    <thead>

                                        <tr className="border-b border-slate-200 bg-slate-50">

                                            <th className="px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.12em] text-slate-400">
                                                Customer
                                            </th>


                                            <th className="px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.12em] text-slate-400">
                                                Schedule
                                            </th>


                                            <th className="px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.12em] text-slate-400">
                                                Service
                                            </th>


                                            <th className="px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.12em] text-slate-400">
                                                Technician
                                            </th>


                                            <th className="px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.12em] text-slate-400">
                                                Status
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody className="divide-y divide-slate-100">

                                        {appointments.map(
                                            appointment => (

                                                <tr
                                                    key={
                                                        appointment.id
                                                    }
                                                    onClick={() =>
                                                        openAppointment(
                                                            appointment.id
                                                        )
                                                    }
                                                    className="cursor-pointer transition hover:bg-slate-50"
                                                >

                                                    <td className="px-5 py-4">

                                                        <p className="text-sm font-bold text-slate-800">
                                                            {
                                                                appointment.customer?.name ||
                                                                "Unknown customer"
                                                            }
                                                        </p>


                                                        <p className="mt-1 text-xs text-slate-400">
                                                            {
                                                                appointment.customer?.phone ||
                                                                "No phone"
                                                            }
                                                        </p>

                                                    </td>


                                                    <td className="px-5 py-4">

                                                        <div className="flex items-start gap-2">

                                                            <Clock3
                                                                size={14}
                                                                className="mt-0.5 shrink-0 text-slate-400"
                                                            />


                                                            <div>

                                                                <p className="text-sm font-semibold text-slate-700">
                                                                    {
                                                                        formatBusinessDate(
                                                                            appointment.startTime
                                                                        )
                                                                    }
                                                                </p>


                                                                <p className="mt-1 text-xs text-slate-400">

                                                                    {
                                                                        formatBusinessTime(
                                                                            appointment.startTime
                                                                        )
                                                                    }

                                                                    {" — "}

                                                                    {
                                                                        formatBusinessTime(
                                                                            appointment.endTime
                                                                        )
                                                                    }

                                                                </p>

                                                            </div>

                                                        </div>

                                                    </td>


                                                    <td className="px-5 py-4">

                                                        <p className="text-sm font-semibold text-slate-700">
                                                            {
                                                                formatService(
                                                                    appointment.lead?.service
                                                                )
                                                            }
                                                        </p>


                                                        {appointment.lead?.urgency ===
                                                            "EMERGENCY" && (

                                                            <span className="mt-1 inline-flex rounded-full bg-red-50 px-2 py-0.5 text-[9px] font-bold uppercase text-red-700">
                                                                Emergency
                                                            </span>

                                                        )}

                                                    </td>


                                                    <td className="px-5 py-4">

                                                        <div className="flex items-center gap-2">

                                                            <Users
                                                                size={14}
                                                                className="shrink-0 text-slate-400"
                                                            />


                                                            <span className="text-sm font-semibold text-slate-600">

                                                                {
                                                                    appointment.technician?.name ||
                                                                    "Not assigned"
                                                                }

                                                            </span>

                                                        </div>

                                                    </td>


                                                    <td className="px-5 py-4">

                                                        <span
                                                            className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${getStatusClasses(
                                                                appointment.status
                                                            )}`}
                                                        >
                                                            {
                                                                appointment.status
                                                            }
                                                        </span>

                                                    </td>

                                                </tr>

                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </div>


                    {/* =================================================
                        PAGINATION
                    ================================================= */}

                    {!loading &&
                        pagination.total > 0 && (

                        <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">

                            <p className="text-xs font-medium text-slate-400">

                                Showing{" "}

                                <span className="font-bold text-slate-600">
                                    {firstVisible}
                                </span>

                                {" – "}

                                <span className="font-bold text-slate-600">
                                    {lastVisible}
                                </span>

                                {" of "}

                                <span className="font-bold text-slate-600">
                                    {pagination.total}
                                </span>

                            </p>


                            <div className="flex items-center gap-2">

                                <button
                                    type="button"
                                    onClick={() =>
                                        setPage(
                                            current =>
                                                Math.max(
                                                    1,
                                                    current - 1
                                                )
                                        )
                                    }
                                    disabled={
                                        page <= 1
                                    }
                                    className="flex h-9 items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                                >

                                    <ChevronLeft
                                        size={15}
                                    />

                                    Previous

                                </button>


                                <span className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600">
                                    Page {page} of{" "}
                                    {
                                        pagination.totalPages
                                    }
                                </span>


                                <button
                                    type="button"
                                    onClick={() =>
                                        setPage(
                                            current =>
                                                Math.min(
                                                    pagination.totalPages,
                                                    current + 1
                                                )
                                        )
                                    }
                                    disabled={
                                        page >=
                                        pagination.totalPages
                                    }
                                    className="flex h-9 items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                                >

                                    Next

                                    <ChevronRight
                                        size={15}
                                    />

                                </button>

                            </div>

                        </div>

                    )}

                </div>


                {/* =====================================================
                    DETAILS DRAWER
                ===================================================== */}

                {(selectedAppointment ||
                    appointmentLoading) && (

                    <AppointmentDetails
                        appointment={
                            selectedAppointment
                        }

                        loading={
                            appointmentLoading
                        }

                        technicians={
                            technicians
                        }

                        onClose={() =>
                            setSelectedAppointment(
                                null
                            )
                        }

                        onCancel={
                            handleCancel
                        }

                        onReschedule={
                            handleReschedule
                        }

                        onAssignTechnician={
                            handleAssignTechnician
                        }

                        cancelling={
                            cancelling
                        }

                        rescheduling={
                            rescheduling
                        }

                        assigning={
                            assigning
                        }
                    />

                )}

            </div>

        </DashboardLayout>
    );
};


export default Appointments;