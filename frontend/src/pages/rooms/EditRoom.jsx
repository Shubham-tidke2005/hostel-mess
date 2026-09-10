import { useEffect, useState } from "react";
import { ArrowLeft, BedDouble } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import RoomForm from "../../components/rooms/RoomForm";
import {
    getRoom,
    updateRoom,
} from "../../services/roomService";
import { getHostels } from "../../services/hostelService";

function EditRoom() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [room, setRoom] = useState(null);
    const [hostels, setHostels] = useState([]);

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError("");

            const [roomData, hostelData] = await Promise.all([
                getRoom(id),
                getHostels(),
            ]);

            setRoom(roomData);

            if (Array.isArray(hostelData)) {
                setHostels(hostelData);
            } else {
                setHostels(hostelData?.results || []);
            }
        } catch (err) {
            console.error("Fetch Edit Room Data Error:", err);

            setError(
                err?.response?.data?.detail ||
                    "Unable to load room details."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateRoom = async (formData) => {
        try {
            setSubmitting(true);

            await updateRoom(id, formData);

            toast.success("Room updated successfully.");

            navigate(`/rooms/${id}`);
        } catch (err) {
            console.error("Update Room Error:", err);

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
                    firstError || "Unable to update room."
                );
            } else {
                toast.error("Unable to update room.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="mx-auto max-w-4xl space-y-8 animate-pulse">
                <div className="space-y-3">
                    <div className="h-5 w-40 rounded bg-slate-200" />
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
                        Unable to load room
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-[#6C757D]">
                        {error}
                    </p>

                    <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                        <button
                            type="button"
                            onClick={fetchData}
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
                    to={`/rooms/${id}`}
                    className="inline-flex items-center gap-2 text-sm font-medium text-[#6C757D] transition hover:text-[#2563EB]"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Room Details
                </Link>

                <div className="mt-5 flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50">
                        <BedDouble className="h-6 w-6 text-[#2563EB]" />
                    </div>

                    <div>
                        <h1 className="text-3xl font-bold text-[#1A1A1A] sm:text-4xl">
                            Edit Room
                        </h1>

                        <p className="mt-2 text-[#6C757D]">
                            Update the room information below.
                        </p>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
                <RoomForm
                    initialData={room}
                    hostels={hostels}
                    onSubmit={handleUpdateRoom}
                    submitting={submitting}
                    submitLabel="Update Room"
                />
            </div>
        </div>
    );
}

export default EditRoom;