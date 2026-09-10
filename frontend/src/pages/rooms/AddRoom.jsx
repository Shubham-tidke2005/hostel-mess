import { useEffect, useState } from "react";
import { ArrowLeft, BedDouble } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import RoomForm from "../../components/rooms/RoomForm";
import { createRoom } from "../../services/roomService";
import { getHostels } from "../../services/hostelService";

function AddRoom() {
    const navigate = useNavigate();

    const [hostels, setHostels] = useState([]);
    const [loadingHostels, setLoadingHostels] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchHostels();
    }, []);

    const fetchHostels = async () => {
        try {
            setLoadingHostels(true);
            setError("");

            const data = await getHostels();

            if (Array.isArray(data)) {
                setHostels(data);
            } else {
                setHostels(data?.results || []);
            }
        } catch (err) {
            console.error("Fetch Hostels Error:", err);

            setError(
                err?.response?.data?.detail ||
                    "Unable to load hostels."
            );
        } finally {
            setLoadingHostels(false);
        }
    };

    const handleCreateRoom = async (formData) => {
        try {
            setSubmitting(true);

            await createRoom(formData);

            toast.success("Room created successfully.");

            navigate("/rooms");
        } catch (err) {
            console.error("Create Room Error:", err);

            const responseData = err?.response?.data;

            if (responseData && typeof responseData === "object") {
                const firstError = Object.values(responseData)
                    .flat()
                    .find(
                        (message) =>
                            typeof message === "string" &&
                            message.trim()
                    );

                toast.error(
                    firstError || "Unable to create room."
                );
            } else {
                toast.error("Unable to create room.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loadingHostels) {
        return (
            <div className="mx-auto max-w-4xl space-y-8 animate-pulse">
                <div className="space-y-3">
                    <div className="h-5 w-36 rounded bg-slate-200" />
                    <div className="h-10 w-64 rounded-lg bg-slate-200" />
                    <div className="h-5 w-96 max-w-full rounded bg-slate-100" />
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <div className="space-y-6">
                        <div className="h-12 rounded-xl bg-slate-100" />
                        <div className="h-12 rounded-xl bg-slate-100" />
                        <div className="h-12 rounded-xl bg-slate-100" />
                        <div className="h-12 rounded-xl bg-slate-100" />
                        <div className="h-12 rounded-xl bg-slate-100" />
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
                        <BedDouble className="h-7 w-7 text-red-500" />
                    </div>

                    <h2 className="mt-5 text-xl font-semibold text-[#1A1A1A]">
                        Unable to load hostels
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-[#6C757D]">
                        {error}
                    </p>

                    <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                        <button
                            type="button"
                            onClick={fetchHostels}
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

    return (
        <div className="mx-auto max-w-4xl space-y-8">
            {/* Header */}
            <div>
                <Link
                    to="/rooms"
                    className="inline-flex items-center gap-2 text-sm font-medium text-[#6C757D] transition hover:text-[#2563EB]"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Rooms
                </Link>

                <div className="mt-5 flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50">
                        <BedDouble className="h-6 w-6 text-[#2563EB]" />
                    </div>

                    <div>
                        <h1 className="text-3xl font-bold text-[#1A1A1A] sm:text-4xl">
                            Add Room
                        </h1>

                        <p className="mt-2 text-[#6C757D]">
                            Add a new room to a hostel.
                        </p>
                    </div>
                </div>
            </div>

            {/* Form */}
            {hostels.length === 0 ? (
                <div className="rounded-2xl border border-yellow-200 bg-white p-8 text-center shadow-sm">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-yellow-50">
                        <BedDouble className="h-7 w-7 text-yellow-600" />
                    </div>

                    <h2 className="mt-5 text-xl font-semibold text-[#1A1A1A]">
                        No hostels available
                    </h2>

                    <p className="mt-2 text-sm text-[#6C757D]">
                        Create a hostel before adding a room.
                    </p>

                    <Link
                        to="/hostels/add"
                        className="mt-6 inline-flex rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                        Add Hostel
                    </Link>
                </div>
            ) : (
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
                    <RoomForm
                        hostels={hostels}
                        onSubmit={handleCreateRoom}
                        submitting={submitting}
                        submitLabel="Create Room"
                    />
                </div>
            )}
        </div>
    );
}

export default AddRoom;