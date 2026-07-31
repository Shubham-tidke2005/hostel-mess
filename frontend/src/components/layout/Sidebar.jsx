import {
    LayoutDashboard,
    GraduationCap,
    Building2,
    BedDouble,
    ClipboardList,
    UtensilsCrossed,
    User,
    LogOut,
    X,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Sidebar({ sidebarOpen, setSidebarOpen }) {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const menuItems = [
        {
            title: "Dashboard",
            path: "/dashboard",
            icon: LayoutDashboard,
        },
        {
            title: "Students",
            path: "/students",
            icon: GraduationCap,
        },
        {
            title: "Hostels",
            path: "/hostels",
            icon: Building2,
        },
        {
            title: "Rooms",
            path: "/rooms",
            icon: BedDouble,
        },
        {
            title: "Bookings",
            path: "/bookings",
            icon: ClipboardList,
        },
        {
            title: "Mess Menu",
            path: "/mess",
            icon: UtensilsCrossed,
        },
        {
            title: "Profile",
            path: "/profile",
            icon: User,
        },
    ];

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <>
            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed top-0 left-0 z-50 h-screen w-72
                    bg-white border-r border-gray-200
                    shadow-lg transition-transform duration-300
                    lg:translate-x-0
                    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
                `}
            >
                {/* Header */}
                <div className="flex h-16 items-center justify-between border-b px-6">

                    <div>
                        <h2 className="text-xl font-bold text-[#1A1A1A]">
                            HostelMS
                        </h2>

                        <p className="text-xs text-[#6C757D]">
                            Admin Panel
                        </p>
                    </div>

                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden"
                    >
                        <X />
                    </button>

                </div>

                {/* Navigation */}
                <nav className="mt-6 flex flex-col gap-2 px-4">

                    {menuItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <NavLink
                                key={item.title}
                                to={item.path}
                                onClick={() => setSidebarOpen(false)}
                                className={({ isActive }) =>
                                    `
                                    flex items-center gap-3
                                    rounded-xl px-4 py-3
                                    transition-all duration-300
                                    ${
                                        isActive
                                            ? "bg-[#2563EB] text-white shadow-md"
                                            : "text-[#6C757D] hover:bg-[#2563EB]/10 hover:text-[#2563EB]"
                                    }
                                `
                                }
                            >
                                <Icon size={20} />

                                <span className="font-medium">
                                    {item.title}
                                </span>
                            </NavLink>
                        );
                    })}

                </nav>

                {/* Logout */}
                <div className="absolute bottom-6 left-4 right-4">

                    <button
                        onClick={handleLogout}
                        className="
                            flex w-full items-center justify-center gap-2
                            rounded-xl bg-red-500 py-3 text-white
                            transition-all duration-300
                            hover:bg-red-600
                        "
                    >
                        <LogOut size={18} />
                        Logout
                    </button>

                </div>

            </aside>
        </>
    );
}

export default Sidebar;