
import { useState } from "react";
import { ArrowLeft, Building2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import HostelForm from "../../components/hostels/HostelForm";
import { createHostel } from "../../services/hostelService";

function AddHostel() {
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);

    const handleCreateHostel = async (formData) => {
        try {
            setSubmitting(true);

            await createHostel(formData);

            toast.success("Hostel created successfully.");

            navigate("/hostels");
        } catch (error) {
            console.error("Create Hostel Error:", error);

            const responseData = error?.response?.data;

            if (responseData && typeof responseData === "object") {
                const firstError = Object.values(responseData)
                    .flat()
                    .find(
                        (message) =>
                            typeof message === "string" &&
                            message.trim()
                    );

                toast.error(
                    firstError || "Unable to create hostel."
                );
            } else {
                toast.error("Unable to create hostel.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="mx-auto max-w-4xl space-y-8">
            {/* Header */}
            <div>
                <Link
                    to="/hostels"
                    className="inline-flex items-center gap-2 text-sm font-medium text-[#6C757D] transition hover:text-[#2563EB]"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Hostels
                </Link>

                <div className="mt-5 flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50">
                        <Building2 className="h-6 w-6 text-[#2563EB]" />
                    </div>

                    <div>
                        <h1 className="text-3xl font-bold text-[#1A1A1A] sm:text-4xl">
                            Add Hostel
                        </h1>

                        <p className="mt-2 text-[#6C757D]">
                            Add a new hostel to the hostel management
                            system.
                        </p>
                    </div>
                </div>
            </div>

            {/* Form Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
                <HostelForm
                    onSubmit={handleCreateHostel}
                    submitting={submitting}
                    submitLabel="Create Hostel"
                />
            </div>
        </div>
    );
}

export default AddHostel;

