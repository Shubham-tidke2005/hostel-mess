import { useEffect, useMemo, useState } from "react";
import {
    CalendarDays,
    Edit,
    Plus,
    Search,
    Trash2,
    Utensils,
    X,
    Coffee,
    Soup,
    Moon,
    RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
    getMenus,
    deleteMenu,
} from "../../services/messService";

function MenuList() {
    const navigate = useNavigate();

    const [menus, setMenus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState("");

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDate, setSelectedDate] = useState("");

    const [deleteTarget, setDeleteTarget] = useState(null);

    // -----------------------------
    // Check admin role
    // -----------------------------
    const isAdmin =
        localStorage.getItem("is_staff") === "true" ||
        localStorage.getItem("is_admin") === "true" ||
        localStorage.getItem("role") === "admin";

    // -----------------------------
    // Fetch menus
    // -----------------------------
    const fetchMenus = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getMenus();

            // Handle normal DRF array response
            // and paginated DRF response
            if (Array.isArray(data)) {
                setMenus(data);
            } else if (Array.isArray(data?.results)) {
                setMenus(data.results);
            } else {
                setMenus([]);
            }
        } catch (err) {
            console.error("Failed to fetch menus:", err);

            const message =
                err?.response?.data?.detail ||
                err?.response?.data?.message ||
                "Failed to load mess menus.";

            setError(message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMenus();
    }, []);

    // -----------------------------
    // Date formatter
    // -----------------------------
    const formatDate = (dateString) => {
        if (!dateString) return "No date";

        const date = new Date(dateString);

        if (Number.isNaN(date.getTime())) {
            return dateString;
        }

        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    // -----------------------------
    // Day name
    // -----------------------------
    const getDayName = (dateString) => {
        if (!dateString) return "";

        const date = new Date(dateString);

        if (Number.isNaN(date.getTime())) {
            return "";
        }

        return date.toLocaleDateString("en-IN", {
            weekday: "long",
        });
    };

    // -----------------------------
    // Filter menus
    // -----------------------------
    const filteredMenus = useMemo(() => {
        const search = searchTerm.trim().toLowerCase();

        return [...menus]
            .filter((menu) => {
                const matchesSearch =
                    !search ||
                    String(menu.menu_date || "")
                        .toLowerCase()
                        .includes(search) ||
                    String(menu.breakfast || "")
                        .toLowerCase()
                        .includes(search) ||
                    String(menu.lunch || "")
                        .toLowerCase()
                        .includes(search) ||
                    String(menu.dinner || "")
                        .toLowerCase()
                        .includes(search);

                const matchesDate =
                    !selectedDate ||
                    menu.menu_date === selectedDate;

                return matchesSearch && matchesDate;
            })
            .sort((a, b) =>
                String(b.menu_date || "").localeCompare(
                    String(a.menu_date || "")
                )
            );
    }, [menus, searchTerm, selectedDate]);

    // -----------------------------
    // Delete menu
    // -----------------------------
    const handleDelete = async () => {
        if (!deleteTarget?.id) return;

        try {
            setDeleting(true);

            await deleteMenu(deleteTarget.id);

            setMenus((prev) =>
                prev.filter((menu) => menu.id !== deleteTarget.id)
            );

            toast.success("Mess menu deleted successfully.");

            setDeleteTarget(null);
        } catch (err) {
            console.error("Failed to delete menu:", err);

            const message =
                err?.response?.data?.detail ||
                err?.response?.data?.message ||
                "Failed to delete mess menu.";

            toast.error(message);
        } finally {
            setDeleting(false);
        }
    };

    // -----------------------------
    // Clear filters
    // -----------------------------
    const clearFilters = () => {
        setSearchTerm("");
        setSelectedDate("");
    };

    const hasFilters =
        searchTerm.trim() !== "" || selectedDate !== "";

    // -----------------------------
    // Loading state
    // -----------------------------
    if (loading) {
        return (
            <div className="min-h-screen bg-[#F8F9FA]">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Header skeleton */}
                    <div className="mb-8 animate-pulse">
                        <div className="h-8 w-56 rounded bg-gray-200" />
                        <div className="mt-3 h-4 w-80 rounded bg-gray-200" />
                    </div>

                    {/* Filter skeleton */}
                    <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                        <div className="flex flex-col gap-4 lg:flex-row">
                            <div className="h-11 flex-1 rounded-xl bg-gray-200" />
                            <div className="h-11 w-full rounded-xl bg-gray-200 lg:w-52" />
                            <div className="h-11 w-full rounded-xl bg-gray-200 lg:w-36" />
                        </div>
                    </div>

                    {/* Cards skeleton */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {[1, 2, 3, 4, 5, 6].map((item) => (
                            <div
                                key={item}
                                className="animate-pulse rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                            >
                                <div className="mb-6 h-5 w-36 rounded bg-gray-200" />
                                <div className="space-y-5">
                                    <div className="h-20 rounded-xl bg-gray-100" />
                                    <div className="h-20 rounded-xl bg-gray-100" />
                                    <div className="h-20 rounded-xl bg-gray-100" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8F9FA]">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">

                {/* =========================
                    Header
                ========================= */}
                <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[#2563EB]">
                                <Utensils size={24} />
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold text-[#1A1A1A] sm:text-3xl">
                                    Mess Menu
                                </h1>

                                <p className="mt-1 text-sm text-[#6C757D]">
                                    View daily breakfast, lunch, and dinner menus.
                                </p>
                            </div>
                        </div>
                    </div>

                    {isAdmin && (
                        <button
                            type="button"
                            onClick={() => navigate("/mess/add")}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md"
                        >
                            <Plus size={18} />
                            Add Menu
                        </button>
                    )}
                </div>

                {/* =========================
                    Error State
                ========================= */}
                {error && (
                    <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 p-5">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h3 className="font-semibold text-red-800">
                                    Unable to load menus
                                </h3>

                                <p className="mt-1 text-sm text-red-700">
                                    {error}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={fetchMenus}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-red-700 shadow-sm ring-1 ring-red-200 transition-colors hover:bg-red-50"
                            >
                                <RefreshCw size={16} />
                                Retry
                            </button>
                        </div>
                    </div>
                )}

                {/* =========================
                    Filters
                ========================= */}
                <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
                    <div className="flex flex-col gap-4 lg:flex-row">

                        {/* Search */}
                        <div className="relative flex-1">
                            <Search
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6C757D]"
                            />

                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) =>
                                    setSearchTerm(e.target.value)
                                }
                                placeholder="Search by date or meal..."
                                className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-11 pr-10 text-sm text-[#1A1A1A] outline-none transition-all placeholder:text-gray-400 focus:border-[#2563EB] focus:ring-4 focus:ring-blue-100"
                            />

                            {searchTerm && (
                                <button
                                    type="button"
                                    onClick={() => setSearchTerm("")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                                    aria-label="Clear search"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>

                        {/* Date Filter */}
                        <div className="relative lg:w-52">
                            <CalendarDays
                                size={18}
                                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#6C757D]"
                            />

                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) =>
                                    setSelectedDate(e.target.value)
                                }
                                className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-11 pr-4 text-sm text-[#1A1A1A] outline-none transition-all focus:border-[#2563EB] focus:ring-4 focus:ring-blue-100"
                            />
                        </div>

                        {/* Clear */}
                        {hasFilters && (
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-[#1A1A1A] transition-all hover:bg-gray-50"
                            >
                                <X size={17} />
                                Clear
                            </button>
                        )}
                    </div>

                    {/* Results count */}
                    <div className="mt-4 text-sm text-[#6C757D]">
                        Showing{" "}
                        <span className="font-semibold text-[#1A1A1A]">
                            {filteredMenus.length}
                        </span>{" "}
                        {filteredMenus.length === 1 ? "menu" : "menus"}
                    </div>
                </div>

                {/* =========================
                    Empty State
                ========================= */}
                {filteredMenus.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center shadow-sm">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-gray-500">
                            {hasFilters ? (
                                <Search size={28} />
                            ) : (
                                <Utensils size={28} />
                            )}
                        </div>

                        <h2 className="mt-5 text-lg font-bold text-[#1A1A1A]">
                            {hasFilters
                                ? "No menus found"
                                : "No mess menus available"}
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#6C757D]">
                            {hasFilters
                                ? "Try changing your search or date filter."
                                : "No daily menus have been added yet."}
                        </p>

                        {hasFilters ? (
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                            >
                                Clear Filters
                            </button>
                        ) : (
                            isAdmin && (
                                <button
                                    type="button"
                                    onClick={() => navigate("/mess/add")}
                                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                                >
                                    <Plus size={18} />
                                    Add First Menu
                                </button>
                            )
                        )}
                    </div>
                ) : (
                    /* =========================
                        Menu Cards
                    ========================= */
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {filteredMenus.map((menu) => (
                            <div
                                key={menu.id}
                                className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                            >
                                {/* Card Header */}
                                <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <div className="flex items-center gap-2 text-[#2563EB]">
                                                <CalendarDays size={18} />

                                                <span className="text-sm font-semibold">
                                                    {formatDate(menu.menu_date)}
                                                </span>
                                            </div>

                                            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-[#6C757D]">
                                                {getDayName(menu.menu_date)}
                                            </p>
                                        </div>

                                        <div className="rounded-xl bg-blue-50 px-3 py-1.5 text-xs font-semibold text-[#2563EB]">
                                            Daily Menu
                                        </div>
                                    </div>
                                </div>

                                {/* Meals */}
                                <div className="space-y-3 p-5 sm:p-6">

                                    {/* Breakfast */}
                                    <MealSection
                                        icon={<Coffee size={19} />}
                                        title="Breakfast"
                                        content={menu.breakfast}
                                    />

                                    {/* Lunch */}
                                    <MealSection
                                        icon={<Soup size={19} />}
                                        title="Lunch"
                                        content={menu.lunch}
                                    />

                                    {/* Dinner */}
                                    <MealSection
                                        icon={<Moon size={19} />}
                                        title="Dinner"
                                        content={menu.dinner}
                                    />
                                </div>

                                {/* Admin Actions */}
                                {isAdmin && (
                                    <div className="flex items-center gap-3 border-t border-gray-100 bg-gray-50 px-5 py-4 sm:px-6">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                navigate(
                                                    `/mess/${menu.id}/edit`
                                                )
                                            }
                                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-[#1A1A1A] transition-all hover:border-[#2563EB] hover:text-[#2563EB]"
                                        >
                                            <Edit size={16} />
                                            Edit
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setDeleteTarget(menu)
                                            }
                                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition-all hover:bg-red-50"
                                        >
                                            <Trash2 size={16} />
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* =========================
                Delete Confirmation Modal
            ========================= */}
            {deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl">

                        {/* Modal Icon */}
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                            <Trash2 size={22} />
                        </div>

                        <h2 className="mt-5 text-xl font-bold text-[#1A1A1A]">
                            Delete Mess Menu?
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-[#6C757D]">
                            Are you sure you want to delete the menu for{" "}
                            <span className="font-semibold text-[#1A1A1A]">
                                {formatDate(deleteTarget.menu_date)}
                            </span>
                            ? This action cannot be undone.
                        </p>

                        {/* Actions */}
                        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={() => setDeleteTarget(null)}
                                disabled={deleting}
                                className="rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-[#1A1A1A] transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={deleting}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <Trash2 size={17} />

                                {deleting
                                    ? "Deleting..."
                                    : "Delete Menu"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ======================================
   Meal Section Component
====================================== */
function MealSection({ icon, title, content }) {
    return (
        <div className="rounded-xl border border-gray-100 bg-[#F8F9FA] p-4 transition-colors hover:border-blue-100 hover:bg-blue-50/40">
            <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#2563EB] shadow-sm">
                    {icon}
                </div>

                <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-[#1A1A1A]">
                        {title}
                    </h3>

                    <p className="mt-1.5 whitespace-pre-line break-words text-sm leading-6 text-[#6C757D]">
                        {content || "Not specified"}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default MenuList;