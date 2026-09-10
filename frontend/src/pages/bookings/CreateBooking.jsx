import { useEffect, useState } from "react";
import { ArrowLeft, CalendarPlus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import BookingForm from "../../components/bookings/BookingForm";
import { createBooking } from "../../services/bookingService";
import { getRooms } from "../../services/roomService";

function CreateBooking() {
    const navigate = useNavigate();

    const [rooms, setRooms] = useState([]);
    const [loadingRooms, setLoadingRooms] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            setLoadingRooms(true);
            setError("");

            const data = await getRooms();

            const roomList = Array.isArray(data)
                ? data
                : data?.results || [];

            setRooms(roomList);
        } catch (error) {
    console.error("Create Booking Error:", error);

    console.log("Backend Response:", error?.response?.data);

    const responseData = error?.response?.data;

    if (responseData && typeof responseData === "object") {
        const messages = Object.entries(responseData)
            .flatMap(([field, value]) => {
                if (Array.isArray(value)) {
                    return value.map(
                        (message) =>
                            `${field}: ${message}`
                    );
                }

                return [`${field}: ${value}`];
            });

        toast.error(
            messages.join(" | ") ||
                "Unable to create booking."
        );
    } else {
        toast.error("Unable to create booking.");
    }
}finally {
            setLoadingRooms(false);
        }
    };

    const handleCreateBooking = async (bookingData) => {
        try {
            setSubmitting(true);

            await createBooking(bookingData);

            toast.success(
                "Booking request submitted successfully."
            );

            navigate("/bookings");
        } catch (err) {
            console.error(
                "Create Booking Error:",
                err
            );

            const responseData = err?.response?.data;

            if (
                responseData &&
                typeof responseData === "object"
            ) {
                const firstError = Object.values(responseData)
                    .flat()
                    .find(
                        (message) =>
                            typeof message === "string" &&
                            message.trim()
                    );

                toast.error(
                    firstError ||
                        "Unable to create booking."
                );
            } else {
                toast.error("Unable to create booking.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loadingRooms) {
        return (
            <div className="mx-auto max-w-4xl space-y-8 animate-pulse">
                <div className="space-y-3">
                    <div className="h-5 w-36 rounded bg-slate-200" />
                    <div className="h-10 w-72 rounded-lg bg-slate-200" />
                    <div className="h-5 w-96 max-w-full rounded bg-slate-100" />
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <div className="space-y-6">
                        <div className="h-12 rounded-xl bg-slate-100" />
                        <div className="h-32 rounded-2xl bg-slate-100" />
                        <div className="h-32 rounded-xl bg-slate-100" />
                        <div className="h-12 rounded-xl bg-slate-100" />
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mx-auto max-w-4xl">
                <div className="rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
                        <CalendarPlus className="h-7 w-7 text-red-500" />
                    </div>

                    <h2 className="mt-5 text-xl font-semibold text-[#1A1A1A]">
                        Unable to load rooms
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-[#6C757D]">
                        {error}
                    </p>

                    <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                        <button
                            type="button"
                            onClick={fetchRooms}
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

    return (
        <div className="mx-auto max-w-4xl space-y-8">
            {/* Header */}
            <div>
                <Link
                    to="/bookings"
                    className="inline-flex items-center gap-2 text-sm font-medium text-[#6C757D] transition hover:text-[#2563EB]"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Bookings
                </Link>

                <div className="mt-5 flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50">
                        <CalendarPlus className="h-6 w-6 text-[#2563EB]" />
                    </div>

                    <div>
                        <h1 className="text-3xl font-bold text-[#1A1A1A] sm:text-4xl">
                            Create Booking
                        </h1>

                        <p className="mt-2 text-[#6C757D]">
                            Select an available room and submit
                            your booking request.
                        </p>
                    </div>
                </div>
            </div>

            {/* Form */}
            {rooms.length === 0 ? (
                <div className="rounded-2xl border border-yellow-200 bg-white p-8 text-center shadow-sm">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-yellow-50">
                        <CalendarPlus className="h-7 w-7 text-yellow-600" />
                    </div>

                    <h2 className="mt-5 text-xl font-semibold text-[#1A1A1A]">
                        No rooms available
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-[#6C757D]">
                        There are currently no rooms available
                        for booking.
                    </p>

                    <Link
                        to="/rooms"
                        className="mt-6 inline-flex rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                        View Rooms
                    </Link>
                </div>
            ) : (
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
                    <BookingForm
                        rooms={rooms}
                        onSubmit={handleCreateBooking}
                        submitting={submitting}
                        submitLabel="Request Booking"
                    />
                </div>
            )}
        </div>
    );
}

export default CreateBooking;