import { useEffect, useState } from "react";
import {
    ArrowLeft,
    BedDouble,
    Building2,
    CalendarDays,
    CheckCircle2,
    Clock3,
    DoorOpen,
    User,
    XCircle,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import {
    getBooking,
    approveBooking,
    rejectBooking,
} from "../../services/bookingService";

import { getRoom } from "../../services/roomService";
import { getHostel } from "../../services/hostelService";
import { getStudent } from "../../services/studentService";

function BookingApproval() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [booking, setBooking] = useState(null);
    const [student, setStudent] = useState(null);
    const [room, setRoom] = useState(null);
    const [hostel, setHostel] = useState(null);

    const [remarks, setRemarks] = useState("");

    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
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
            setRemarks(bookingData?.remarks || "");

            /*
             * Student
             */
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

            /*
             * Room
             */
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
                "Fetch Booking Approval Error:",
                err
            );

            setError(
                err?.response?.data?.detail ||
                    "Unable to load booking request."
            );
        } finally {
            setLoading(false);
        }
    };

    /*
     * Fetch hostel after room has loaded.
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

    const studentName =
        student?.full_name ||
        `${student?.user?.first_name || ""} ${
            student?.user?.last_name || ""
        }`.trim() ||
        student?.roll_no ||
        "Unknown Student";

    const studentRollNo =
        student?.roll_no || "—";

    const roomNumber =
        room?.room_number ||
        (booking?.room
            ? `#${booking.room}`
            : "—");

    const hostelName =
        hostel?.hostel_name ||
        "Unknown Hostel";

    const availableBeds = room
        ? Math.max(
              Number(room.capacity || 0) -
                  Number(room.occupied_beds || 0),
              0
          )
        : 0;

    const handleApprove = async () => {
        if (!booking) return;

        const confirmed = window.confirm(
            `Approve booking #${booking.id} for ${studentName}?`
        );

        if (!confirmed) return;

        try {
            setProcessing(true);

            await approveBooking(
                booking.id,
                remarks.trim()
            );

            toast.success(
                "Booking approved successfully."
            );

            navigate(`/bookings/${booking.id}`);
        } catch (err) {
            console.error(
                "Approve Booking Error:",
                err
            );

            const message =
                err?.response?.data?.detail ||
                "Unable to approve booking.";

            toast.error(message);
        } finally {
            setProcessing(false);
        }
    };

    const handleReject = async () => {
        if (!booking) return;

        const confirmed = window.confirm(
            `Reject booking #${booking.id} for ${studentName}?`
        );

        if (!confirmed) return;

        try {
            setProcessing(true);

            await rejectBooking(
                booking.id,
                remarks.trim()
            );

            toast.success(
                "Booking rejected successfully."
            );

            navigate(`/bookings/${booking.id}`);
        } catch (err) {
            console.error(
                "Reject Booking Error:",
                err
            );

            const message =
                err?.response?.data?.detail ||
                "Unable to reject booking.";

            toast.error(message);
        } finally {
            setProcessing(false);
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
                            <div className="h-8 w-56 rounded bg-slate-200" />
                            <div className="h-4 w-40 rounded bg-slate-100" />
                        </div>
                    </div>

                    <div className="mt-8 grid gap-4 sm:grid-cols-2">
                        {[1, 2, 3, 4].map((item) => (
                            <div
                                key={item}
                                className="h-28 rounded-2xl bg-slate-100"
                            />
                        ))}
                    </div>

                    <div className="mt-8 h-40 rounded-2xl bg-slate-100" />
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

    if (booking.status !== "Pending") {
        return (
            <div className="mx-auto max-w-5xl space-y-6">
                <Link
                    to={`/bookings/${booking.id}`}
                    className="inline-flex items-center gap-2 text-sm font-medium text-[#6C757D] transition hover:text-[#2563EB]"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Booking
                </Link>

                <div className="rounded-2xl border border-yellow-200 bg-white p-8 text-center shadow-sm">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-yellow-50">
                        <Clock3 className="h-7 w-7 text-yellow-600" />
                    </div>

                    <h2 className="mt-5 text-xl font-semibold text-[#1A1A1A]">
                        Booking already processed
                    </h2>

                    <p className="mt-2 text-sm text-[#6C757D]">
                        This booking is currently{" "}
                        <span className="font-semibold text-[#1A1A1A]">
                            {booking.status}
                        </span>
                        .
                    </p>

                    <Link
                        to={`/bookings/${booking.id}`}
                        className="mt-6 inline-flex rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                        View Booking
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-5xl space-y-6">
            {/* Back */}
            <Link
                to={`/bookings/${booking.id}`}
                className="inline-flex items-center gap-2 text-sm font-medium text-[#6C757D] transition hover:text-[#2563EB]"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Booking
            </Link>

            {/* Header */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 p-6 sm:p-8">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-start gap-4">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50">
                                <CalendarDays className="h-7 w-7 text-[#2563EB]" />
                            </div>

                            <div>
                                <div className="flex flex-wrap items-center gap-3">
                                    <h1 className="text-2xl font-bold text-[#1A1A1A] sm:text-3xl">
                                        Review Booking #
                                        {booking.id}
                                    </h1>

                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-yellow-200 bg-yellow-50 px-3 py-1 text-xs font-semibold text-yellow-700">
                                        <Clock3 className="h-3.5 w-3.5" />
                                        Pending
                                    </span>
                                </div>

                                <p className="mt-2 text-sm text-[#6C757D]">
                                    Submitted on{" "}
                                    {formatDate(
                                        booking.booking_date
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Request Details */}
                <div className="p-6 sm:p-8">
                    <h2 className="text-xl font-bold text-[#1A1A1A]">
                        Booking Request
                    </h2>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                        {/* Student */}
                        <div className="rounded-2xl border border-slate-200 bg-[#F8F9FA] p-5">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                                    <User className="h-5 w-5 text-[#2563EB]" />
                                </div>

                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-[#6C757D]">
                                        Student
                                    </p>

                                    <p className="mt-1 text-sm font-bold text-[#1A1A1A]">
                                        {studentName}
                                    </p>

                                    <p className="text-xs text-[#6C757D]">
                                        {studentRollNo}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Hostel */}
                        <div className="rounded-2xl border border-slate-200 bg-[#F8F9FA] p-5">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                                    <Building2 className="h-5 w-5 text-[#2563EB]" />
                                </div>

                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-[#6C757D]">
                                        Hostel
                                    </p>

                                    <p className="mt-1 text-sm font-bold text-[#1A1A1A]">
                                        {hostelName}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Room */}
                        <div className="rounded-2xl border border-slate-200 bg-[#F8F9FA] p-5">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                                    <DoorOpen className="h-5 w-5 text-[#2563EB]" />
                                </div>

                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-[#6C757D]">
                                        Room
                                    </p>

                                    <p className="mt-1 text-sm font-bold text-[#1A1A1A]">
                                        {roomNumber}
                                    </p>

                                    {room?.floor !==
                                        undefined && (
                                        <p className="text-xs text-[#6C757D]">
                                            Floor{" "}
                                            {room.floor}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Request Date */}
                        <div className="rounded-2xl border border-slate-200 bg-[#F8F9FA] p-5">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                                    <CalendarDays className="h-5 w-5 text-[#2563EB]" />
                                </div>

                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-[#6C757D]">
                                        Request Date
                                    </p>

                                    <p className="mt-1 text-sm font-bold text-[#1A1A1A]">
                                        {formatDate(
                                            booking.booking_date
                                        )}
                                    </p>
                                </div>
                            </div>
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
                                    <div className="flex items-center gap-3">
                                        <BedDouble className="h-5 w-5 text-[#6C757D]" />

                                        <span className="text-sm text-[#6C757D]">
                                            Capacity
                                        </span>
                                    </div>

                                    <p className="mt-3 text-2xl font-bold text-[#1A1A1A]">
                                        {room.capacity}
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-slate-200 p-5">
                                    <div className="flex items-center gap-3">
                                        <User className="h-5 w-5 text-[#6C757D]" />

                                        <span className="text-sm text-[#6C757D]">
                                            Occupied
                                        </span>
                                    </div>

                                    <p className="mt-3 text-2xl font-bold text-[#1A1A1A]">
                                        {room.occupied_beds}
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
                                    <div className="flex items-center gap-3">
                                        <BedDouble className="h-5 w-5 text-[#2563EB]" />

                                        <span className="text-sm text-blue-600">
                                            Available
                                        </span>
                                    </div>

                                    <p className="mt-3 text-2xl font-bold text-[#2563EB]">
                                        {availableBeds}
                                    </p>
                                </div>
                            </div>

                            {availableBeds === 0 && (
                                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
                                    <p className="text-sm font-medium text-red-700">
                                        This room currently has no
                                        available beds. The booking
                                        should not be approved.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Student Remarks */}
                    <div className="mt-8 border-t border-slate-100 pt-8">
                        <h2 className="text-xl font-bold text-[#1A1A1A]">
                            Booking Remarks
                        </h2>

                        <div className="mt-4 rounded-2xl bg-[#F8F9FA] p-5">
                            <p className="text-sm leading-6 text-[#1A1A1A]">
                                {booking.remarks ||
                                    "No remarks provided by the student."}
                            </p>
                        </div>
                    </div>

                    {/* Admin Remarks */}
                    <div className="mt-8">
                        <label
                            htmlFor="remarks"
                            className="mb-2 block text-sm font-medium text-[#1A1A1A]"
                        >
                            Admin Remarks
                        </label>

                        <textarea
                            id="remarks"
                            value={remarks}
                            onChange={(event) =>
                                setRemarks(event.target.value)
                            }
                            maxLength={500}
                            rows={5}
                            disabled={processing}
                            placeholder="Add a reason or note for this decision..."
                            className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#1A1A1A] outline-none transition placeholder:text-slate-400 focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
                        />

                        <div className="mt-1 flex justify-end">
                            <span className="text-xs text-[#6C757D]">
                                {remarks.length}/500
                            </span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
                        <Link
                            to={`/bookings/${booking.id}`}
                            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-[#1A1A1A] transition hover:bg-slate-50"
                        >
                            Cancel
                        </Link>

                        <button
                            type="button"
                            onClick={handleReject}
                            disabled={processing}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-6 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <XCircle className="h-5 w-5" />
                            {processing
                                ? "Processing..."
                                : "Reject Booking"}
                        </button>

                        <button
                            type="button"
                            onClick={handleApprove}
                            disabled={
                                processing ||
                                (room &&
                                    availableBeds <= 0)
                            }
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <CheckCircle2 className="h-5 w-5" />
                            {processing
                                ? "Processing..."
                                : "Approve Booking"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BookingApproval;