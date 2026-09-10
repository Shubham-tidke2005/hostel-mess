
import { useNavigate } from "react-router-dom";
import {
    LogOut,
    UserCircle,
} from "lucide-react";
import toast from "react-hot-toast";


function Navbar() {
    const navigate = useNavigate();


    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        toast.success("Logged out successfully.");

        navigate("/", {
            replace: true,
        });
    };


    return (
        <header className="hidden h-20 border-b border-slate-200 bg-white lg:flex">

            <div className="flex w-full items-center justify-between px-6">

                {/* Left */}
                <div>
                    <h2 className="text-lg font-bold text-[#1A1A1A]">
                        Hostel Management System
                    </h2>

                    <p className="mt-0.5 text-sm text-[#6C757D]">
                        Manage your hostel efficiently
                    </p>
                </div>


                {/* Right */}
                <div className="flex items-center gap-4">

                    {/* User */}
                    <button
                        type="button"
                        onClick={() => navigate("/profile")}
                        className="flex items-center gap-3 rounded-xl px-3 py-2 transition hover:bg-slate-50"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
                            <UserCircle className="h-5 w-5 text-[#2563EB]" />
                        </div>

                        <div className="hidden text-left xl:block">
                            <p className="text-sm font-semibold text-[#1A1A1A]">
                                User
                            </p>

                            <p className="text-xs text-[#6C757D]">
                                Account
                            </p>
                        </div>
                    </button>


                    {/* Logout */}
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#6C757D] transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                    >
                        <LogOut className="h-4 w-4" />

                        <span>
                            Logout
                        </span>
                    </button>

                </div>

            </div>

        </header>
    );
}

export default Navbar;

