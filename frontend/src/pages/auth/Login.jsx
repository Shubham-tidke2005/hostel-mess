import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, Lock, User } from "lucide-react";
import toast from "react-hot-toast";

import { loginUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const data = await loginUser(formData);

            login(data);

            toast.success("Login Successful!");

            navigate("/dashboard");
        } catch (error) {
            toast.error(
                error.response?.data?.detail ||
                "Invalid Username or Password"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-[#F8F9FA]">

            {/* Left Section */}

            <div className="hidden w-1/2 items-center justify-center bg-[#2563EB] lg:flex">

                <div className="max-w-md text-white">

                    <h1 className="mb-4 text-5xl font-bold">
                        Hostel Management System
                    </h1>

                    <p className="text-lg opacity-90">
                        Manage students, rooms, hostels, bookings,
                        and mess menu from one place.
                    </p>

                </div>

            </div>

            {/* Right Section */}

            <div className="flex flex-1 items-center justify-center p-6">

                <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-8 shadow-xl">

                    <div className="mb-8 text-center">

                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#2563EB] text-white">

                            <LogIn size={30} />

                        </div>

                        <h2 className="text-3xl font-bold text-[#1A1A1A]">
                            Welcome Back
                        </h2>

                        <p className="mt-2 text-[#6C757D]">
                            Login to continue
                        </p>

                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >

                        <div>

                            <label className="mb-2 block text-sm font-medium">
                                Username
                            </label>

                            <div className="relative">

                                <User
                                    className="absolute left-3 top-3 text-gray-400"
                                    size={18}
                                />

                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="Enter username"
                                    required
                                    className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-4 focus:border-[#2563EB] focus:outline-none"
                                />

                            </div>

                        </div>

                        <div>

                            <label className="mb-2 block text-sm font-medium">
                                Password
                            </label>

                            <div className="relative">

                                <Lock
                                    className="absolute left-3 top-3 text-gray-400"
                                    size={18}
                                />

                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter password"
                                    required
                                    className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-4 focus:border-[#2563EB] focus:outline-none"
                                />

                            </div>

                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-xl bg-[#2563EB] py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? "Signing In..." : "Login"}
                        </button>

                    </form>

                </div>

            </div>

        </div>
    );
}

export default Login;