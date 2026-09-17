import {
    Mail,
    Phone,
    Users,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

const Customers = () => {
    return (
        <DashboardLayout
            activePath="/admin/customers"
        >
            <div className="min-h-screen">

                <div className="border-b border-slate-200 bg-white">
                    <div className="px-5 py-7 sm:px-8 lg:px-10">

                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-sky-600">
                            Customer management
                        </p>

                        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                            Customers
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            View customers captured through your AI receptionist.
                        </p>

                    </div>
                </div>


                <div className="px-5 py-6 sm:px-8 lg:px-10">

                    <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 text-center">

                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
                            <Users size={24} />
                        </div>

                        <h2 className="mt-4 text-base font-bold text-slate-900">
                            Customer workspace
                        </h2>

                        <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                            Customer records will appear here once the customer API is connected.
                        </p>

                    </div>

                </div>

            </div>
        </DashboardLayout>
    );
};

export default Customers;