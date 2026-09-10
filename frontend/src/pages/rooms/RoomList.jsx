import { useEffect, useMemo, useState } from "react";
import {
    BedDouble,
    DoorOpen,
    Edit,
    Eye,
    Filter,
    Plus,
    Search,
    Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import {
    deleteRoom,
    getRooms,
} from "../../services/roomService";

import { getHostels } from "../../services/hostelService";

function RoomList() {
    const [rooms, setRooms] = useState([]);
    const [hostels, setHostels] = useState([]);

    const [searchTerm, setSearchTerm] = useState("");
    const [hostelFilter, setHostelFilter] = useState("All");
    const [floorFilter, setFloorFilter] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchRooms();
        fetchHostels();
    }, []);

    const fetchRooms = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getRooms();

            setRooms(
                Array.isArray(data)
                    ? data
                    : data?.results || []
            );
        } catch (err) {
            console.error("Fetch Rooms Error:", err);

            setError(
                err?.response?.data?.detail ||
                    "Unable to load rooms."
            );
        } finally {
            setLoading(false);
        }
    };

    const fetchHostels = async () => {
        try {
            const data = await getHostels();

            setHostels(
                Array.isArray(data)
                    ? data
                    : data?.results || []
            );
        } catch (err) {
            console.error("Fetch Hostels Error:", err);
        }
    };

    const getHostelName = (room) => {
        if (
            room?.hostel &&
            typeof room.hostel === "object"
        ) {
            return (
                room.hostel.hostel_name ||
                "Unknown Hostel"
            );
        }

        const hostel = hostels.find(
            (item) =>
                String(item.id) ===
                String(room?.hostel)
        );

        return hostel?.hostel_name || "Unknown Hostel";
    };

    const getAvailableBeds = (room) => {
        const capacity = Number(room?.capacity || 0);
        const occupied = Number(
            room?.occupied_beds || 0
        );

        return Math.max(capacity - occupied, 0);
    };

    const floors = useMemo(() => {
        return [
            ...new Set(
                rooms
                    .map((room) => room.floor)
                    .filter(
                        (floor) =>
                            floor !== null &&
                            floor !== undefined &&
                            floor !== ""
                    )
            ),
        ].sort(
            (a, b) => Number(a) - Number(b)
        );
    }, [rooms]);

    const filteredRooms = useMemo(() => {
        const search = searchTerm
            .trim()
            .toLowerCase();

        return rooms.filter((room) => {
            const hostelName =
                getHostelName(room).toLowerCase();

            const matchesSearch =
                !search ||
                String(room.room_number || "")
                    .toLowerCase()
                    .includes(search) ||
                String(room.floor || "")
                    .toLowerCase()
                    .includes(search) ||
                String(room.status || "")
                    .toLowerCase()
                    .includes(search) ||
                hostelName.includes(search);

            const matchesHostel =
                hostelFilter === "All" ||
                String(room.hostel) ===
                    String(hostelFilter) ||
                (typeof room.hostel === "object" &&
                    String(room.hostel?.id) ===
                        String(hostelFilter));

            const matchesFloor =
                floorFilter === "All" ||
                String(room.floor) ===
                    String(floorFilter);

            const matchesStatus =
                statusFilter === "All" ||
                room.status === statusFilter;

            return (
                matchesSearch &&
                matchesHostel &&
                matchesFloor &&
                matchesStatus
            );
        });
    }, [
        rooms,
        hostels,
        searchTerm,
        hostelFilter,
        floorFilter,
        statusFilter,
    ]);

    const getStatusClasses = (status) => {
        switch (status) {
            case "Available":
                return "border-green-200 bg-green-50 text-green-700";

            case "Full":
                return "border-red-200 bg-red-50 text-red-700";

            case "Maintenance":
                return "border-yellow-200 bg-yellow-50 text-yellow-700";

            default:
                return "border-slate-200 bg-slate-50 text-slate-700";
        }
    };

    const handleDelete = async (
        id,
        roomNumber
    ) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete Room ${roomNumber}? This action cannot be undone.`
        );

        if (!confirmed) return;

        try {
            await deleteRoom(id);

            setRooms((prevRooms) =>
                prevRooms.filter(
                    (room) => room.id !== id
                )
            );

            toast.success(
                "Room deleted successfully."
            );
        } catch (err) {
            console.error(
                "Delete Room Error:",
                err
            );

            const message =
                err?.response?.data?.detail ||
                "Unable to delete room.";

            toast.error(message);
        }
    };

    const clearFilters = () => {
        setSearchTerm("");
        setHostelFilter("All");
        setFloorFilter("All");
        setStatusFilter("All");
    };

    if (loading) {
        return (
            <div className="space-y-8 animate-pulse">
                <div className="space-y-3">
                    <div className="h-10 w-64 rounded-lg bg-slate-200" />
                    <div className="h-5 w-96 max-w-full rounded bg-slate-100" />
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <div className="h-12 rounded-xl bg-slate-100" />
                        <div className="h-12 rounded-xl bg-slate-100" />
                        <div className="h-12 rounded-xl bg-slate-100" />
                        <div className="h-12 rounded-xl bg-slate-100" />
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {[1, 2, 3].map((item) => (
                        <div
                            key={item}
                            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                        >
                            <div className="h-6 w-32 rounded bg-slate-200" />
                            <div className="mt-5 h-4 w-48 rounded bg-slate-100" />
                            <div className="mt-3 h-4 w-32 rounded bg-slate-100" />
                            <div className="mt-6 h-24 rounded-xl bg-slate-100" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
                        <BedDouble className="h-7 w-7 text-red-500" />
                    </div>

                    <h2 className="mt-5 text-xl font-semibold text-[#1A1A1A]">
                        Unable to load rooms
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-[#6C757D]">
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={fetchRooms}
                        className="mt-6 rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[#1A1A1A] sm:text-4xl">
                        Room Management
                    </h1>

                    <p className="mt-2 text-[#6C757D]">
                        Manage rooms, capacity,
                        occupancy, and availability.
                    </p>
                </div>

                <Link
                    to="/rooms/add"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                    <Plus className="h-5 w-5" />
                    Add Room
                </Link>
            </div>

            {/* Search + Filters */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {/* Search */}
                    <div className="relative md:col-span-2 lg:col-span-1">
                        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(event) =>
                                setSearchTerm(
                                    event.target.value
                                )
                            }
                            placeholder="Search rooms..."
                            className="w-full rounded-xl border border-slate-200 bg-[#F8F9FA] py-3 pl-11 pr-4 text-sm text-[#1A1A1A] outline-none transition placeholder:text-slate-400 focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    {/* Hostel Filter */}
                    <select
                        value={hostelFilter}
                        onChange={(event) =>
                            setHostelFilter(
                                event.target.value
                            )
                        }
                        className="rounded-xl border border-slate-200 bg-[#F8F9FA] px-4 py-3 text-sm text-[#1A1A1A] outline-none transition focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-blue-100"
                    >
                        <option value="All">
                            All Hostels
                        </option>

                        {hostels.map((hostel) => (
                            <option
                                key={hostel.id}
                                value={hostel.id}
                            >
                                {hostel.hostel_name}
                            </option>
                        ))}
                    </select>

                    {/* Floor Filter */}
                    <select
                        value={floorFilter}
                        onChange={(event) =>
                            setFloorFilter(
                                event.target.value
                            )
                        }
                        className="rounded-xl border border-slate-200 bg-[#F8F9FA] px-4 py-3 text-sm text-[#1A1A1A] outline-none transition focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-blue-100"
                    >
                        <option value="All">
                            All Floors
                        </option>

                        {floors.map((floor) => (
                            <option
                                key={floor}
                                value={floor}
                            >
                                Floor {floor}
                            </option>
                        ))}
                    </select>

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(event) =>
                            setStatusFilter(
                                event.target.value
                            )
                        }
                        className="rounded-xl border border-slate-200 bg-[#F8F9FA] px-4 py-3 text-sm text-[#1A1A1A] outline-none transition focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-blue-100"
                    >
                        <option value="All">
                            All Status
                        </option>
                        <option value="Available">
                            Available
                        </option>
                        <option value="Full">
                            Full
                        </option>
                        <option value="Maintenance">
                            Maintenance
                        </option>
                    </select>
                </div>
            </div>

            {/* Result Count */}
            <div className="flex items-center justify-between">
                <p className="flex items-center gap-2 text-sm text-[#6C757D]">
                    <Filter className="h-4 w-4" />

                    Showing{" "}
                    <span className="font-semibold text-[#1A1A1A]">
                        {filteredRooms.length}
                    </span>{" "}
                    room
                    {filteredRooms.length !== 1
                        ? "s"
                        : ""}
                </p>

                {(searchTerm ||
                    hostelFilter !== "All" ||
                    floorFilter !== "All" ||
                    statusFilter !== "All") && (
                    <button
                        type="button"
                        onClick={clearFilters}
                        className="text-sm font-medium text-[#2563EB] transition hover:text-blue-800"
                    >
                        Clear filters
                    </button>
                )}
            </div>

            {/* Empty State */}
            {filteredRooms.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
                        <DoorOpen className="h-7 w-7 text-[#2563EB]" />
                    </div>

                    <h2 className="mt-5 text-xl font-semibold text-[#1A1A1A]">
                        {rooms.length === 0
                            ? "No rooms found"
                            : "No matching rooms"}
                    </h2>

                    <p className="mx-auto mt-2 max-w-md text-sm text-[#6C757D]">
                        {rooms.length === 0
                            ? "Start by adding your first room."
                            : "Try changing your search or filters."}
                    </p>

                    {rooms.length === 0 && (
                        <Link
                            to="/rooms/add"
                            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                        >
                            <Plus className="h-5 w-5" />
                            Add Room
                        </Link>
                    )}
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {filteredRooms.map((room) => {
                        const availableBeds =
                            getAvailableBeds(room);

                        return (
                            <article
                                key={room.id}
                                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
                            >
                                {/* Header */}
                                <div className="flex items-start justify-between gap-4">
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                                                <DoorOpen className="h-5 w-5 text-[#2563EB]" />
                                            </div>

                                            <div className="min-w-0">
                                                <h2 className="text-xl font-bold text-[#1A1A1A]">
                                                    Room{" "}
                                                    {
                                                        room.room_number
                                                    }
                                                </h2>

                                                <p
                                                    className="truncate text-sm text-[#6C757D]"
                                                    title={getHostelName(
                                                        room
                                                    )}
                                                >
                                                    {
                                                        getHostelName(
                                                            room
                                                        )
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <span
                                        className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                                            room.status
                                        )}`}
                                    >
                                        {room.status}
                                    </span>
                                </div>

                                {/* Room Information */}
                                <div className="mt-6 grid grid-cols-2 gap-3">
                                    <div className="rounded-xl bg-[#F8F9FA] p-4">
                                        <p className="text-xs font-medium text-[#6C757D]">
                                            Floor
                                        </p>

                                        <p className="mt-1 text-lg font-bold text-[#1A1A1A]">
                                            {room.floor}
                                        </p>
                                    </div>

                                    <div className="rounded-xl bg-[#F8F9FA] p-4">
                                        <p className="text-xs font-medium text-[#6C757D]">
                                            Capacity
                                        </p>

                                        <p className="mt-1 text-lg font-bold text-[#1A1A1A]">
                                            {
                                                room.capacity
                                            }
                                        </p>
                                    </div>

                                    <div className="rounded-xl bg-[#F8F9FA] p-4">
                                        <p className="text-xs font-medium text-[#6C757D]">
                                            Occupied
                                        </p>

                                        <p className="mt-1 text-lg font-bold text-[#1A1A1A]">
                                            {
                                                room.occupied_beds
                                            }
                                        </p>
                                    </div>

                                    <div className="rounded-xl bg-blue-50 p-4">
                                        <p className="text-xs font-medium text-blue-600">
                                            Available
                                        </p>

                                        <p className="mt-1 text-lg font-bold text-[#2563EB]">
                                            {
                                                availableBeds
                                            }
                                        </p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="mt-6 grid grid-cols-3 gap-2 border-t border-slate-100 pt-4">
                                    <Link
                                        to={`/rooms/${room.id}`}
                                        className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-[#1A1A1A] transition hover:bg-slate-50"
                                    >
                                        <Eye className="h-4 w-4" />
                                        <span className="hidden sm:inline">
                                            View
                                        </span>
                                    </Link>

                                    <Link
                                        to={`/rooms/${room.id}/edit`}
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
                                                room.id,
                                                room.room_number
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
                            </article>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default RoomList;