import { useEffect, useState } from "react";
import {
    CalendarDays,
    Coffee,
    Soup,
    Moon,
    Utensils,
    RefreshCw,
    ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { getMenus } from "../../services/messService";

function TodayMenu() {
    const navigate = useNavigate();

    const [menu, setMenu] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // -----------------------------
    // Get today's date
    // -----------------------------
    const getTodayDate = () => {
        const today = new Date();

        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    // -----------------------------
    // Format date
    // -----------------------------
    const formatDate = (dateString) => {
        if (!dateString) return "";

        const date = new Date(`${dateString}T00:00:00`);

        return date.toLocaleDateString("en-IN", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };

    // -----------------------------
    // Fetch today's menu
    // -----------------------------
    const fetchTodayMenu = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getMenus();

            const menus = Array.isArray(data)
                ? data
                : Array.isArray(data?.results)
                ? data.results
                : [];

            const today = getTodayDate();

            const todayMenu = menus.find(
                (item) => item.menu_date === today
            );

            setMenu(todayMenu || null);

            if (!todayMenu) {
                setError("No mess menu has been added for today.");
            }
        } catch (err) {
            console.error("Failed to load today's menu:", err);

            const message =
                err?.response?.data?.detail ||
                err?.response?.data?.message ||
                "Failed to load today's menu.";

            setError(message);
            setMenu(null);

            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTodayMenu();
    }, []);

    // -----------------------------
    // Loading state
    // -----------------------------
    if (loading) {
        return (
            <div className="min-h-screen bg-[#F8F9FA]">
                <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">

                    <div className="animate-pulse">
                        <div className="h-4 w-36 rounded bg-gray-200" />

                        <div className="mt-5 flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-gray-200" />

                            <div>
                                <div className="h-8 w-52 rounded bg-gray-200" />
                                <div className="mt-3 h-4 w-64 rounded bg-gray-200" />
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
                        <div className="animate-pulse space-y-5">
                            <div className="h-6 w-40 rounded bg-gray-200" />

                            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                                <div className="h-44 rounded-2xl bg-gray-100" />
                                <div className="h-44 rounded-2xl bg-gray-100" />
                                <div className="h-44 rounded-2xl bg-gray-100" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8F9FA]">
            <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">

                {/* =========================
                    Header
                ========================= */}
                <div className="mb-8">
                    <button
                        type="button"
                        onClick={() => navigate("/mess")}
                        className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-[#6C757D] transition-colors hover:text-[#2563EB]"
                    >
                        <ArrowLeft size={18} />
                        Back to Mess Menu
                    </button>

                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[#2563EB]">
                            <Utensils size={24} />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold text-[#1A1A1A] sm:text-3xl">
                                Today's Menu
                            </h1>

                            <p className="mt-1 text-sm text-[#6C757D]">
                                Check today's breakfast, lunch, and dinner.
                            </p>
                        </div>
                    </div>
                </div>

                {/* =========================
                    Date Banner
                ========================= */}
                <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-blue-100 bg-blue-50 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#2563EB] shadow-sm">
                            <CalendarDays size={20} />
                        </div>

                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-[#6C757D]">
                                Today
                            </p>

                            <p className="mt-0.5 text-sm font-bold text-[#1A1A1A]">
                                {formatDate(getTodayDate())}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={fetchTodayMenu}
                        disabled={loading}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#2563EB] transition-all hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <RefreshCw size={16} />
                        Refresh
                    </button>
                </div>

                {/* =========================
                    No Menu / Error State
                ========================= */}
                {!menu ? (
                    <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center shadow-sm">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-gray-500">
                            <Utensils size={28} />
                        </div>

                        <h2 className="mt-5 text-xl font-bold text-[#1A1A1A]">
                            No Menu Available Today
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#6C757D]">
                            {error ||
                                "The mess menu for today has not been added yet."}
                        </p>

                        <button
                            type="button"
                            onClick={() => navigate("/mess")}
                            className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                        >
                            <Utensils size={17} />
                            View All Menus
                        </button>
                    </div>
                ) : (
                    <>
                        {/* =========================
                            Menu Card
                        ========================= */}
                        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

                            {/* Card Header */}
                            <div className="border-b border-gray-100 px-5 py-5 sm:px-8">
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <h2 className="text-lg font-bold text-[#1A1A1A]">
                                            Today's Meals
                                        </h2>

                                        <p className="mt-1 text-sm text-[#6C757D]">
                                            Freshly planned meals for today.
                                        </p>
                                    </div>

                                    <div className="inline-flex w-fit items-center gap-2 rounded-xl bg-blue-50 px-3 py-2 text-xs font-semibold text-[#2563EB]">
                                        <CalendarDays size={15} />
                                        {formatDate(menu.menu_date)}
                                    </div>
                                </div>
                            </div>

                            {/* Meals */}
                            <div className="grid grid-cols-1 gap-5 p-5 sm:p-8 md:grid-cols-3">

                                <MealCard
                                    icon={<Coffee size={24} />}
                                    title="Breakfast"
                                    content={menu.breakfast}
                                />

                                <MealCard
                                    icon={<Soup size={24} />}
                                    title="Lunch"
                                    content={menu.lunch}
                                />

                                <MealCard
                                    icon={<Moon size={24} />}
                                    title="Dinner"
                                    content={menu.dinner}
                                />
                            </div>
                        </div>

                        {/* Footer Note */}
                        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                            <div className="flex items-start gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]">
                                    <Utensils size={18} />
                                </div>

                                <div>
                                    <h3 className="text-sm font-bold text-[#1A1A1A]">
                                        Need another date?
                                    </h3>

                                    <p className="mt-1 text-sm leading-6 text-[#6C757D]">
                                        Visit the complete mess menu to view
                                        meals planned for other dates.
                                    </p>

                                    <button
                                        type="button"
                                        onClick={() => navigate("/mess")}
                                        className="mt-3 text-sm font-semibold text-[#2563EB] transition-colors hover:text-blue-700"
                                    >
                                        View all menus →
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

/* ======================================
   Meal Card
====================================== */
function MealCard({ icon, title, content }) {
    return (
        <div className="group rounded-2xl border border-gray-200 bg-[#F8F9FA] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-blue-100 hover:bg-blue-50/40 hover:shadow-md">
            <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#2563EB] shadow-sm transition-transform duration-300 group-hover:scale-105">
                    {icon}
                </div>

                <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#6C757D]">
                        Meal
                    </p>

                    <h3 className="text-lg font-bold text-[#1A1A1A]">
                        {title}
                    </h3>
                </div>
            </div>

            <div className="mt-5 border-t border-gray-200 pt-4">
                <p className="whitespace-pre-line break-words text-sm leading-7 text-[#6C757D]">
                    {content || "Not specified"}
                </p>
            </div>
        </div>
    );
}

export default TodayMenu;