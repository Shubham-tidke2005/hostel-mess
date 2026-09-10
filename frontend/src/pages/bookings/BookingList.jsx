import { useEffect, useMemo, useState } from "react";
import {
    CalendarDays,
    CheckCircle2,
    Clock3,
    Eye,
    Filter,
    Plus,
    Search,
    XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import {
    getBookings,
    requestCancellation,
} from "../../services/bookingService";

import { getRooms } from "../../services/roomService";
import { getHostels } from "../../services/hostelService";

function BookingList() {
    const [bookings, setBookings] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [hostels, setHostels] = useState([]);

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [hostelFilter, setHostelFilter] = useState("All");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [cancellingId, setCancellingId] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError("");

            const [bookingData, roomData, hostelData] =
                await Promise.all([
                    getBookings(),
                    getRooms(),
                    getHostels(),
                ]);

            setBookings(
                Array.isArray(bookingData)
                    ? bookingData
                    : bookingData?.results || []
            );

            setRooms(
                Array.isArray(roomData)
                    ? roomData
                    : roomData?.results || []
            );

            setHostels(
                Array.isArray(hostelData)
                    ? hostelData
                    : hostelData?.results || []
            );
        } catch (err) {
            console.error(
                "Fetch Booking Data Error:",
                err
            );

            setError(
                err?.response?.data?.detail ||
                    "Unable to load bookings."
            );
        } finally {
            setLoading(false);
        }
    };

    const getStudentName = (booking) => {
        if (
            booking?.student &&
            typeof booking.student === "object"
        ) {
            const student = booking.student;

            if (student.full_name) {
                return student.full_name;
            }

            const firstName = student.user?.first_name || "";
            const lastName = student.user?.last_name || "";

            return (
                `${firstName} ${lastName}`.trim() ||
                student.roll_no ||
                "Unknown Student"
            );
        }

        return "Student";
    };

    const getStudentRollNo = (booking) => {
        if (
            booking?.student &&
            typeof booking.student === "object"
        ) {
            return booking.student.roll_no || "—";
        }

        const studentId = booking?.student;

        return studentId
            ? `Student #${studentId}`
            : "—";
    };

    const getRoom = (booking) => {
        if (
            booking?.room &&
            typeof booking.room === "object"
        ) {
            return booking.room;
        }

        const room = rooms.find(
            (item) =>
                String(item.id) ===
                String(booking?.room)
        );

        return room || null;
    };

    const getRoomNumber = (booking) => {
        const room = getRoom(booking);

        return room?.room_number
            ? `Room ${room.room_number}`
            : booking?.room
              ? `Room #${booking.room}`
              : "Unknown Room";
    };

    const getHostelName = (booking) => {
        const room = getRoom(booking);

        if (
            room?.hostel &&
            typeof room.hostel === "object"
        ) {
            return (
                room.hostel.hostel_name ||
                "Unknown Hostel"
            );
        }

        const hostelId =
            room?.hostel || booking?.hostel;

        const hostel = hostels.find(
            (item) =>
                String(item.id) ===
                String(
                    typeof hostelId === "object"
                        ? hostelId?.id
                        : hostelId
                )
        );

        return (
            hostel?.hostel_name ||
            "Unknown Hostel"
        );
    };

    const formatDate = (date) => {
        if (!date) return "—";

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return date;
        }

        return parsedDate.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };

    const getStatusClasses = (status) => {
        switch (status) {
            case "Pending":
                return "border-yellow-200 bg-yellow-50 text-yellow-700";

            case "Approved":
                return "border-green-200 bg-green-50 text-green-700";

            case "Rejected":
                return "border-red-200 bg-red-50 text-red-700";

            case "Cancellation Requested":
                return "border-orange-200 bg-orange-50 text-orange-700";

            case "Cancelled":
                return "border-slate-200 bg-slate-50 text-slate-700";

            default:
                return "border-slate-200 bg-slate-50 text-slate-700";
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "Approved":
                return CheckCircle2;

            case "Rejected":
                return XCircle;

            case "Pending":
                return Clock3;

            case "Cancellation Requested":
                return Clock3;

            default:
                return CalendarDays;
        }
    };

    const filteredBookings = useMemo(() => {
        const search = searchTerm
            .trim()
            .toLowerCase();

        return bookings.filter((booking) => {
            const studentName =
                getStudentName(booking).toLowerCase();

            const rollNo =
                getStudentRollNo(booking).toLowerCase();

            const roomNumber =
                getRoomNumber(booking).toLowerCase();

            const hostelName =
                getHostelName(booking).toLowerCase();

            const matchesSearch =
                !search ||
                studentName.includes(search) ||
                rollNo.includes(search) ||
                roomNumber.includes(search) ||
                hostelName.includes(search);

            const matchesStatus =
                statusFilter === "All" ||
                booking.status === statusFilter;

            const room = getRoom(booking);

            const roomHostelId =
                room?.hostel &&
                typeof room.hostel === "object"
                    ? room.hostel.id
                    : room?.hostel;

            const matchesHostel =
                hostelFilter === "All" ||
                String(roomHostelId) ===
                    String(hostelFilter);

            return (
                matchesSearch &&
                matchesStatus &&
                matchesHostel
            );
        });
    }, [
        bookings,
        rooms,
        hostels,
        searchTerm,
        statusFilter,
        hostelFilter,
    ]);

    const handleCancellation = async (
        id,
        roomNumber
    ) => {
        const confirmed = window.confirm(
            `Request cancellation for ${roomNumber}?`
        );

        if (!confirmed) return;

        try {
            setCancellingId(id);

            const updatedBooking =
                await requestCancellation(id);

            setBookings((prevBookings) =>
                prevBookings.map((booking) =>
                    booking.id === id
                        ? {
                              ...booking,
                              ...updatedBooking,
                              status:
                                  updatedBooking?.status ||
                                  "Cancellation Requested",
                          }
                        : booking
                )
            );

            toast.success(
                "Cancellation request submitted."
            );
        } catch (err) {
            console.error(
                "Cancellation Request Error:",
                err
            );

            const message =
                err?.response?.data?.detail ||
                "Unable to request cancellation.";

            toast.error(message);
        } finally {
            setCancellingId(null);
        }
    };

    const clearFilters = () => {
        setSearchTerm("");
        setStatusFilter("All");
        setHostelFilter("All");
    };

    if (loading) {
        return (
            <div className="space-y-8 animate-pulse">
                <div className="space-y-3">
                    <div className="h-10 w-72 rounded-lg bg-slate-200" />
                    <div className="h-5 w-96 max-w-full rounded bg-slate-100" />
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="h-12 rounded-xl bg-slate-100" />
                        <div className="h-12 rounded-xl bg-slate-100" />
                        <div className="h-12 rounded-xl bg-slate-100" />
                    </div>
                </div>

                <div className="space-y-4">
                    {[1, 2, 3].map((item) => (
                        <div
                            key={item}
                            className="h-44 rounded-2xl border border-slate-200 bg-white shadow-sm"
                        />
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
                        <XCircle className="h-7 w-7 text-red-500" />
                    </div>

                    <h2 className="mt-5 text-xl font-semibold text-[#1A1A1A]">
                        Unable to load bookings
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-[#6C757D]">
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={fetchData}
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
                        Booking Management
                    </h1>

                    <p className="mt-2 text-[#6C757D]">
                        Manage room booking requests and
                        booking status.
                    </p>
                </div>

                <Link
                    to="/bookings/create"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                    <Plus className="h-5 w-5" />
                    Create Booking
                </Link>
            </div>

            {/* Search & Filters */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                <div className="grid gap-4 md:grid-cols-3">
                    {/* Search */}
                    <div className="relative">
                        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(event) =>
                                setSearchTerm(
                                    event.target.value
                                )
                            }
                            placeholder="Search student, room, hostel..."
                            className="w-full rounded-xl border border-slate-200 bg-[#F8F9FA] py-3 pl-11 pr-4 text-sm text-[#1A1A1A] outline-none transition placeholder:text-slate-400 focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    {/* Status */}
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

                        <option value="Pending">
                            Pending
                        </option>

                        <option value="Approved">
                            Approved
                        </option>

                        <option value="Rejected">
                            Rejected
                        </option>

                        <option value="Cancellation Requested">
                            Cancellation Requested
                        </option>

                        <option value="Cancelled">
                            Cancelled
                        </option>
                    </select>

                    {/* Hostel */}
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
                </div>
            </div>

            {/* Result Count */}
            <div className="flex items-center justify-between">
                <p className="flex items-center gap-2 text-sm text-[#6C757D]">
                    <Filter className="h-4 w-4" />

                    Showing{" "}
                    <span className="font-semibold text-[#1A1A1A]">
                        {filteredBookings.length}
                    </span>{" "}
                    booking
                    {filteredBookings.length !== 1
                        ? "s"
                        : ""}
                </p>

                {(searchTerm ||
                    statusFilter !== "All" ||
                    hostelFilter !== "All") && (
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
            {filteredBookings.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
                        <CalendarDays className="h-7 w-7 text-[#2563EB]" />
                    </div>

                    <h2 className="mt-5 text-xl font-semibold text-[#1A1A1A]">
                        {bookings.length === 0
                            ? "No bookings found"
                            : "No matching bookings"}
                    </h2>

                    <p className="mx-auto mt-2 max-w-md text-sm text-[#6C757D]">
                        {bookings.length === 0
                            ? "Create a booking request to get started."
                            : "Try changing your search or filters."}
                    </p>

                    {bookings.length === 0 && (
                        <Link
                            to="/bookings/create"
                            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                        >
                            <Plus className="h-5 w-5" />
                            Create Booking
                        </Link>
                    )}
                </div>
            ) : (
                /* Booking Cards */
                <div className="space-y-4">
                    {filteredBookings.map((booking) => {
                        const StatusIcon =
                            getStatusIcon(
                                booking.status
                            );

                        const roomNumber =
                            getRoomNumber(booking);

                        const canRequestCancellation =
                            booking.status ===
                                "Approved" ||
                            booking.status ===
                                "Pending";

                        return (
                            <article
                                key={booking.id}
                                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:shadow-md sm:p-6"
                            >
                                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                                    {/* Main Info */}
                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                                                <CalendarDays className="h-5 w-5 text-[#2563EB]" />
                                            </div>

                                            <div>
                                                <h2 className="text-lg font-bold text-[#1A1A1A]">
                                                    Booking #
                                                    {
                                                        booking.id
                                                    }
                                                </h2>

                                                <p className="text-sm text-[#6C757D]">
                                                    {
                                                        formatDate(
                                                            booking.booking_date
                                                        )
                                                    }
                                                </p>
                                            </div>

                                            <span
                                                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                                                    booking.status
                                                )}`}
                                            >
                                                <StatusIcon className="h-3.5 w-3.5" />

                                                {
                                                    booking.status
                                                }
                                            </span>
                                        </div>

                                        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                            <div>
                                                <p className="text-xs font-medium uppercase tracking-wide text-[#6C757D]">
                                                    Student
                                                </p>

                                                <p className="mt-1 text-sm font-semibold text-[#1A1A1A]">
                                                    {
                                                        getStudentName(
                                                            booking
                                                        )
                                                    }
                                                </p>

                                                <p className="text-xs text-[#6C757D]">
                                                    {
                                                        getStudentRollNo(
                                                            booking
                                                        )
                                                    }
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-xs font-medium uppercase tracking-wide text-[#6C757D]">
                                                    Hostel
                                                </p>

                                                <p className="mt-1 text-sm font-semibold text-[#1A1A1A]">
                                                    {
                                                        getHostelName(
                                                            booking
                                                        )
                                                    }
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-xs font-medium uppercase tracking-wide text-[#6C757D]">
                                                    Room
                                                </p>

                                                <p className="mt-1 text-sm font-semibold text-[#1A1A1A]">
                                                    {
                                                        roomNumber
                                                    }
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-xs font-medium uppercase tracking-wide text-[#6C757D]">
                                                    Approved Date
                                                </p>

                                                <p className="mt-1 text-sm font-semibold text-[#1A1A1A]">
                                                    {formatDate(
                                                        booking.approved_date
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        {booking.remarks && (
                                            <div className="mt-5 rounded-xl bg-[#F8F9FA] px-4 py-3">
                                                <p className="text-xs font-medium uppercase tracking-wide text-[#6C757D]">
                                                    Remarks
                                                </p>

                                                <p className="mt-1 text-sm text-[#1A1A1A]">
                                                    {
                                                        booking.remarks
                                                    }
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto lg:flex-col">
                                        <Link
                                            to={`/bookings/${booking.id}`}
                                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-[#1A1A1A] transition hover:bg-slate-50"
                                        >
                                            <Eye className="h-4 w-4" />
                                            View Details
                                        </Link>

                                        {canRequestCancellation && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleCancellation(
                                                        booking.id,
                                                        roomNumber
                                                    )
                                                }
                                                disabled={
                                                    cancellingId ===
                                                    booking.id
                                                }
                                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-4 py-2.5 text-sm font-medium text-orange-600 transition hover:bg-orange-100 disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                <XCircle className="h-4 w-4" />

                                                {cancellingId ===
                                                booking.id
                                                    ? "Requesting..."
                                                    : "Request Cancellation"}
                                            </button>
                                        )}

                                        {booking.status ===
                                            "Pending" && (
                                            <Link
                                                to={`/bookings/${booking.id}/approval`}
                                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-2.5 text-sm font-medium text-green-700 transition hover:bg-green-100"
                                            >
                                                <CheckCircle2 className="h-4 w-4" />
                                                Review
                                            </Link>
                                        )}
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

export default BookingList;