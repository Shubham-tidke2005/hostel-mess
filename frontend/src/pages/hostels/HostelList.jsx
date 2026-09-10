
import { useEffect, useMemo, useState } from "react";
import {
    Building2,
    Edit,
    Eye,
    MapPin,
    Plus,
    Search,
    Trash2,
    UsersRound,
} from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import {
    deleteHostel,
    getHostels,
} from "../../services/hostelService";

import LoadingSkeleton from "../dashboard/LoadingSkeleton";
import ErrorState from "../dashboard/ErrorState";

const MEDIA_BASE_URL =
    import.meta.env.VITE_MEDIA_BASE_URL || "http://127.0.0.1:8000";

function HostelList() {
    const [hostels, setHostels] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState("All");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchHostels();
    }, []);

    const fetchHostels = async () => {
        try {
            setLoading(true);

            const data = await getHostels();

            // DRF pagination support
            if (Array.isArray(data)) {
                setHostels(data);
            } else {
                setHostels(data?.results || []);
            }

            setError("");
        } catch (err) {
            console.error("Fetch Hostels Error:", err);
            setError("Unable to load hostels.");
        } finally {
            setLoading(false);
        }
    };

    const filteredHostels = useMemo(() => {
        const search = searchTerm.trim().toLowerCase();

        return hostels.filter((hostel) => {
            const matchesSearch =
                !search ||
                hostel.hostel_name?.toLowerCase().includes(search) ||
                hostel.hostel_type?.toLowerCase().includes(search) ||
                hostel.address?.toLowerCase().includes(search);

            const matchesType =
                typeFilter === "All" ||
                hostel.hostel_type === typeFilter;

            return matchesSearch && matchesType;
        });
    }, [hostels, searchTerm, typeFilter]);

    const getImageUrl = (image) => {
        if (!image) return "";

        if (image.startsWith("http://") || image.startsWith("https://")) {
            return image;
        }

        return `${MEDIA_BASE_URL}${image}`;
    };

    const handleDelete = async (id, hostelName) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete ${hostelName}? This action cannot be undone.`
        );

        if (!confirmed) return;

        try {
            await deleteHostel(id);

            setHostels((prevHostels) =>
                prevHostels.filter((hostel) => hostel.id !== id)
            );

            toast.success("Hostel deleted successfully.");
        } catch (err) {
            console.error("Delete Hostel Error:", err);

            const message =
                err?.response?.data?.detail ||
                "Unable to delete hostel.";

            toast.error(message);
        }
    };

    if (loading) {
        return <LoadingSkeleton height="h-[600px]" />;
    }

    if (error) {
        return (
            <ErrorState
                message={error}
                onRetry={fetchHostels}
            />
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[#1A1A1A] sm:text-4xl">
                        Hostel Management
                    </h1>

                    <p className="mt-2 text-[#6C757D]">
                        Manage hostels, details, and room capacity.
                    </p>
                </div>

                <Link
                    to="/hostels/add"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                    <Plus className="h-5 w-5" />
                    Add Hostel
                </Link>
            </div>

            {/* Search & Filter */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                <div className="grid gap-4 md:grid-cols-[1fr_220px]">
                    {/* Search */}
                    <div className="relative">
                        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(event) =>
                                setSearchTerm(event.target.value)
                            }
                            placeholder="Search by hostel name, type, or address..."
                            className="w-full rounded-xl border border-slate-200 bg-[#F8F9FA] py-3 pl-11 pr-4 text-sm text-[#1A1A1A] outline-none transition placeholder:text-slate-400 focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    {/* Filter */}
                    <select
                        value={typeFilter}
                        onChange={(event) =>
                            setTypeFilter(event.target.value)
                        }
                        className="rounded-xl border border-slate-200 bg-[#F8F9FA] px-4 py-3 text-sm text-[#1A1A1A] outline-none transition focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-blue-100"
                    >
                        <option value="All">All Types</option>
                        <option value="Boys">Boys</option>
                        <option value="Girls">Girls</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
            </div>

            {/* Result Count */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-[#6C757D]">
                    Showing{" "}
                    <span className="font-semibold text-[#1A1A1A]">
                        {filteredHostels.length}
                    </span>{" "}
                    hostel
                    {filteredHostels.length !== 1 ? "s" : ""}
                </p>

                {(searchTerm || typeFilter !== "All") && (
                    <button
                        type="button"
                        onClick={() => {
                            setSearchTerm("");
                            setTypeFilter("All");
                        }}
                        className="text-sm font-medium text-[#2563EB] transition hover:text-blue-800"
                    >
                        Clear filters
                    </button>
                )}
            </div>

            {/* Empty State */}
            {filteredHostels.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
                        <Building2 className="h-7 w-7 text-[#2563EB]" />
                    </div>

                    <h2 className="mt-5 text-xl font-semibold text-[#1A1A1A]">
                        {hostels.length === 0
                            ? "No hostels found"
                            : "No matching hostels"}
                    </h2>

                    <p className="mx-auto mt-2 max-w-md text-sm text-[#6C757D]">
                        {hostels.length === 0
                            ? "Start by adding your first hostel."
                            : "Try changing your search or filter."}
                    </p>

                    {hostels.length === 0 && (
                        <Link
                            to="/hostels/add"
                            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                        >
                            <Plus className="h-5 w-5" />
                            Add Hostel
                        </Link>
                    )}
                </div>
            ) : (
                /* Hostel Cards */
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {filteredHostels.map((hostel) => {
                        const imageUrl = getImageUrl(
                            hostel.hostel_image
                        );

                        return (
                            <article
                                key={hostel.id}
                                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
                            >
                                {/* Image */}
                                <div className="relative h-52 overflow-hidden bg-slate-100">
                                    {imageUrl ? (
                                        <img
                                            src={imageUrl}
                                            alt={hostel.hostel_name}
                                            className="h-full w-full object-cover transition duration-300 hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100">
                                            <Building2 className="h-16 w-16 text-blue-200" />
                                        </div>
                                    )}

                                    {/* Type Badge */}
                                    <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-[#2563EB] shadow-sm backdrop-blur">
                                        {hostel.hostel_type}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    <h2
                                        className="truncate text-xl font-bold text-[#1A1A1A]"
                                        title={hostel.hostel_name}
                                    >
                                        {hostel.hostel_name}
                                    </h2>

                                    <div className="mt-4 space-y-3">
                                        {/* Address */}
                                        <div className="flex items-start gap-3">
                                            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#6C757D]" />

                                            <p
                                                className="line-clamp-2 text-sm leading-5 text-[#6C757D]"
                                                title={hostel.address}
                                            >
                                                {hostel.address}
                                            </p>
                                        </div>

                                        {/* Rooms */}
                                        <div className="flex items-center gap-3">
                                            <UsersRound className="h-5 w-5 shrink-0 text-[#6C757D]" />

                                            <p className="text-sm text-[#6C757D]">
                                                Total Rooms:{" "}
                                                <span className="font-semibold text-[#1A1A1A]">
                                                    {hostel.total_rooms}
                                                </span>
                                            </p>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="mt-6 grid grid-cols-3 gap-2 border-t border-slate-100 pt-4">
                                        <Link
                                            to={`/hostels/${hostel.id}`}
                                            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-[#1A1A1A] transition hover:bg-slate-50"
                                        >
                                            <Eye className="h-4 w-4" />
                                            <span className="hidden sm:inline">
                                                View
                                            </span>
                                        </Link>

                                        <Link
                                            to={`/hostels/${hostel.id}/edit`}
                                            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-sm font-medium text-[#2563EB] transition hover:bg-blue-100"
                                        >
                                            <Edit className="h-4 w-4" />
                                            <span className="hidden sm:inline">
                                                Edit
                                            </span>
                                        </Link>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDelete(
                                                    hostel.id,
                                                    hostel.hostel_name
                                                )
                                            }
                                            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            <span className="hidden sm:inline">
                                                Delete
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default HostelList;

