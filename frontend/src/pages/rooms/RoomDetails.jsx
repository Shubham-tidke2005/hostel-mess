import { useEffect, useState } from "react";
import {
    ArrowLeft,
    BedDouble,
    DoorOpen,
    Edit,
    Building2,
    Layers3,
    Users,
    Trash2,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { getRoom, deleteRoom } from "../../services/roomService";
import { getHostel } from "../../services/hostelService";

function RoomDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [room, setRoom] = useState(null);
    const [hostel, setHostel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchRoomDetails();
    }, [id]);

    const fetchRoomDetails = async () => {
        try {
            setLoading(true);
            setError("");

            const roomData = await getRoom(id);
            setRoom(roomData);

            // Support both:
            // hostel: 1
            // and nested hostel object
            if (
                roomData?.hostel &&
                typeof roomData.hostel === "object"
            ) {
                setHostel(roomData.hostel);
            } else if (roomData?.hostel) {
                const hostelData = await getHostel(roomData.hostel);
                setHostel(hostelData);
            }
        } catch (err) {
            console.error(
                "Fetch Room Details Error:",
                err
            );

            setError(
                err?.response?.data?.detail ||
                    "Unable to load room details."
            );
        } finally {
            setLoading(false);
        }
    };

    const getAvailableBeds = () => {
        if (!room) return 0;

        const capacity = Number(room.capacity || 0);
        const occupied = Number(room.occupied_beds || 0);

        return Math.max(capacity - occupied, 0);
    };

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

    const handleDelete = async () => {
        if (!room) return;

        const confirmed = window.confirm(
            `Are you sure you want to delete Room ${room.room_number}? This action cannot be undone.`
        );

        if (!confirmed) return;

        try {
            setDeleting(true);

            await deleteRoom(room.id);

            toast.success("Room deleted successfully.");

            navigate("/rooms");
        } catch (err) {
            console.error("Delete Room Error:", err);

            const message =
                err?.response?.data?.detail ||
                "Unable to delete room.";

            toast.error(message);
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="mx-auto max-w-5xl space-y-6 animate-pulse">
                <div className="h-5 w-32 rounded bg-slate-200" />

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <div className="h-10 w-56 rounded bg-slate-200" />

                    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {[1, 2, 3, 4].map((item) => (
                            <div
                                key={item}
                                className="h-28 rounded-2xl bg-slate-100"
                            />
                        ))}
                    </div>

                    <div className="mt-8 space-y-5">
                        <div className="h-6 w-40 rounded bg-slate-200" />
                        <div className="h-5 w-72 rounded bg-slate-100" />
                        <div className="h-5 w-56 rounded bg-slate-100" />
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mx-auto max-w-5xl">
                <div className="rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
                        <BedDouble className="h-7 w-7 text-red-500" />
                    </div>

                    <h2 className="mt-5 text-xl font-semibold text-[#1A1A1A]">
                        Unable to load room
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-[#6C757D]">
                        {error}
                    </p>

                    <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                        <button
                            type="button"
                            onClick={fetchRoomDetails}
                            className="rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                        >
                            Try Again
                        </button>

                        <Link
                            to="/rooms"
                            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-[#1A1A1A] transition hover:bg-slate-50"
                        >
                            Back to Rooms
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (!room) {
        return null;
    }

    const availableBeds = getAvailableBeds();

    const hostelName =
        hostel?.hostel_name ||
        "Unknown Hostel";

    return (
        <div className="mx-auto max-w-5xl space-y-6">
            {/* Back */}
            <Link
                to="/rooms"
                className="inline-flex items-center gap-2 text-sm font-medium text-[#6C757D] transition hover:text-[#2563EB]"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Rooms
            </Link>

            {/* Main Card */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                {/* Header */}
                <div className="border-b border-slate-100 p-6 sm:p-8">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-start gap-4">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50">
                                <DoorOpen className="h-7 w-7 text-[#2563EB]" />
                            </div>

                            <div>
                                <div className="flex flex-wrap items-center gap-3">
                                    <h1 className="text-3xl font-bold text-[#1A1A1A] sm:text-4xl">
                                        Room {room.room_number}
                                    </h1>

                                    <span
                                        className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                                            room.status
                                        )}`}
                                    >
                                        {room.status}
                                    </span>
                                </div>

                                <div className="mt-2 flex items-center gap-2 text-sm text-[#6C757D]">
                                    <Building2 className="h-4 w-4" />
                                    {hostelName}
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <Link
                                to={`/rooms/${room.id}/edit`}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                            >
                                <Edit className="h-4 w-4" />
                                Edit Room
                            </Link>

                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={deleting}
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <Trash2 className="h-4 w-4" />
                                {deleting
                                    ? "Deleting..."
                                    : "Delete Room"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Room Statistics */}
                <div className="p-6 sm:p-8">
                    <h2 className="text-xl font-bold text-[#1A1A1A]">
                        Room Overview
                    </h2>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {/* Capacity */}
                        <div className="rounded-2xl border border-slate-200 bg-[#F8F9FA] p-5">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                                <BedDouble className="h-5 w-5 text-[#2563EB]" />
                            </div>

                            <p className="mt-4 text-sm text-[#6C757D]">
                                Capacity
                            </p>

                            <p className="mt-1 text-2xl font-bold text-[#1A1A1A]">
                                {room.capacity}
                            </p>
                        </div>

                        {/* Occupied */}
                        <div className="rounded-2xl border border-slate-200 bg-[#F8F9FA] p-5">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50">
                                <Users className="h-5 w-5 text-orange-600" />
                            </div>

                            <p className="mt-4 text-sm text-[#6C757D]">
                                Occupied Beds
                            </p>

                            <p className="mt-1 text-2xl font-bold text-[#1A1A1A]">
                                {room.occupied_beds}
                            </p>
                        </div>

                        {/* Available */}
                        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white">
                                <BedDouble className="h-5 w-5 text-[#2563EB]" />
                            </div>

                            <p className="mt-4 text-sm text-blue-600">
                                Available Beds
                            </p>

                            <p className="mt-1 text-2xl font-bold text-[#2563EB]">
                                {availableBeds}
                            </p>
                        </div>

                        {/* Floor */}
                        <div className="rounded-2xl border border-slate-200 bg-[#F8F9FA] p-5">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-200">
                                <Layers3 className="h-5 w-5 text-[#6C757D]" />
                            </div>

                            <p className="mt-4 text-sm text-[#6C757D]">
                                Floor
                            </p>

                            <p className="mt-1 text-2xl font-bold text-[#1A1A1A]">
                                {room.floor}
                            </p>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="mt-8 border-t border-slate-100 pt-8">
                        <h2 className="text-xl font-bold text-[#1A1A1A]">
                            Room Details
                        </h2>

                        <div className="mt-5 divide-y divide-slate-100 rounded-2xl border border-slate-200">
                            <div className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                                <span className="text-sm text-[#6C757D]">
                                    Room Number
                                </span>

                                <span className="text-sm font-semibold text-[#1A1A1A]">
                                    {room.room_number}
                                </span>
                            </div>

                            <div className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                                <span className="text-sm text-[#6C757D]">
                                    Hostel
                                </span>

                                <span className="text-sm font-semibold text-[#1A1A1A]">
                                    {hostelName}
                                </span>
                            </div>

                            <div className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                                <span className="text-sm text-[#6C757D]">
                                    Floor
                                </span>

                                <span className="text-sm font-semibold text-[#1A1A1A]">
                                    {room.floor}
                                </span>
                            </div>

                            <div className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                                <span className="text-sm text-[#6C757D]">
                                    Capacity
                                </span>

                                <span className="text-sm font-semibold text-[#1A1A1A]">
                                    {room.capacity}
                                </span>
                            </div>

                            <div className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                                <span className="text-sm text-[#6C757D]">
                                    Occupied Beds
                                </span>

                                <span className="text-sm font-semibold text-[#1A1A1A]">
                                    {room.occupied_beds}
                                </span>
                            </div>

                            <div className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                                <span className="text-sm text-[#6C757D]">
                                    Available Beds
                                </span>

                                <span className="text-sm font-semibold text-[#2563EB]">
                                    {availableBeds}
                                </span>
                            </div>

                            <div className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                                <span className="text-sm text-[#6C757D]">
                                    Status
                                </span>

                                <span
                                    className={`w-fit rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                                        room.status
                                    )}`}
                                >
                                    {room.status}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RoomDetails;