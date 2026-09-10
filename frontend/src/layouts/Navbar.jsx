import { useState } from "react";
import {
    Menu,
    LogOut,
    UserCircle,
    ChevronDown,
    X,
} from "lucide-react";
import {
    useLocation,
    useNavigate,
} from "react-router-dom";
import toast from "react-hot-toast";

function Navbar({ onMenuClick, sidebarOpen = false }) {
    const navigate = useNavigate();
    const location = useLocation();

    const [profileOpen, setProfileOpen] = useState(false);

    // ==========================================
    // Get logged-in user
    // ==========================================
    const getStoredUser = () => {
        try {
            const user =
                localStorage.getItem("user") ||
                localStorage.getItem("current_user");

            return user ? JSON.parse(user) : null;
        } catch {
            return null;
        }
    };

    const user = getStoredUser();

    const userName =
        user?.full_name ||
        user?.name ||
        user?.first_name ||
        user?.username ||
        "User";

    const userEmail =
        user?.email ||
        user?.user?.email ||
        "";

    const initials = userName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0])
        .join("")
        .toUpperCase();

    const isAdmin =
        localStorage.getItem("is_staff") === "true" ||
        localStorage.getItem("is_admin") === "true" ||
        localStorage.getItem("role") === "admin" ||
        user?.is_staff === true ||
        user?.is_admin === true ||
        user?.role === "admin";

    // ==========================================
    // Page title
    // ==========================================
    const pageTitles = {
        "/dashboard": "Dashboard",
        "/students": "Students",
        "/hostels": "Hostels",
        "/rooms": "Rooms",
        "/bookings": "Bookings",
        "/mess": "Mess Management",
        "/mess/today": "Today's Menu",
        "/profile": "My Profile",
        "/profile/edit": "Edit Profile",
        "/profile/change-password": "Change Password",
    };

    const getPageTitle = () => {
        if (pageTitles[location.pathname]) {
            return pageTitles[location.pathname];
        }

        if (location.pathname.startsWith("/students/")) {
            return "Student Details";
        }

        if (location.pathname.startsWith("/hostels/")) {
            return "Hostel Details";
        }

        if (location.pathname.startsWith("/rooms/")) {
            return "Room Details";
        }

        if (location.pathname.startsWith("/bookings/")) {
            return "Booking Details";
        }

        if (location.pathname.startsWith("/mess/")) {
            return "Mess Management";
        }

        return "Hostel Management";
    };

    // ==========================================
    // Logout
    // ==========================================
    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
        localStorage.removeItem("current_user");
        localStorage.removeItem("is_staff");
        localStorage.removeItem("is_admin");
        localStorage.removeItem("role");

        setProfileOpen(false);

        toast.success("Logged out successfully.");

        navigate("/", {
            replace: true,
        });
    };

    return (
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
            <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">

                {/* =====================================
                    Left Section
                ====================================== */}
                <div className="flex min-w-0 items-center gap-3">

                    {/* Mobile Menu */}
                    <button
                        type="button"
                        onClick={onMenuClick}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-600 transition-all hover:bg-slate-100 hover:text-slate-900 lg:hidden"
                        aria-label={
                            sidebarOpen
                                ? "Close navigation"
                                : "Open navigation"
                        }
                    >
                        {sidebarOpen ? (
                            <X className="h-5 w-5" />
                        ) : (
                            <Menu className="h-5 w-5" />
                        )}
                    </button>

                    {/* Page Heading */}
                    <div className="min-w-0">
                        <h2 className="truncate text-lg font-bold text-[#1A1A1A] sm:text-xl">
                            {getPageTitle()}
                        </h2>

                        <p className="hidden text-sm text-[#6C757D] sm:block">
                            Hostel Management System
                        </p>
                    </div>
                </div>

                {/* =====================================
                    Right Section
                ====================================== */}
                <div className="flex items-center gap-2 sm:gap-3">

                    {/* Profile */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() =>
                                setProfileOpen(
                                    (prev) => !prev
                                )
                            }
                            className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition-all hover:bg-slate-50 sm:px-3"
                        >
                            {/* Avatar */}
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-[#2563EB]">
                                {initials || (
                                    <UserCircle className="h-5 w-5" />
                                )}
                            </div>

                            {/* User */}
                            <div className="hidden text-left xl:block">
                                <p className="max-w-[150px] truncate text-sm font-semibold text-[#1A1A1A]">
                                    {userName}
                                </p>

                                <p className="text-xs text-[#6C757D]">
                                    {isAdmin
                                        ? "Administrator"
                                        : "Student"}
                                </p>
                            </div>

                            <ChevronDown
                                className={`hidden h-4 w-4 text-slate-400 transition-transform xl:block ${
                                    profileOpen
                                        ? "rotate-180"
                                        : ""
                                }`}
                            />
                        </button>

                        {/* =================================
                            Profile Dropdown
                        ================================== */}
                        {profileOpen && (
                            <div className="absolute right-0 top-14 z-50 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">

                                {/* User Info */}
                                <div className="border-b border-slate-100 bg-slate-50 px-4 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 font-bold text-[#2563EB]">
                                            {initials || (
                                                <UserCircle className="h-6 w-6" />
                                            )}
                                        </div>

                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-bold text-[#1A1A1A]">
                                                {userName}
                                            </p>

                                            <p className="truncate text-xs text-[#6C757D]">
                                                {userEmail ||
                                                    (isAdmin
                                                        ? "Administrator"
                                                        : "Student")}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Profile */}
                                <div className="p-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setProfileOpen(false);
                                            navigate("/profile");
                                        }}
                                        className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-[#1A1A1A] transition-all hover:bg-slate-50"
                                    >
                                        <UserCircle className="h-5 w-5 text-[#6C757D]" />
                                        My Profile
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setProfileOpen(false);
                                            navigate(
                                                "/profile/change-password"
                                            );
                                        }}
                                        className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-[#1A1A1A] transition-all hover:bg-slate-50"
                                    >
                                        <span className="flex h-5 w-5 items-center justify-center text-[#6C757D]">
                                            🔒
                                        </span>
                                        Change Password
                                    </button>
                                </div>

                                {/* Logout */}
                                <div className="border-t border-slate-100 p-2">
                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-red-600 transition-all hover:bg-red-50"
                                    >
                                        <LogOut className="h-5 w-5" />
                                        Logout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Desktop Logout */}
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#6C757D] transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600 md:flex"
                    >
                        <LogOut className="h-4 w-4" />
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
}

export default Navbar;