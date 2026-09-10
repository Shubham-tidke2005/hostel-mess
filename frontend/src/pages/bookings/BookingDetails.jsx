import { useEffect, useMemo, useState } from "react";
import {
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    Clock3,
    DoorOpen,
    Edit,
    MapPin,
    User,
    XCircle,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import {
    getBooking,
    requestCancellation,
} from "../../services/bookingService";

import { getRoom } from "../../services/roomService";
import { getHostel } from "../../services/hostelService";
import { getStudent } from "../../services/studentService";

function BookingDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [booking, setBooking] = useState(null);
    const [student, setStudent] = useState(null);
    const [room, setRoom] = useState(null);
    const [hostel, setHostel] = useState(null);

    const [loading, setLoading] = useState(true);
    const [cancelling, setCancelling] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchBookingDetails();
    }, [id]);

    const fetchBookingDetails = async () => {
        try {
            setLoading(true);
            setError("");

            const bookingData = await getBooking(id);

            setBooking(bookingData);

            /*
             * Support both nested objects and IDs.
             */

            // Student
            if (
                bookingData?.student &&
                typeof bookingData.student === "object"
            ) {
                setStudent(bookingData.student);
            } else if (bookingData?.student) {
                try {
                    const studentData = await getStudent(
                        bookingData.student
                    );
                    setStudent(studentData);
                } catch (studentError) {
                    console.error(
                        "Fetch Student Error:",
                        studentError
                    );
                }
            }

            // Room
            if (
                bookingData?.room &&
                typeof bookingData.room === "object"
            ) {
                setRoom(bookingData.room);
            } else if (bookingData?.room) {
                try {
                    const roomData = await getRoom(
                        bookingData.room
                    );
                    setRoom(roomData);
                } catch (roomError) {
                    console.error(
                        "Fetch Room Error:",
                        roomError
                    );
                }
            }
        } catch (err) {
            console.error(
                "Fetch Booking Details Error:",
                err
            );

            setError(
                err?.response?.data?.detail ||
                    "Unable to load booking details."
            );
        } finally {
            setLoading(false);
        }
    };

    /*
     * If the room contains a nested hostel object,
     * use it directly. Otherwise fetch the hostel.
     */
    useEffect(() => {
        const fetchHostelDetails = async () => {
            if (!room?.hostel) {
                return;
            }

            if (
                typeof room.hostel === "object"
            ) {
                setHostel(room.hostel);
                return;
            }

            try {
                const hostelData = await getHostel(
                    room.hostel
                );

                setHostel(hostelData);
            } catch (err) {
                console.error(
                    "Fetch Hostel Error:",
                    err
                );
            }
        };

        fetchHostelDetails();
    }, [room]);

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

    const formatDateTime = (date) => {
        if (!date) return "—";

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return date;
        }

        return parsedDate.toLocaleString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }
        );
    };

    const studentName = useMemo(() => {
        if (!student) {
            return "Student";
        }

        if (student.full_name) {
            return student.full_name;
        }

        const firstName =
            student.user?.first_name || "";

        const lastName =
            student.user?.last_name || "";

        return (
            `${firstName} ${lastName}`.trim() ||
            student.roll_no ||
            "Student"
        );
    }, [student]);

    const studentRollNo =
        student?.roll_no || "—";

    const roomNumber =
        room?.room_number ||
        (booking?.room
            ? `#${booking.room}`
            : "—");

    const hostelName =
        hostel?.hostel_name ||
        "—";

    const availableBeds = room
        ? Math.max(
              Number(room.capacity || 0) -
                  Number(room.occupied_beds || 0),
              0
          )
        : null;

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

    const handleCancellation = async () => {
        if (!booking) return;

        const confirmed = window.confirm(
            "Are you sure you want to request cancellation for this booking?"
        );

        if (!confirmed) return;

        try {
            setCancelling(true);

            const updatedBooking =
                await requestCancellation(
                    booking.id
                );

            setBooking((previous) => ({
                ...previous,
                ...updatedBooking,
                status:
                    updatedBooking?.status ||
                    "Cancellation Requested",
            }));

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
            setCancelling(false);
        }
    };

    if (loading) {
        return (
            <div className="mx-auto max-w-5xl space-y-6 animate-pulse">
                <div className="h-5 w-32 rounded bg-slate-200" />

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-2xl bg-slate-200" />

                        <div className="space-y-2">
                            <div className="h-8 w-52 rounded bg-slate-200" />
                            <div className="h-4 w-36 rounded bg-slate-100" />
                        </div>
                    </div>

                    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {[1, 2, 3, 4].map((item) => (
                            <div
                                key={item}
                                className="h-28 rounded-2xl bg-slate-100"
                            />
                        ))}
                    </div>

                    <div className="mt-8 space-y-4">
                        <div className="h-6 w-48 rounded bg-slate-200" />
                        <div className="h-5 w-72 rounded bg-slate-100" />
                        <div className="h-5 w-64 rounded bg-slate-100" />
                        <div className="h-5 w-80 rounded bg-slate-100" />
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
                        <XCircle className="h-7 w-7 text-red-500" />
                    </div>

                    <h2 className="mt-5 text-xl font-semibold text-[#1A1A1A]">
                        Unable to load booking
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-[#6C757D]">
                        {error}
                    </p>

                    <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                        <button
                            type="button"
                            onClick={fetchBookingDetails}
                            className="rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                        >
                            Try Again
                        </button>

                        <Link
                            to="/bookings"
                            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-[#1A1A1A] transition hover:bg-slate-50"
                        >
                            Back to Bookings
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (!booking) {
        return null;
    }

    const StatusIcon = getStatusIcon(
        booking.status
    );

    const canRequestCancellation =
        booking.status === "Approved" ||
        booking.status === "Pending";

    return (
        <div className="mx-auto max-w-5xl space-y-6">
            {/* Back */}
            <Link
                to="/bookings"
                className="inline-flex items-center gap-2 text-sm font-medium text-[#6C757D] transition hover:text-[#2563EB]"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Bookings
            </Link>

            {/* Main Card */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                {/* Header */}
                <div className="border-b border-slate-100 p-6 sm:p-8">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-start gap-4">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50">
                                <CalendarDays className="h-7 w-7 text-[#2563EB]" />
                            </div>

                            <div>
                                <div className="flex flex-wrap items-center gap-3">
                                    <h1 className="text-2xl font-bold text-[#1A1A1A] sm:text-3xl">
                                        Booking #
                                        {booking.id}
                                    </h1>

                                    <span
                                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                                            booking.status
                                        )}`}
                                    >
                                        <StatusIcon className="h-3.5 w-3.5" />

                                        {booking.status}
                                    </span>
                                </div>

                                <p className="mt-2 text-sm text-[#6C757D]">
                                    Created{" "}
                                    {formatDateTime(
                                        booking.created_at ||
                                            booking.booking_date
                                    )}
                                </p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-3 sm:flex-row">
                            {canRequestCancellation && (
                                <button
                                    type="button"
                                    onClick={
                                        handleCancellation
                                    }
                                    disabled={
                                        cancelling
                                    }
                                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-5 py-3 text-sm font-semibold text-orange-600 transition hover:bg-orange-100 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <XCircle className="h-4 w-4" />

                                    {cancelling
                                        ? "Requesting..."
                                        : "Request Cancellation"}
                                </button>
                            )}

                            {booking.status ===
                                "Pending" && (
                                <Link
                                    to={`/bookings/${booking.id}/approval`}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                                >
                                    <Edit className="h-4 w-4" />
                                    Review Booking
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* Overview */}
                <div className="p-6 sm:p-8">
                    <h2 className="text-xl font-bold text-[#1A1A1A]">
                        Booking Overview
                    </h2>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {/* Student */}
                        <div className="rounded-2xl border border-slate-200 bg-[#F8F9FA] p-5">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                                <User className="h-5 w-5 text-[#2563EB]" />
                            </div>

                            <p className="mt-4 text-xs font-medium uppercase tracking-wide text-[#6C757D]">
                                Student
                            </p>

                            <p
                                className="mt-1 truncate text-sm font-bold text-[#1A1A1A]"
                                title={studentName}
                            >
                                {studentName}
                            </p>

                            <p className="mt-1 text-xs text-[#6C757D]">
                                {studentRollNo}
                            </p>
                        </div>

                        {/* Hostel */}
                        <div className="rounded-2xl border border-slate-200 bg-[#F8F9FA] p-5">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                                <MapPin className="h-5 w-5 text-[#2563EB]" />
                            </div>

                            <p className="mt-4 text-xs font-medium uppercase tracking-wide text-[#6C757D]">
                                Hostel
                            </p>

                            <p
                                className="mt-1 truncate text-sm font-bold text-[#1A1A1A]"
                                title={hostelName}
                            >
                                {hostelName}
                            </p>
                        </div>

                        {/* Room */}
                        <div className="rounded-2xl border border-slate-200 bg-[#F8F9FA] p-5">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                                <DoorOpen className="h-5 w-5 text-[#2563EB]" />
                            </div>

                            <p className="mt-4 text-xs font-medium uppercase tracking-wide text-[#6C757D]">
                                Room
                            </p>

                            <p className="mt-1 text-sm font-bold text-[#1A1A1A]">
                                {roomNumber}
                            </p>

                            {room?.floor !==
                                undefined && (
                                <p className="mt-1 text-xs text-[#6C757D]">
                                    Floor{" "}
                                    {room.floor}
                                </p>
                            )}
                        </div>

                        {/* Status */}
                        <div className="rounded-2xl border border-slate-200 bg-[#F8F9FA] p-5">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                                <Clock3 className="h-5 w-5 text-[#2563EB]" />
                            </div>

                            <p className="mt-4 text-xs font-medium uppercase tracking-wide text-[#6C757D]">
                                Status
                            </p>

                            <p className="mt-1 text-sm font-bold text-[#1A1A1A]">
                                {booking.status}
                            </p>
                        </div>
                    </div>

                    {/* Room Availability */}
                    {room && (
                        <div className="mt-8">
                            <h2 className="text-xl font-bold text-[#1A1A1A]">
                                Room Availability
                            </h2>

                            <div className="mt-5 grid gap-4 sm:grid-cols-3">
                                <div className="rounded-2xl border border-slate-200 p-5">
                                    <p className="text-sm text-[#6C757D]">
                                        Capacity
                                    </p>

                                    <p className="mt-1 text-2xl font-bold text-[#1A1A1A]">
                                        {
                                            room.capacity
                                        }
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-slate-200 p-5">
                                    <p className="text-sm text-[#6C757D]">
                                        Occupied Beds
                                    </p>

                                    <p className="mt-1 text-2xl font-bold text-[#1A1A1A]">
                                        {
                                            room.occupied_beds
                                        }
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
                                    <p className="text-sm text-blue-600">
                                        Available Beds
                                    </p>

                                    <p className="mt-1 text-2xl font-bold text-[#2563EB]">
                                        {
                                            availableBeds
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Booking Information */}
                    <div className="mt-8 border-t border-slate-100 pt-8">
                        <h2 className="text-xl font-bold text-[#1A1A1A]">
                            Booking Information
                        </h2>

                        <div className="mt-5 divide-y divide-slate-100 rounded-2xl border border-slate-200">
                            <div className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                                <span className="text-sm text-[#6C757D]">
                                    Booking Date
                                </span>

                                <span className="text-sm font-semibold text-[#1A1A1A]">
                                    {formatDate(
                                        booking.booking_date
                                    )}
                                </span>
                            </div>

                            <div className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                                <span className="text-sm text-[#6C757D]">
                                    Approved Date
                                </span>

                                <span className="text-sm font-semibold text-[#1A1A1A]">
                                    {formatDate(
                                        booking.approved_date
                                    )}
                                </span>
                            </div>

                            <div className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-start sm:justify-between">
                                <span className="text-sm text-[#6C757D]">
                                    Remarks
                                </span>

                                <span className="max-w-xl text-sm font-medium text-[#1A1A1A] sm:text-right">
                                    {booking.remarks ||
                                        "No remarks added."}
                                </span>
                            </div>

                            <div className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                                <span className="text-sm text-[#6C757D]">
                                    Created At
                                </span>

                                <span className="text-sm font-semibold text-[#1A1A1A]">
                                    {formatDateTime(
                                        booking.created_at
                                    )}
                                </span>
                            </div>

                            <div className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                                <span className="text-sm text-[#6C757D]">
                                    Last Updated
                                </span>

                                <span className="text-sm font-semibold text-[#1A1A1A]">
                                    {formatDateTime(
                                        booking.updated_at
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BookingDetails;