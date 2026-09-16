import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowRight,
    LockKeyhole,
    Mail,
    ShieldCheck,
} from "lucide-react";

import { login } from "../services/authApi";

const Login = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");

        if (!formData.email.trim() || !formData.password) {
            setError("Please enter your email and password.");
            return;
        }

        try {
            setLoading(true);

            const result = await login(formData);

            const { token, user } = result.data;

            localStorage.setItem("authToken", token);
            localStorage.setItem(
                "authUser",
                JSON.stringify(user)
            );

            navigate("/admin");
        } catch (error) {
            console.error("Login error:", error);

            setError(
                error.message ||
                "Unable to sign in. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950">
            <div className="flex min-h-screen">

                {/* LEFT SIDE */}
                <div className="relative hidden overflow-hidden lg:flex lg:w-1/2">
                    <div className="absolute inset-0 bg-gradient-to-br from-sky-950 via-slate-950 to-slate-950" />

                    <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">

                        {/* BRAND */}
                        <div>
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500 text-white shadow-lg shadow-sky-500/20">
                                    <ShieldCheck size={21} />
                                </div>

                                <div>
                                    <p className="text-sm font-bold text-white">
                                        CoolAir
                                    </p>

                                    <p className="text-xs text-slate-400">
                                        Business Dashboard
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* MESSAGE */}
                        <div className="max-w-lg">
                            <p className="mb-4 text-sm font-semibold text-sky-400">
                                AI RECEPTIONIST
                            </p>

                            <h1 className="text-4xl font-bold leading-tight tracking-tight text-white xl:text-5xl">
                                Turn customer conversations
                                into booked service calls.
                            </h1>

                            <p className="mt-6 max-w-md text-base leading-7 text-slate-400">
                                Manage leads, appointments and
                                customer requests from one
                                centralized workspace.
                            </p>
                        </div>

                        {/* FOOTER */}
                        <p className="text-xs text-slate-500">
                            Secure business workspace
                        </p>
                    </div>
                </div>

                {/* RIGHT SIDE */}
                <div className="flex w-full items-center justify-center bg-white px-5 py-10 sm:px-8 lg:w-1/2">
                    <div className="w-full max-w-md">

                        {/* MOBILE BRAND */}
                        <div className="mb-10 flex items-center gap-3 lg:hidden">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500 text-white">
                                <ShieldCheck size={21} />
                            </div>

                            <div>
                                <p className="text-sm font-bold text-slate-900">
                                    CoolAir
                                </p>

                                <p className="text-xs text-slate-500">
                                    Business Dashboard
                                </p>
                            </div>
                        </div>

                        {/* HEADING */}
                        <div className="mb-8">
                            <p className="mb-2 text-sm font-semibold text-sky-600">
                                ADMIN PORTAL
                            </p>

                            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                                Welcome back
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                Sign in to manage your business
                                leads and appointments.
                            </p>
                        </div>

                        {/* FORM */}
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >
                            {/* EMAIL */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Email address
                                </label>

                                <div className="relative">
                                    <Mail
                                        size={17}
                                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="admin@example.com"
                                        className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-50"
                                    />
                                </div>
                            </div>

                            {/* PASSWORD */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Password
                                </label>

                                <div className="relative">
                                    <LockKeyhole
                                        size={17}
                                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Enter your password"
                                        className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-50"
                                    />
                                </div>
                            </div>

                            {/* ERROR */}
                            {error && (
                                <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3">
                                    <p className="text-sm font-medium text-red-600">
                                        {error}
                                    </p>
                                </div>
                            )}

                            {/* SUBMIT */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-3 text-sm font-bold text-white shadow-sm shadow-sky-600/20 transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? (
                                    "Signing in..."
                                ) : (
                                    <>
                                        Sign in

                                        <ArrowRight
                                            size={16}
                                            className="transition-transform group-hover:translate-x-0.5"
                                        />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* SECURITY NOTE */}
                        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-400">
                            <ShieldCheck size={14} />

                            <span>
                                Protected business access
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

