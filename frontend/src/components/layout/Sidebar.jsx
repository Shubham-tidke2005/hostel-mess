import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    Building2,
    BedDouble,
    ClipboardList,
    UtensilsCrossed,
    UserCircle,
    X,
} from "lucide-react";

function Sidebar({ isOpen, onClose }) {
    const menuItems = [
        {
            name: "Dashboard",
            path: "/dashboard",
            icon: LayoutDashboard,
        },
        {
            name: "Students",
            path: "/students",
            icon: Users,
        },
        {
            name: "Hostels",
            path: "/hostels",
            icon: Building2,
        },
        {
            name: "Rooms",
            path: "/rooms",
            icon: BedDouble,
        },
        {
            name: "Bookings",
            path: "/bookings",
            icon: ClipboardList,
        },
        {
            name: "Mess",
            path: "/mess",
            icon: UtensilsCrossed,
        },
        {
            name: "Profile",
            path: "/profile",
            icon: UserCircle,
        },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed inset-y-0 left-0 z-50
                    flex w-72 flex-col
                    border-r border-slate-200
                    bg-white
                    transition-transform duration-300
                    lg:static lg:z-auto lg:translate-x-0
                    ${isOpen ? "translate-x-0" : "-translate-x-full"}
                `}
            >
                {/* Logo / Brand */}
                <div className="flex h-20 items-center justify-between border-b border-slate-200 px-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2563EB] text-white shadow-sm">
                            <Building2 className="h-5 w-5" />
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

                    {/* Mobile Close Button */}
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-2 text-[#6C757D] transition hover:bg-slate-100 hover:text-[#1A1A1A] lg:hidden"
                        aria-label="Close sidebar"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto px-4 py-6">
                    <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-[#6C757D]">
                        Main Menu
                    </p>

                    <div className="space-y-1.5">
                        {menuItems.map((item) => {
                            const Icon = item.icon;

                            return (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    onClick={onClose}
                                    className={({ isActive }) =>
                                        `
                                        group flex items-center gap-3
                                        rounded-xl px-3.5 py-3
                                        text-sm font-medium
                                        transition-all duration-200
                                        ${
                                            isActive
                                                ? "bg-blue-50 text-[#2563EB] shadow-sm"
                                                : "text-[#6C757D] hover:bg-slate-50 hover:text-[#1A1A1A]"
                                        }
                                        `
                                    }
                                >
                                    {({ isActive }) => (
                                        <>
                                            <Icon
                                                className={`
                                                    h-5 w-5 shrink-0
                                                    transition-transform duration-200
                                                    group-hover:scale-105
                                                    ${
                                                        isActive
                                                            ? "text-[#2563EB]"
                                                            : "text-[#6C757D]"
                                                    }
                                                `}
                                            />

                                            <span>{item.name}</span>
                                        </>
                                    )}
                                </NavLink>
                            );
                        })}
                    </div>
                </nav>

                {/* Bottom Section */}
                <div className="border-t border-slate-200 p-4">
                    <div className="rounded-xl bg-slate-50 p-4">
                        <p className="text-xs font-semibold text-[#1A1A1A]">
                            Hostel Management
                        </p>

                        <p className="mt-1 text-xs leading-5 text-[#6C757D]">
                            Manage students, rooms, bookings and mess
                            operations from one place.
                        </p>
                    </div>
                </div>
            </aside>
        </>
    );
}

export default Sidebar;