
import { useEffect, useState } from "react";
import {
    ArrowLeft,
    Building2,
    Edit,
    MapPin,
    DoorOpen,
    Trash2,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import {
    deleteHostel,
    getHostel,
} from "../../services/hostelService";

const MEDIA_BASE_URL =
    import.meta.env.VITE_MEDIA_BASE_URL || "http://127.0.0.1:8000";

function HostelDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [hostel, setHostel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetchHostel();
    }, [id]);

    const fetchHostel = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getHostel(id);
            setHostel(data);
        } catch (err) {
            console.error("Fetch Hostel Details Error:", err);

            const message =
                err?.response?.data?.detail ||
                "Unable to load hostel details.";

            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const getImageUrl = (image) => {
        if (!image) return "";

        if (
            image.startsWith("http://") ||
            image.startsWith("https://")
        ) {
            return image;
        }

        return `${MEDIA_BASE_URL}${image}`;
    };

    const handleDelete = async () => {
        if (!hostel) return;

        const confirmed = window.confirm(
            `Are you sure you want to delete ${hostel.hostel_name}? This action cannot be undone.`
        );

        if (!confirmed) return;

        try {
            setDeleting(true);

            await deleteHostel(hostel.id);

            toast.success("Hostel deleted successfully.");

            navigate("/hostels");
        } catch (err) {
            console.error("Delete Hostel Error:", err);

            const message =
                err?.response?.data?.detail ||
                "Unable to delete hostel.";

            toast.error(message);
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="mx-auto max-w-5xl animate-pulse space-y-6">
                <div className="h-5 w-32 rounded bg-slate-200" />

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="h-72 bg-slate-200 sm:h-96" />

                    <div className="space-y-5 p-6 sm:p-8">
                        <div className="h-8 w-64 rounded bg-slate-200" />
                        <div className="h-5 w-32 rounded bg-slate-200" />
                        <div className="h-5 w-full rounded bg-slate-100" />
                        <div className="h-5 w-2/3 rounded bg-slate-100" />
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
                        <Building2 className="h-7 w-7 text-red-500" />
                    </div>

                    <h2 className="mt-5 text-xl font-semibold text-[#1A1A1A]">
                        Unable to load hostel
                    </h2>

                    <p className="mt-2 text-sm text-[#6C757D]">
                        {error}
                    </p>

                    <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                        <button
                            type="button"
                            onClick={fetchHostel}
                            className="rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                        >
                            Try Again
                        </button>

                        <Link
                            to="/hostels"
                            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-[#1A1A1A] transition hover:bg-slate-50"
                        >
                            Back to Hostels
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (!hostel) {
        return null;
    }

    const imageUrl = getImageUrl(hostel.hostel_image);

    return (
        <div className="mx-auto max-w-5xl space-y-6">
            {/* Back */}
            <Link
                to="/hostels"
                className="inline-flex items-center gap-2 text-sm font-medium text-[#6C757D] transition hover:text-[#2563EB]"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Hostels
            </Link>

            {/* Main Card */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                {/* Image */}
                <div className="relative h-72 bg-slate-100 sm:h-96">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={hostel.hostel_name}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100">
                            <Building2 className="h-24 w-24 text-blue-200" />
                        </div>
                    )}

                    {/* Type Badge */}
                    <span className="absolute left-5 top-5 rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-[#2563EB] shadow-sm backdrop-blur">
                        {hostel.hostel_type}
                    </span>
                </div>

                {/* Details */}
                <div className="p-6 sm:p-8">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                                    <Building2 className="h-5 w-5 text-[#2563EB]" />
                                </div>

                                <h1 className="text-2xl font-bold text-[#1A1A1A] sm:text-3xl">
                                    {hostel.hostel_name}
                                </h1>
                            </div>

                            {/* Address */}
                            <div className="mt-6 flex items-start gap-3">
                                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#6C757D]" />

                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-[#6C757D]">
                                        Address
                                    </p>

                                    <p className="mt-1 text-sm leading-6 text-[#1A1A1A] sm:text-base">
                                        {hostel.address}
                                    </p>
                                </div>
                            </div>

                            {/* Type */}
                            <div className="mt-5 flex items-center gap-3">
                                <Building2 className="h-5 w-5 shrink-0 text-[#6C757D]" />

                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-[#6C757D]">
                                        Hostel Type
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-[#1A1A1A]">
                                        {hostel.hostel_type}
                                    </p>
                                </div>
                            </div>

                            {/* Total Rooms */}
                            <div className="mt-5 flex items-center gap-3">
                                <DoorOpen className="h-5 w-5 shrink-0 text-[#6C757D]" />

                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-[#6C757D]">
                                        Total Rooms
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-[#1A1A1A]">
                                        {hostel.total_rooms}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto lg:flex-col">
                            <Link
                                to={`/hostels/${hostel.id}/edit`}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                            >
                                <Edit className="h-4 w-4" />
                                Edit Hostel
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
                                    : "Delete Hostel"}
                            </button>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="mt-8 grid gap-4 border-t border-slate-100 pt-8 sm:grid-cols-2">
                        <div className="rounded-2xl bg-[#F8F9FA] p-5">
                            <p className="text-sm text-[#6C757D]">
                                Hostel Type
                            </p>

                            <p className="mt-2 text-xl font-bold text-[#1A1A1A]">
                                {hostel.hostel_type}
                            </p>
                        </div>

                        <div className="rounded-2xl bg-[#F8F9FA] p-5">
                            <p className="text-sm text-[#6C757D]">
                                Total Rooms
                            </p>

                            <p className="mt-2 text-xl font-bold text-[#1A1A1A]">
                                {hostel.total_rooms}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HostelDetails;

