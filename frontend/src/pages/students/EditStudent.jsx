
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    Loader2,
    UserRound,
    AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";

import StudentForm from "../../components/students/StudentForm";
import {
    getStudent,
    updateStudent,
} from "../../services/studentService";

function EditStudent() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchStudent();
    }, [id]);

    const fetchStudent = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getStudent(id);

            setStudent(data);
        } catch (err) {
            console.error("Edit Student Error:", err);

            const message =
                err?.response?.data?.detail ||
                err?.response?.data?.message ||
                "Unable to load student details.";

            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (formData) => {
        try {
            setSubmitting(true);

            await updateStudent(id, formData);

            toast.success("Student updated successfully.");

            navigate(`/students/${id}`, {
                replace: true,
            });
        } catch (err) {
            console.error("Update Student Error:", err);

            const responseErrors = err?.response?.data;

            if (
                responseErrors &&
                typeof responseErrors === "object"
            ) {
                const messages = Object.entries(responseErrors)
                    .map(([field, value]) => {
                        const message = Array.isArray(value)
                            ? value.join(", ")
                            : String(value);

                        return `${field}: ${message}`;
                    })
                    .join("\n");

                toast.error(
                    messages || "Failed to update student."
                );
            } else {
                toast.error("Failed to update student.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    /* ---------------- Loading ---------------- */

    if (loading) {
        return (
            <div className="min-h-[500px] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
                        <Loader2 className="h-7 w-7 animate-spin text-[#2563EB]" />
                    </div>

                    <p className="text-sm font-medium text-[#6C757D]">
                        Loading student details...
                    </p>
                </div>
            </div>
        );
    }

    /* ---------------- Error ---------------- */

    if (error || !student) {
        return (
            <div className="min-h-[500px] flex items-center justify-center px-4">
                <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
                        <AlertCircle className="h-7 w-7 text-red-500" />
                    </div>

                    <h2 className="mt-5 text-xl font-bold text-[#1A1A1A]">
                        Unable to Load Student
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-[#6C757D]">
                        {error ||
                            "The requested student could not be found."}
                    </p>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                        <button
                            type="button"
                            onClick={fetchStudent}
                            className="rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                        >
                            Try Again
                        </button>

                        <Link
                            to="/students"
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-[#1A1A1A] transition hover:bg-slate-50"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Students
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    /* ---------------- Edit Page ---------------- */

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                            <UserRound className="h-5 w-5 text-[#2563EB]" />
                        </div>

                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-[#1A1A1A]">
                                Edit Student
                            </h1>

                            <p className="mt-1 text-sm text-[#6C757D]">
                                Update student information and profile
                                details.
                            </p>
                        </div>
                    </div>
                </div>

                <Link
                    to={`/students/${id}`}
                    className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#1A1A1A] shadow-sm transition hover:bg-slate-50"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Details
                </Link>
            </div>

            {/* Student information */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    {/* Avatar */}
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-blue-50">
                        {student.profile_image ? (
                            <img
                                src={
                                    student.profile_image.startsWith(
                                        "http"
                                    )
                                        ? student.profile_image
                                        : `${
                                              import.meta.env
                                                  .VITE_MEDIA_BASE_URL ||
                                              "http://127.0.0.1:8000"
                                          }${student.profile_image}`
                                }
                                alt={student.full_name}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <UserRound className="h-7 w-7 text-[#2563EB]" />
                        )}
                    </div>

                    <div>
                        <h2 className="text-lg font-bold text-[#1A1A1A]">
                            {student.full_name}
                        </h2>

                        <p className="mt-1 text-sm text-[#6C757D]">
                            Roll No:{" "}
                            <span className="font-medium text-[#1A1A1A]">
                                {student.roll_no}
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Form */}
            <StudentForm
                initialData={student}
                onSubmit={handleSubmit}
                submitting={submitting}
                submitLabel="Update Student"
            />
        </div>
    );
}

export default EditStudent;

