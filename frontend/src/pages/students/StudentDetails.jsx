
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    Edit,
    Mail,
    Phone,
    User,
    GraduationCap,
    MapPin,
    CalendarDays,
    Hash,
    Loader2,
} from "lucide-react";
import toast from "react-hot-toast";

import { getStudent } from "../../services/studentService";

function StudentDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
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
            console.error("Student Details Error:", err);
            setError("Unable to load student details.");
            toast.error("Failed to load student details.");
        } finally {
            setLoading(false);
        }
    };

    const getInitials = (name = "") => {
        return name
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map((word) => word[0])
            .join("")
            .toUpperCase();
    };

    const getYearLabel = (year) => {
        const years = {
            1: "1st Year",
            2: "2nd Year",
            3: "3rd Year",
            4: "4th Year",
        };

        return years[year] || year || "Not specified";
    };

    const getMediaUrl = (image) => {
        if (!image) return null;

        if (image.startsWith("http")) {
            return image;
        }

        const baseUrl =
            import.meta.env.VITE_MEDIA_BASE_URL ||
            "http://127.0.0.1:8000";

        return `${baseUrl}${image}`;
    };

    if (loading) {
        return (
            <div className="flex min-h-[500px] items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-[#2563EB]" />
                    <p className="text-sm text-[#6C757D]">
                        Loading student details...
                    </p>
                </div>
            </div>
        );
    }

    if (error || !student) {
        return (
            <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
                    <User className="h-7 w-7 text-red-500" />
                </div>

                <h2 className="text-xl font-semibold text-[#1A1A1A]">
                    Student Not Found
                </h2>

                <p className="mt-2 text-[#6C757D]">
                    {error || "The requested student could not be found."}
                </p>

                <button
                    onClick={() => navigate("/students")}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                    <ArrowLeft size={18} />
                    Back to Students
                </button>
            </div>
        );
    }

    const imageUrl = getMediaUrl(student.profile_image);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <Link
                        to="/students"
                        className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-[#6C757D] transition hover:text-[#2563EB]"
                    >
                        <ArrowLeft size={17} />
                        Back to Students
                    </Link>

                    <h1 className="text-3xl font-bold text-[#1A1A1A] sm:text-4xl">
                        Student Details
                    </h1>

                    <p className="mt-2 text-[#6C757D]">
                        View complete information about this student.
                    </p>
                </div>

                <Link
                    to={`/students/${student.id}/edit`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md"
                >
                    <Edit size={18} />
                    Edit Student
                </Link>
            </div>

            {/* Profile Header */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="h-28 bg-gradient-to-r from-blue-600 to-blue-500 sm:h-36" />

                <div className="px-5 pb-6 sm:px-8">
                    <div className="-mt-14 flex flex-col gap-5 sm:-mt-16 sm:flex-row sm:items-end">
                        {/* Profile Image */}
                        <div className="flex-shrink-0">
                            {imageUrl ? (
                                <img
                                    src={imageUrl}
                                    alt={student.full_name}
                                    className="h-28 w-28 rounded-2xl border-4 border-white object-cover shadow-md sm:h-32 sm:w-32"
                                />
                            ) : (
                                <div className="flex h-28 w-28 items-center justify-center rounded-2xl border-4 border-white bg-blue-100 text-3xl font-bold text-[#2563EB] shadow-md sm:h-32 sm:w-32">
                                    {getInitials(student.full_name)}
                                </div>
                            )}
                        </div>

                        {/* Name */}
                        <div className="pb-1">
                            <h2 className="text-2xl font-bold text-[#1A1A1A]">
                                {student.full_name || "Unnamed Student"}
                            </h2>

                            <p className="mt-1 text-sm text-[#6C757D]">
                                Roll No: {student.roll_no || "Not specified"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Information Cards */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Personal Information */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                            <User className="h-5 w-5 text-[#2563EB]" />
                        </div>

                        <div>
                            <h3 className="font-semibold text-[#1A1A1A]">
                                Personal Information
                            </h3>
                            <p className="text-sm text-[#6C757D]">
                                Basic student information
                            </p>
                        </div>
                    </div>

                    <div className="space-y-5">
                        <InfoRow
                            icon={Hash}
                            label="Roll Number"
                            value={student.roll_no}
                        />

                        <InfoRow
                            icon={User}
                            label="Full Name"
                            value={student.full_name}
                        />

                        <InfoRow
                            icon={User}
                            label="Gender"
                            value={student.gender}
                        />

                        <InfoRow
                            icon={Phone}
                            label="Phone"
                            value={student.phone}
                        />

                        <InfoRow
                            icon={Mail}
                            label="Email"
                            value={student.user?.email || student.email}
                        />
                    </div>
                </div>

                {/* Academic Information */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                            <GraduationCap className="h-5 w-5 text-[#2563EB]" />
                        </div>

                        <div>
                            <h3 className="font-semibold text-[#1A1A1A]">
                                Academic Information
                            </h3>
                            <p className="text-sm text-[#6C757D]">
                                Course and year details
                            </p>
                        </div>
                    </div>

                    <div className="space-y-5">
                        <InfoRow
                            icon={GraduationCap}
                            label="Department"
                            value={student.department}
                        />

                        <InfoRow
                            icon={CalendarDays}
                            label="Year"
                            value={getYearLabel(student.year)}
                        />
                    </div>
                </div>

                {/* Address */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                            <MapPin className="h-5 w-5 text-[#2563EB]" />
                        </div>

                        <div>
                            <h3 className="font-semibold text-[#1A1A1A]">
                                Address
                            </h3>
                            <p className="text-sm text-[#6C757D]">
                                Student residential address
                            </p>
                        </div>
                    </div>

                    <p className="rounded-xl bg-[#F8F9FA] p-4 text-sm leading-6 text-[#1A1A1A]">
                        {student.address || "Address not provided."}
                    </p>
                </div>
            </div>

            {/* Record Information */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="mb-5 font-semibold text-[#1A1A1A]">
                    Record Information
                </h3>

                <div className="grid gap-5 sm:grid-cols-2">
                    <InfoRow
                        icon={CalendarDays}
                        label="Created At"
                        value={formatDate(student.created_at)}
                    />

                    <InfoRow
                        icon={CalendarDays}
                        label="Last Updated"
                        value={formatDate(student.updated_at)}
                    />
                </div>
            </div>
        </div>
    );
}

function InfoRow({ icon: Icon, label, value }) {
    return (
        <div className="flex items-start gap-3">
            <Icon className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#6C757D]" />

            <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-[#6C757D]">
                    {label}
                </p>

                <p className="mt-1 break-words text-sm font-medium text-[#1A1A1A]">
                    {value || "Not provided"}
                </p>
            </div>
        </div>
    );
}

function formatDate(date) {
    if (!date) return "Not available";

    return new Date(date).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default StudentDetails;
