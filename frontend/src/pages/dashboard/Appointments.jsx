import {
    CalendarDays,
    Clock3,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

const Appointments = () => {
    return (
        <DashboardLayout
            activePath="/admin/appointments"
        >
            <div className="min-h-screen">

                <div className="border-b border-slate-200 bg-white">
                    <div className="px-5 py-7 sm:px-8 lg:px-10">

                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-sky-600">
                            Scheduling
                        </p>

                        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                            Appointments
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            Manage customer appointments and technician assignments.
                        </p>

                    </div>
                </div>


                <div className="px-5 py-6 sm:px-8 lg:px-10">

                    <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 text-center">

                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
                            <CalendarDays size={24} />
                        </div>

                        <h2 className="mt-4 text-base font-bold text-slate-900">
                            Appointment workspace
                        </h2>

                        <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                            The appointment interface is ready for the scheduling API integration.
                        </p>

                        <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-500">

                            <Clock3 size={13} />

                            Scheduling module

                        </div>

                    </div>

                </div>

            </div>
        </DashboardLayout>
    );
};

export default Appointments;