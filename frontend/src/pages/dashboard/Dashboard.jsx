import { useEffect, useState } from "react";
import {
    Users,
    Building2,
    BedDouble,
    ClipboardList,
    CalendarDays,
    Coffee,
    Soup,
    Moon,
    Utensils,
    ArrowRight,
    RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import StatCard from "./StatCard";
import OccupancyCard from "./OccupancyCard";
import { getDashboardStats } from "../../services/dashboardService";
import { getMenus } from "../../services/messService";

import RecentBookings from "./RecentBookings";
import BookingStatusChart from "./BookingStatusChart";
import OccupancyLineChart from "./OccupancyLineChart";
import QuickActions from "./QuickActions";
import LoadingSkeleton from "./LoadingSkeleton";
import ErrorState from "./ErrorState";

function Dashboard() {
    const navigate = useNavigate();

    // ==========================================
    // Dashboard Error
    // ==========================================
    const [error, setError] = useState("");

    // ==========================================
    // Dashboard Statistics
    // ==========================================
    const [stats, setStats] = useState({
        students: 0,
        hostels: 0,
        rooms: 0,
        bookings: 0,
    });

    // ==========================================
    // Occupancy
    // ==========================================
    const [occupancy, setOccupancy] = useState({
        totalRooms: 0,
        occupiedRooms: 0,
    });

    // ==========================================
    // Dashboard Loading
    // ==========================================
    const [loading, setLoading] = useState(true);

    // ==========================================
    // Today's Menu
    // ==========================================
    const [todayMenu, setTodayMenu] = useState(null);
    const [menuLoading, setMenuLoading] = useState(true);

    // ==========================================
    // Get Today's Date
    // ==========================================
    const getTodayDate = () => {
        const today = new Date();

        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    // ==========================================
    // Format Today's Date
    // ==========================================
    const formatTodayDate = () => {
        return new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };

    // ==========================================
    // Fetch Dashboard Statistics
    // ==========================================
    const fetchStats = async () => {
        try {
            setLoading(true);

            const data = await getDashboardStats();

            setStats({
                students: data.students?.length || 0,
                hostels: data.hostels?.length || 0,
                rooms: data.rooms?.length || 0,
                bookings: data.bookings?.length || 0,
            });

            const rooms = data.rooms || [];

            const occupiedRooms = rooms.filter(
                (room) => Number(room.occupied_beds) > 0
            ).length;

            setOccupancy({
                totalRooms: rooms.length,
                occupiedRooms,
            });

            setError("");
        } catch (error) {
            console.error("Dashboard Error:", error);

            setError("Unable to load dashboard data.");
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // Fetch Today's Mess Menu
    // ==========================================
    const fetchTodayMenu = async () => {
        try {
            setMenuLoading(true);

            const data = await getMenus();

            const menus = Array.isArray(data)
                ? data
                : Array.isArray(data?.results)
                ? data.results
                : [];

            const today = getTodayDate();

            const menu = menus.find(
                (item) => item.menu_date === today
            );

            setTodayMenu(menu || null);
        } catch (error) {
            console.error("Today's Menu Error:", error);

            setTodayMenu(null);

            toast.error("Unable to load today's mess menu.");
        } finally {
            setMenuLoading(false);
        }
    };

    // ==========================================
    // Initial Load
    // ==========================================
    useEffect(() => {
        fetchStats();
        fetchTodayMenu();
    }, []);

    // ==========================================
    // Dashboard Loading
    // ==========================================
    if (loading) {
        return <LoadingSkeleton height="h-[600px]" />;
    }

    // ==========================================
    // Dashboard Error
    // ==========================================
    if (error) {
        return (
            <ErrorState
                message={error}
                onRetry={fetchStats}
            />
        );
    }

    // ==========================================
    // Dashboard
    // ==========================================
    return (
        <div className="space-y-8">

            {/* ==================================
                Header
            ================================== */}
            <div>
                <h1 className="text-4xl font-bold text-[#1A1A1A]">
                    Dashboard
                </h1>

                <p className="mt-2 text-[#6C757D]">
                    Welcome to Hostel Management System
                </p>
            </div>

            {/* ==================================
                Quick Actions
            ================================== */}
            <QuickActions />

            {/* ==================================
                Statistics Cards
            ================================== */}
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

                <StatCard
                    title="Students"
                    value={stats.students}
                    icon={Users}
                    color="bg-blue-600"
                />

                <StatCard
                    title="Hostels"
                    value={stats.hostels}
                    icon={Building2}
                    color="bg-green-600"
                />

                <StatCard
                    title="Rooms"
                    value={stats.rooms}
                    icon={BedDouble}
                    color="bg-orange-500"
                />

                <StatCard
                    title="Bookings"
                    value={stats.bookings}
                    icon={ClipboardList}
                    color="bg-purple-600"
                />

            </div>

            {/* ==================================
                Occupancy Section
            ================================== */}
            <div className="grid gap-6 lg:grid-cols-2">

                <OccupancyCard
                    totalRooms={occupancy.totalRooms}
                    occupiedRooms={occupancy.occupiedRooms}
                />

                <OccupancyLineChart />

            </div>

            {/* ==================================
                Analytics + Today's Menu
            ================================== */}
            <div className="grid gap-6 lg:grid-cols-2">

                <BookingStatusChart />

                {/* Today's Menu */}
                <TodayMenuDashboard
                    menu={todayMenu}
                    loading={menuLoading}
                    onRefresh={fetchTodayMenu}
                    onViewFull={() => navigate("/mess/today")}
                />

            </div>

            {/* ==================================
                Recent Bookings
            ================================== */}
            <RecentBookings />

        </div>
    );
}

/* =================================================
   Today's Menu Dashboard Card
================================================= */

function TodayMenuDashboard({
    menu,
    loading,
    onRefresh,
    onViewFull,
}) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                <div>
                    <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]">
                            <Utensils size={20} />
                        </div>

                        <div>
                            <h2 className="text-lg font-bold text-[#1A1A1A]">
                                Today's Menu
                            </h2>

                            <div className="mt-1 flex items-center gap-1.5 text-xs text-[#6C757D]">
                                <CalendarDays size={13} />
                                {formatDashboardDate()}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">

                    {/* Refresh */}
                    <button
                        type="button"
                        onClick={onRefresh}
                        disabled={loading}
                        title="Refresh today's menu"
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-[#6C757D] transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-[#2563EB] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <RefreshCw
                            size={16}
                            className={
                                loading
                                    ? "animate-spin"
                                    : ""
                            }
                        />
                    </button>

                    {/* Full Menu */}
                    <button
                        type="button"
                        onClick={onViewFull}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-3.5 py-2 text-xs font-semibold text-white transition-all hover:bg-blue-700"
                    >
                        Full Menu
                        <ArrowRight size={14} />
                    </button>

                </div>
            </div>

            {/* Loading */}
            {loading && (
                <div className="mt-6 grid grid-cols-1 gap-3">

                    {[1, 2, 3].map((item) => (
                        <div
                            key={item}
                            className="animate-pulse rounded-xl bg-gray-100 p-4"
                        >
                            <div className="h-3 w-20 rounded bg-gray-200" />

                            <div className="mt-3 h-4 w-4/5 rounded bg-gray-200" />
                        </div>
                    ))}

                </div>
            )}

            {/* No Menu */}
            {!loading && !menu && (
                <div className="mt-6 rounded-xl border border-dashed border-gray-300 bg-[#F8F9FA] px-5 py-8 text-center">

                    <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-white text-gray-400 shadow-sm">
                        <Utensils size={21} />
                    </div>

                    <h3 className="mt-3 text-sm font-bold text-[#1A1A1A]">
                        No menu available today
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-[#6C757D]">
                        The mess menu for today has not been added yet.
                    </p>

                    <button
                        type="button"
                        onClick={onViewFull}
                        className="mt-4 text-xs font-semibold text-[#2563EB] hover:text-blue-700"
                    >
                        View Mess Menu →
                    </button>

                </div>
            )}

            {/* Menu */}
            {!loading && menu && (
                <div className="mt-6 space-y-3">

                    {/* Breakfast */}
                    <DashboardMeal
                        icon={<Coffee size={17} />}
                        title="Breakfast"
                        content={menu.breakfast}
                    />

                    {/* Lunch */}
                    <DashboardMeal
                        icon={<Soup size={17} />}
                        title="Lunch"
                        content={menu.lunch}
                    />

                    {/* Dinner */}
                    <DashboardMeal
                        icon={<Moon size={17} />}
                        title="Dinner"
                        content={menu.dinner}
                    />

                </div>
            )}

        </div>
    );
}

/* =================================================
   Dashboard Meal
================================================= */

function DashboardMeal({ icon, title, content }) {
    return (
        <div className="rounded-xl border border-gray-100 bg-[#F8F9FA] p-3.5 transition-all hover:border-blue-100 hover:bg-blue-50/30">

            <div className="flex items-start gap-3">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#2563EB] shadow-sm">
                    {icon}
                </div>

                <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#6C757D]">
                        {title}
                    </p>

                    <p className="mt-1 text-sm leading-5 text-[#1A1A1A]">
                        {content || "Not specified"}
                    </p>
                </div>

            </div>

        </div>
    );
}

/* =================================================
   Date Helper
================================================= */

function formatDashboardDate() {
    return new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

export default Dashboard;