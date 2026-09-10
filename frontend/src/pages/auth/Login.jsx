
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    LockKeyhole,
    User,
    Eye,
    EyeOff,
    LogIn,
} from "lucide-react";
import toast from "react-hot-toast";

import { loginUser } from "../../services/authService";

function Login() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username.trim() || !password) {
            toast.error("Please enter username and password.");
            return;
        }

        try {
            setLoading(true);

            console.log("Logging in...");

            const data = await loginUser({
                username: username.trim(),
                password: password,
            });

            console.log("Login response:", data);

            // Check whether backend returned tokens
            if (!data.access || !data.refresh) {
                toast.error("Login response does not contain JWT tokens.");
                console.error("Invalid login response:", data);
                return;
            }

            // Save JWT tokens
            localStorage.setItem("access_token", data.access);
            localStorage.setItem("refresh_token", data.refresh);

            console.log(
                "Access token saved:",
                localStorage.getItem("access_token")
            );

            toast.success("Login successful!");

            // Redirect to dashboard
            navigate("/dashboard", { replace: true });

        } catch (error) {
            console.error("Login Error:", error);

            console.error("Backend response:", error.response?.data);

            const message =
                error.response?.data?.detail ||
                "Invalid username or password.";

            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-md">

                {/* Logo */}
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2563EB] text-white shadow-lg">
                        <LockKeyhole size={28} />
                    </div>

                    <h1 className="text-3xl font-bold text-[#1A1A1A]">
                        Hostel Management
                    </h1>

                    <p className="mt-2 text-[#6C757D]">
                        Sign in to your account
                    </p>
                </div>

                {/* Card */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >

                        {/* Username */}
                        <div>
                            <label
                                htmlFor="username"
                                className="mb-2 block text-sm font-semibold text-[#1A1A1A]"
                            >
                                Username
                            </label>

                            <div className="relative">
                                <User
                                    size={19}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6C757D]"
                                />

                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) =>
                                        setUsername(e.target.value)
                                    }
                                    placeholder="Enter username"
                                    autoComplete="username"
                                    className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#2563EB] focus:ring-4 focus:ring-blue-100"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label
                                htmlFor="password"
                                className="mb-2 block text-sm font-semibold text-[#1A1A1A]"
                            >
                                Password
                            </label>

                            <div className="relative">
                                <LockKeyhole
                                    size={19}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6C757D]"
                                />

                                <input
                                    id="password"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    placeholder="Enter password"
                                    autoComplete="current-password"
                                    className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-12 text-sm outline-none transition focus:border-[#2563EB] focus:ring-4 focus:ring-blue-100"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6C757D] hover:text-[#1A1A1A]"
                                >
                                    {showPassword ? (
                                        <EyeOff size={19} />
                                    ) : (
                                        <Eye size={19} />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2563EB] py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? (
                                <>
                                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    <LogIn size={19} />
                                    Sign In
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <p className="mt-6 text-center text-xs text-[#6C757D]">
                    © {new Date().getFullYear()} Hostel & Mess Management
                    System
                </p>
            </div>
        </div>
    );
}

export default Login;

