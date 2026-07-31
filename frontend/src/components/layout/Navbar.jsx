import { Menu, Bell, Search, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Navbar({ toggleSidebar }) {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <header className="sticky top-0 z-50 border-b border-gray-200 bg-[#F8F9FA]/80 backdrop-blur-md">

            <div className="mx-auto flex h-16 items-center justify-between px-4 md:px-8">

                {/* Left */}

                <div className="flex items-center gap-4">

                    {/* Mobile Menu */}

                    <button
                        onClick={toggleSidebar}
                        className="rounded-lg p-2 transition hover:bg-gray-200 lg:hidden"
                    >
                        <Menu size={22} />
                    </button>

                    {/* Logo */}

                    <div className="flex items-center gap-2">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2563EB] text-lg font-bold text-white">
                            H
                        </div>

                        <div>
                            <h1 className="text-lg font-bold text-[#1A1A1A]">
                                HostelMS
                            </h1>

                            <p className="text-xs text-[#6C757D]">
                                Management System
                            </p>
                        </div>

                    </div>

                </div>

                {/* Search */}

                <div className="hidden w-1/3 lg:block">

                    <div className="relative">

                        <Search
                            className="absolute left-3 top-3 text-gray-400"
                            size={18}
                        />

                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-10 pr-4 outline-none transition focus:border-[#2563EB]"
                        />

                    </div>

                </div>

                {/* Right */}

                <div className="flex items-center gap-3">

                    {/* Notification */}

                    <button className="rounded-xl p-2 transition hover:bg-gray-200">

                        <Bell size={21} />

                    </button>

                    {/* Profile */}

                    <div className="hidden items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 py-2 md:flex">

                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2563EB] text-white">

                            <User size={18} />

                        </div>

                        <div>

                            <p className="text-sm font-semibold text-[#1A1A1A]">
                                Admin
                            </p>

                            <p className="text-xs text-[#6C757D]">
                                Administrator
                            </p>

                        </div>

                    </div>

                    {/* Logout */}

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-white transition-all duration-300 hover:bg-red-600"
                    >

                        <LogOut size={18} />

                        <span className="hidden md:block">
                            Logout
                        </span>

                    </button>

                </div>

            </div>

        </header>
    );
}

export default Navbar;