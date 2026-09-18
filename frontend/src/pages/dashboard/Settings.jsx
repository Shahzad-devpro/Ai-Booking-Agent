import {
    Check,
    Mail,
    Save,
    Settings as SettingsIcon,
    User,
} from "lucide-react";

import {
    useEffect,
    useState
} from "react";

import DashboardLayout
    from "../../components/dashboard/DashboardLayout";

import {
    getNotificationSettings,
    updateNotificationSettings
} from "../../services/notificationApi";


const Settings = () => {

    const user =
        JSON.parse(
            localStorage.getItem(
                "authUser"
            ) || "null"
        );


    const [
        notificationSettings,
        setNotificationSettings
    ] = useState({
        businessEmail: "",
        leadCreated: true,
        appointmentBooked: true,
        appointmentCancelled: true,
        appointmentRescheduled: true,
        customerEmails: true
    });


    const [
        loading,
        setLoading
    ] = useState(true);


    const [
        saving,
        setSaving
    ] = useState(false);


    const [
        error,
        setError
    ] = useState("");


    const [
        success,
        setSuccess
    ] = useState("");


    useEffect(() => {

        const loadSettings =
            async () => {

                try {

                    setLoading(true);
                    setError("");

                    const response =
                        await getNotificationSettings();

                    if (
                        response?.data
                    ) {

                        setNotificationSettings(
                            response.data
                        );
                    }

                } catch (error) {

                    console.error(
                        "Failed to load notification settings:",
                        error
                    );

                    setError(
                        error.message ||
                        "Failed to load notification settings"
                    );

                } finally {

                    setLoading(false);
                }
            };


        loadSettings();

    }, []);


    const handleToggle =
        field => {

            setNotificationSettings(
                current => ({
                    ...current,

                    [field]:
                        !current[field]
                })
            );

            setSuccess("");
            setError("");
        };


    const handleEmailChange =
        event => {

            setNotificationSettings(
                current => ({
                    ...current,

                    businessEmail:
                        event.target.value
                })
            );

            setSuccess("");
            setError("");
        };


    const handleSave =
        async event => {

            event.preventDefault();

            try {

                setSaving(true);
                setError("");
                setSuccess("");

                const response =
                    await updateNotificationSettings(
                        notificationSettings
                    );

                if (
                    response?.data
                ) {

                    setNotificationSettings(
                        response.data
                    );
                }

                setSuccess(
                    "Notification settings saved successfully."
                );

            } catch (error) {

                console.error(
                    "Failed to save notification settings:",
                    error
                );

                setError(
                    error.message ||
                    "Failed to save notification settings"
                );

            } finally {

                setSaving(false);
            }
        };


    return (
        <DashboardLayout
            activePath="/admin/settings"
        >

            <div className="min-h-screen">

                {/* HEADER */}

                <div className="border-b border-slate-200 bg-white">

                    <div className="px-5 py-7 sm:px-8 lg:px-10">

                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-sky-600">
                            Workspace
                        </p>

                        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                            Settings
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            Manage your administrator account, business workspace and notifications.
                        </p>

                    </div>

                </div>


                <div className="space-y-5 px-5 py-6 sm:px-8 lg:px-10">

                    {/* ACCOUNT */}

                    <section className="rounded-2xl border border-slate-200 bg-white">

                        <div className="border-b border-slate-200 p-5">

                            <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                                    <User size={18} />
                                </div>

                                <div>

                                    <h2 className="text-sm font-bold text-slate-900">
                                        Administrator account
                                    </h2>

                                    <p className="mt-0.5 text-xs text-slate-400">
                                        Your authenticated workspace identity
                                    </p>

                                </div>

                            </div>

                        </div>


                        <div className="grid gap-5 p-5 sm:grid-cols-2">

                            <div>

                                <div className="mb-2 flex items-center gap-2">

                                    <User
                                        size={14}
                                        className="text-slate-400"
                                    />

                                    <label className="text-xs font-bold text-slate-500">
                                        Name
                                    </label>

                                </div>

                                <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-700">
                                    {user?.name ||
                                        "Administrator"}
                                </div>

                            </div>


                            <div>

                                <div className="mb-2 flex items-center gap-2">

                                    <Mail
                                        size={14}
                                        className="text-slate-400"
                                    />

                                    <label className="text-xs font-bold text-slate-500">
                                        Email
                                    </label>

                                </div>

                                <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-700">
                                    {user?.email ||
                                        "—"}
                                </div>

                            </div>

                        </div>

                    </section>


                    {/* NOTIFICATIONS */}

                    <section className="rounded-2xl border border-slate-200 bg-white">

                        <div className="border-b border-slate-200 p-5">

                            <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                    <Mail size={18} />
                                </div>

                                <div>

                                    <h2 className="text-sm font-bold text-slate-900">
                                        Notification settings
                                    </h2>

                                    <p className="mt-0.5 text-xs text-slate-400">
                                        Control business and customer email notifications.
                                    </p>

                                </div>

                            </div>

                        </div>


                        {loading ? (

                            <div className="p-6">

                                <div className="animate-pulse space-y-4">

                                    <div className="h-10 rounded-xl bg-slate-100" />

                                    <div className="h-14 rounded-xl bg-slate-100" />

                                    <div className="h-14 rounded-xl bg-slate-100" />

                                    <div className="h-14 rounded-xl bg-slate-100" />

                                </div>

                            </div>

                        ) : (

                            <form
                                onSubmit={
                                    handleSave
                                }
                                className="p-5"
                            >

                                {/* BUSINESS EMAIL */}

                                <div>

                                    <label
                                        htmlFor="businessEmail"
                                        className="mb-2 block text-xs font-bold text-slate-600"
                                    >
                                        Business notification email
                                    </label>

                                    <div className="relative">

                                        <Mail
                                            size={16}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                        />

                                        <input
                                            id="businessEmail"
                                            type="email"
                                            value={
                                                notificationSettings.businessEmail
                                            }
                                            onChange={
                                                handleEmailChange
                                            }
                                            placeholder="owner@yourbusiness.com"
                                            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-50"
                                        />

                                    </div>

                                    <p className="mt-2 text-xs leading-5 text-slate-400">
                                        Business notifications such as new leads and appointment changes will be sent here.
                                    </p>

                                </div>


                                {/* BUSINESS NOTIFICATIONS */}

                                <div className="mt-6">

                                    <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
                                        Business notifications
                                    </h3>


                                    <div className="mt-3 divide-y divide-slate-100 rounded-xl border border-slate-200">

                                        <NotificationToggle
                                            label="New lead received"
                                            description="Notify the business when the AI receptionist creates a qualified lead."
                                            enabled={
                                                notificationSettings.leadCreated
                                            }
                                            onClick={() =>
                                                handleToggle(
                                                    "leadCreated"
                                                )
                                            }
                                        />


                                        <NotificationToggle
                                            label="Appointment booked"
                                            description="Notify the business when a customer successfully books an appointment."
                                            enabled={
                                                notificationSettings.appointmentBooked
                                            }
                                            onClick={() =>
                                                handleToggle(
                                                    "appointmentBooked"
                                                )
                                            }
                                        />


                                        <NotificationToggle
                                            label="Appointment cancelled"
                                            description="Notify the business when a booked appointment is cancelled."
                                            enabled={
                                                notificationSettings.appointmentCancelled
                                            }
                                            onClick={() =>
                                                handleToggle(
                                                    "appointmentCancelled"
                                                )
                                            }
                                        />


                                        <NotificationToggle
                                            label="Appointment rescheduled"
                                            description="Notify the business when an appointment is moved to another time."
                                            enabled={
                                                notificationSettings.appointmentRescheduled
                                            }
                                            onClick={() =>
                                                handleToggle(
                                                    "appointmentRescheduled"
                                                )
                                            }
                                        />

                                    </div>

                                </div>


                                {/* CUSTOMER EMAILS */}

                                <div className="mt-6">

                                    <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
                                        Customer communication
                                    </h3>


                                    <div className="mt-3 rounded-xl border border-slate-200">

                                        <NotificationToggle
                                            label="Customer confirmation emails"
                                            description="Send customers confirmation, cancellation and rescheduling emails when they provide an email address."
                                            enabled={
                                                notificationSettings.customerEmails
                                            }
                                            onClick={() =>
                                                handleToggle(
                                                    "customerEmails"
                                                )
                                            }
                                        />

                                    </div>

                                </div>


                                {/* FEEDBACK */}

                                {error && (

                                    <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                        {error}
                                    </div>

                                )}


                                {success && (

                                    <div className="mt-5 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">

                                        <Check
                                            size={16}
                                        />

                                        {success}

                                    </div>

                                )}


                                {/* SAVE */}

                                <div className="mt-6 flex justify-end">

                                    <button
                                        type="submit"
                                        disabled={
                                            saving
                                        }
                                        className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
                                    >

                                        <Save
                                            size={16}
                                        />

                                        {saving
                                            ? "Saving..."
                                            : "Save notification settings"}

                                    </button>

                                </div>

                            </form>

                        )}

                    </section>


                    {/* BUSINESS */}

                    <section className="rounded-2xl border border-slate-200 bg-white">

                        <div className="border-b border-slate-200 p-5">

                            <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                                    <SettingsIcon
                                        size={18}
                                    />
                                </div>

                                <div>

                                    <h2 className="text-sm font-bold text-slate-900">
                                        Business configuration
                                    </h2>

                                    <p className="mt-0.5 text-xs text-slate-400">
                                        Business settings will be connected here.
                                    </p>

                                </div>

                            </div>

                        </div>


                        <div className="p-5">

                            <div className="rounded-xl bg-slate-50 p-4">

                                <p className="text-xs font-bold text-slate-600">
                                    AI receptionist configuration
                                </p>

                                <p className="mt-1 text-xs leading-5 text-slate-400">
                                    Business hours, timezone, services, technicians and receptionist behavior will be configurable here as the settings system expands.
                                </p>

                            </div>

                        </div>

                    </section>

                </div>

            </div>

        </DashboardLayout>
    );
};


/* ============================================================
   TOGGLE COMPONENT
============================================================ */

const NotificationToggle = ({
    label,
    description,
    enabled,
    onClick
}) => {

    return (
        <button
            type="button"
            onClick={onClick}
            className="flex w-full items-center justify-between gap-5 px-4 py-4 text-left transition hover:bg-slate-50"
        >

            <div className="min-w-0">

                <p className="text-sm font-semibold text-slate-800">
                    {label}
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-400">
                    {description}
                </p>

            </div>


            <span
                className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                    enabled
                        ? "bg-sky-600"
                        : "bg-slate-200"
                }`}
            >

                <span
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
                        enabled
                            ? "left-6"
                            : "left-1"
                    }`}
                />

            </span>

        </button>
    );
};


export default Settings;