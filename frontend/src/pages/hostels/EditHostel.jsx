
import { useEffect, useState } from "react";
import { ArrowLeft, Building2 } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import HostelForm from "../../components/hostels/HostelForm";
import {
    getHostel,
    updateHostel,
} from "../../services/hostelService";

function EditHostel() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [hostel, setHostel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

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
            console.error("Fetch Hostel Error:", err);

            const message =
                err?.response?.data?.detail ||
                "Unable to load hostel details.";

            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateHostel = async (formData) => {
        try {
            setSubmitting(true);

            await updateHostel(id, formData);

            toast.success("Hostel updated successfully.");

            navigate(`/hostels/${id}`);
        } catch (err) {
            console.error("Update Hostel Error:", err);

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
                    firstError || "Unable to update hostel."
                );
            } else {
                toast.error("Unable to update hostel.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="mx-auto max-w-4xl">
                <div className="animate-pulse space-y-6">
                    <div className="h-5 w-32 rounded bg-slate-200" />

                    <div className="h-10 w-64 rounded bg-slate-200" />

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="space-y-6">
                            <div className="h-12 rounded-xl bg-slate-100" />
                            <div className="h-12 rounded-xl bg-slate-100" />
                            <div className="h-28 rounded-xl bg-slate-100" />
                            <div className="h-12 rounded-xl bg-slate-100" />
                            <div className="h-40 rounded-2xl bg-slate-100" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mx-auto max-w-4xl">
                <div className="rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                        <Building2 className="h-6 w-6 text-red-500" />
                    </div>

                    <h2 className="mt-4 text-xl font-semibold text-[#1A1A1A]">
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

    return (
        <div className="mx-auto max-w-4xl space-y-8">
            {/* Header */}
            <div>
                <Link
                    to={`/hostels/${id}`}
                    className="inline-flex items-center gap-2 text-sm font-medium text-[#6C757D] transition hover:text-[#2563EB]"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Hostel Details
                </Link>

                <div className="mt-5 flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50">
                        <Building2 className="h-6 w-6 text-[#2563EB]" />
                    </div>

                    <div>
                        <h1 className="text-3xl font-bold text-[#1A1A1A] sm:text-4xl">
                            Edit Hostel
                        </h1>

                        <p className="mt-2 text-[#6C757D]">
                            Update the hostel information below.
                        </p>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
                <HostelForm
                    initialData={hostel}
                    onSubmit={handleUpdateHostel}
                    submitting={submitting}
                    submitLabel="Update Hostel"
                />
            </div>
        </div>
    );
}

export default EditHostel;

