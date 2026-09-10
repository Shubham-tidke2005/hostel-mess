
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
    Plus,
    Search,
    Eye,
    Pencil,
    Trash2,
    Users,
    RefreshCw,
    Phone,
    GraduationCap,
    User,
    X,
} from "lucide-react";
import toast from "react-hot-toast";

import {
    getStudents,
    deleteStudent,
} from "../../services/studentService";

const MEDIA_BASE_URL =
    import.meta.env.VITE_MEDIA_BASE_URL ||
    "http://127.0.0.1:8000";

function StudentList() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    const fetchStudents = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getStudents();

            // DRF pagination returns:
            // { count, next, previous, results }
            if (Array.isArray(data)) {
                setStudents(data);
            } else if (Array.isArray(data?.results)) {
                setStudents(data.results);
            } else {
                setStudents([]);
            }
        } catch (error) {
            console.error("Fetch students error:", error);

            setError(
                error.response?.data?.detail ||
                    "Unable to load students."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const getImageUrl = (image) => {
        if (!image) {
            return null;
        }

        if (
            image.startsWith("http://") ||
            image.startsWith("https://")
        ) {
            return image;
        }

        return `${MEDIA_BASE_URL}${image}`;
    };

    const getInitials = (name) => {
        if (!name) {
            return "ST";
        }

        return name
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map((word) => word.charAt(0).toUpperCase())
            .join("");
    };

    const getYearLabel = (year) => {
        const years = {
            1: "First Year",
            2: "Second Year",
            3: "Third Year",
            4: "Final Year",
        };

        return years[year] || year || "N/A";
    };

    const filteredStudents = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) {
            return students;
        }

        return students.filter((student) => {
            const fullName =
                student.full_name?.toLowerCase() || "";

            const rollNo =
                student.roll_no?.toLowerCase() || "";

            const department =
                student.department?.toLowerCase() || "";

            const phone =
                student.phone?.toLowerCase() || "";

            const gender =
                student.gender?.toLowerCase() || "";

            const year =
                String(student.year || "").toLowerCase();

            const yearLabel =
                getYearLabel(student.year)
                    .toLowerCase();

            return (
                fullName.includes(query) ||
                rollNo.includes(query) ||
                department.includes(query) ||
                phone.includes(query) ||
                gender.includes(query) ||
                year.includes(query) ||
                yearLabel.includes(query)
            );
        });
    }, [students, search]);

    const handleDelete = async (student) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete ${student.full_name}?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingId(student.id);

            await deleteStudent(student.id);

            setStudents((prev) =>
                prev.filter(
                    (item) => item.id !== student.id
                )
            );

            toast.success(
                "Student deleted successfully."
            );
        } catch (error) {
            console.error("Delete student error:", error);

            const responseData =
                error.response?.data;

            let message =
                "Unable to delete student.";

            if (
                responseData &&
                typeof responseData === "object"
            ) {
                const firstError = Object.values(
                    responseData
                )
                    .flat()
                    .find(
                        (item) =>
                            typeof item === "string"
                    );

                if (firstError) {
                    message = firstError;
                }
            }

            toast.error(message);
        } finally {
            setDeletingId(null);
        }
    };

    const clearSearch = () => {
        setSearch("");
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                            <Users className="h-6 w-6 text-[#2563EB]" />
                        </div>

                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-[#1A1A1A] sm:text-4xl">
                                Students
                            </h1>

                            <p className="mt-1 text-sm text-[#6C757D] sm:text-base">
                                Manage students registered in
                                the hostel.
                            </p>
                        </div>
                    </div>
                </div>

                <Link
                    to="/students/add"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    <Plus className="h-5 w-5" />
                    Add Student
                </Link>
            </div>

            {/* Stats / Search */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    {/* Student count */}
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                            <Users className="h-5 w-5 text-[#2563EB]" />
                        </div>

                        <div>
                            <p className="text-sm text-[#6C757D]">
                                Total Students
                            </p>

                            <p className="text-xl font-bold text-[#1A1A1A]">
                                {students.length}
                            </p>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="w-full lg:max-w-md">
                        <label
                            htmlFor="student-search"
                            className="sr-only"
                        >
                            Search students
                        </label>

                        <div className="relative">
                            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6C757D]" />

                            <input
                                id="student-search"
                                type="text"
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target.value
                                    )
                                }
                                placeholder="Search by name, roll no, department..."
                                className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-11 pr-11 text-sm text-[#1A1A1A] outline-none transition placeholder:text-gray-400 focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
                            />

                            {search && (
                                <button
                                    type="button"
                                    onClick={clearSearch}
                                    aria-label="Clear search"
                                    className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-[#6C757D] transition hover:bg-gray-100 hover:text-[#1A1A1A]"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>

                        {search && (
                            <p className="mt-2 text-xs text-[#6C757D]">
                                Showing{" "}
                                <span className="font-semibold text-[#1A1A1A]">
                                    {filteredStudents.length}
                                </span>{" "}
                                of{" "}
                                <span className="font-semibold text-[#1A1A1A]">
                                    {students.length}
                                </span>{" "}
                                students
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Loading */}
            {loading && (
                <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                    <div className="space-y-5 animate-pulse">
                        <div className="h-5 w-40 rounded bg-gray-200" />

                        <div className="space-y-3">
                            {[1, 2, 3, 4, 5].map(
                                (item) => (
                                    <div
                                        key={item}
                                        className="h-16 rounded-xl bg-gray-100"
                                    />
                                )
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Error */}
            {!loading && error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="font-semibold text-red-700">
                                Unable to load students
                            </h2>

                            <p className="mt-1 text-sm text-red-600">
                                {error}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={fetchStudents}
                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
                        >
                            <RefreshCw className="h-4 w-4" />
                            Retry
                        </button>
                    </div>
                </div>
            )}

            {/* Empty state */}
            {!loading &&
                !error &&
                students.length === 0 && (
                    <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
                            <Users className="h-8 w-8 text-[#2563EB]" />
                        </div>

                        <h2 className="mt-5 text-xl font-semibold text-[#1A1A1A]">
                            No students found
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-sm text-[#6C757D]">
                            There are no students registered
                            in the system yet.
                        </p>

                        <Link
                            to="/students/add"
                            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                        >
                            <Plus className="h-5 w-5" />
                            Add First Student
                        </Link>
                    </div>
                )}

            {/* Search empty state */}
            {!loading &&
                !error &&
                students.length > 0 &&
                filteredStudents.length === 0 && (
                    <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                            <Search className="h-8 w-8 text-[#6C757D]" />
                        </div>

                        <h2 className="mt-5 text-xl font-semibold text-[#1A1A1A]">
                            No matching students
                        </h2>

                        <p className="mt-2 text-sm text-[#6C757D]">
                            No student matches{" "}
                            <span className="font-medium text-[#1A1A1A]">
                                "{search}"
                            </span>
                            .
                        </p>

                        <button
                            type="button"
                            onClick={clearSearch}
                            className="mt-5 inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-[#1A1A1A] transition hover:bg-gray-50"
                        >
                            <X className="h-4 w-4" />
                            Clear Search
                        </button>
                    </div>
                )}

            {/* Desktop Table */}
            {!loading &&
                !error &&
                filteredStudents.length > 0 && (
                    <div className="hidden overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm lg:block">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[900px]">
                                <thead className="border-b border-gray-200 bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#6C757D]">
                                            Student
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#6C757D]">
                                            Roll No.
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#6C757D]">
                                            Department
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#6C757D]">
                                            Year
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#6C757D]">
                                            Gender
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#6C757D]">
                                            Phone
                                        </th>

                                        <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-[#6C757D]">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-100">
                                    {filteredStudents.map(
                                        (student) => {
                                            const imageUrl =
                                                getImageUrl(
                                                    student.profile_image
                                                );

                                            return (
                                                <tr
                                                    key={
                                                        student.id
                                                    }
                                                    className="transition hover:bg-gray-50"
                                                >
                                                    {/* Student */}
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            {imageUrl ? (
                                                                <img
                                                                    src={
                                                                        imageUrl
                                                                    }
                                                                    alt={
                                                                        student.full_name
                                                                    }
                                                                    className="h-11 w-11 rounded-full border border-gray-200 object-cover"
                                                                    onError={(
                                                                        e
                                                                    ) => {
                                                                        e.currentTarget.style.display =
                                                                            "none";
                                                                        e.currentTarget.nextElementSibling?.classList.remove(
                                                                            "hidden"
                                                                        );
                                                                    }}
                                                                />
                                                            ) : null}

                                                            <div
                                                                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-[#2563EB] ${
                                                                    imageUrl
                                                                        ? "hidden"
                                                                        : ""
                                                                }`}
                                                            >
                                                                {getInitials(
                                                                    student.full_name
                                                                )}
                                                            </div>

                                                            <div className="min-w-0">
                                                                <p className="truncate font-semibold text-[#1A1A1A]">
                                                                    {
                                                                        student.full_name
                                                                    }
                                                                </p>

                                                                <p className="mt-0.5 text-xs text-[#6C757D]">
                                                                    ID:{" "}
                                                                    {
                                                                        student.id
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Roll number */}
                                                    <td className="px-6 py-4">
                                                        <span className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-[#1A1A1A]">
                                                            {
                                                                student.roll_no
                                                            }
                                                        </span>
                                                    </td>

                                                    {/* Department */}
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2 text-sm text-[#1A1A1A]">
                                                            <GraduationCap className="h-4 w-4 text-[#6C757D]" />
                                                            {
                                                                student.department
                                                            }
                                                        </div>
                                                    </td>

                                                    {/* Year */}
                                                    <td className="px-6 py-4">
                                                        <span className="text-sm text-[#1A1A1A]">
                                                            {getYearLabel(
                                                                student.year
                                                            )}
                                                        </span>
                                                    </td>

                                                    {/* Gender */}
                                                    <td className="px-6 py-4">
                                                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-[#2563EB]">
                                                            {
                                                                student.gender
                                                            }
                                                        </span>
                                                    </td>

                                                    {/* Phone */}
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2 text-sm text-[#6C757D]">
                                                            <Phone className="h-4 w-4" />
                                                            {
                                                                student.phone
                                                            }
                                                        </div>
                                                    </td>

                                                    {/* Actions */}
                                                    <td className="px-6 py-4">
                                                        <div className="flex justify-end gap-2">
                                                            <Link
                                                                to={`/students/${student.id}`}
                                                                title="View student"
                                                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-[#6C757D] transition hover:border-blue-200 hover:bg-blue-50 hover:text-[#2563EB]"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Link>

                                                            <Link
                                                                to={`/students/${student.id}/edit`}
                                                                title="Edit student"
                                                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-[#6C757D] transition hover:border-blue-200 hover:bg-blue-50 hover:text-[#2563EB]"
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                            </Link>

                                                            <button
                                                                type="button"
                                                                title="Delete student"
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        student
                                                                    )
                                                                }
                                                                disabled={
                                                                    deletingId ===
                                                                    student.id
                                                                }
                                                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-[#6C757D] transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                                                            >
                                                                {deletingId ===
                                                                student.id ? (
                                                                    <RefreshCw className="h-4 w-4 animate-spin" />
                                                                ) : (
                                                                    <Trash2 className="h-4 w-4" />
                                                                )}
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        }
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

            {/* Mobile / Tablet Cards */}
            {!loading &&
                !error &&
                filteredStudents.length > 0 && (
                    <div className="grid gap-4 lg:hidden">
                        {filteredStudents.map(
                            (student) => {
                                const imageUrl =
                                    getImageUrl(
                                        student.profile_image
                                    );

                                return (
                                    <div
                                        key={student.id}
                                        className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                                    >
                                        {/* Card header */}
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex min-w-0 items-center gap-3">
                                                {imageUrl ? (
                                                    <img
                                                        src={
                                                            imageUrl
                                                        }
                                                        alt={
                                                            student.full_name
                                                        }
                                                        className="h-12 w-12 shrink-0 rounded-full border border-gray-200 object-cover"
                                                        onError={(
                                                            e
                                                        ) => {
                                                            e.currentTarget.style.display =
                                                                "none";
                                                            e.currentTarget.nextElementSibling?.classList.remove(
                                                                "hidden"
                                                            );
                                                        }}
                                                    />
                                                ) : null}

                                                <div
                                                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-[#2563EB] ${
                                                        imageUrl
                                                            ? "hidden"
                                                            : ""
                                                    }`}
                                                >
                                                    {getInitials(
                                                        student.full_name
                                                    )}
                                                </div>

                                                <div className="min-w-0">
                                                    <h2 className="truncate font-semibold text-[#1A1A1A]">
                                                        {
                                                            student.full_name
                                                        }
                                                    </h2>

                                                    <p className="mt-1 text-sm text-[#6C757D]">
                                                        Roll No:{" "}
                                                        <span className="font-medium text-[#1A1A1A]">
                                                            {
                                                                student.roll_no
                                                            }
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>

                                            <span className="shrink-0 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-[#2563EB]">
                                                {
                                                    student.gender
                                                }
                                            </span>
                                        </div>

                                        {/* Details */}
                                        <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                            <div className="rounded-xl bg-gray-50 p-3">
                                                <div className="flex items-center gap-2">
                                                    <GraduationCap className="h-4 w-4 text-[#2563EB]" />

                                                    <span className="text-xs text-[#6C757D]">
                                                        Department
                                                    </span>
                                                </div>

                                                <p className="mt-1 text-sm font-medium text-[#1A1A1A]">
                                                    {
                                                        student.department
                                                    }
                                                </p>
                                            </div>

                                            <div className="rounded-xl bg-gray-50 p-3">
                                                <div className="flex items-center gap-2">
                                                    <User className="h-4 w-4 text-[#2563EB]" />

                                                    <span className="text-xs text-[#6C757D]">
                                                        Academic Year
                                                    </span>
                                                </div>

                                                <p className="mt-1 text-sm font-medium text-[#1A1A1A]">
                                                    {getYearLabel(
                                                        student.year
                                                    )}
                                                </p>
                                            </div>

                                            <div className="rounded-xl bg-gray-50 p-3 sm:col-span-2">
                                                <div className="flex items-center gap-2">
                                                    <Phone className="h-4 w-4 text-[#2563EB]" />

                                                    <span className="text-xs text-[#6C757D]">
                                                        Phone
                                                    </span>
                                                </div>

                                                <p className="mt-1 text-sm font-medium text-[#1A1A1A]">
                                                    {
                                                        student.phone
                                                    }
                                                </p>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="mt-5 flex gap-2 border-t border-gray-100 pt-4">
                                            <Link
                                                to={`/students/${student.id}`}
                                                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm font-medium text-[#1A1A1A] transition hover:bg-gray-50"
                                            >
                                                <Eye className="h-4 w-4" />
                                                View
                                            </Link>

                                            <Link
                                                to={`/students/${student.id}/edit`}
                                                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2.5 text-sm font-medium text-[#2563EB] transition hover:bg-blue-100"
                                            >
                                                <Pencil className="h-4 w-4" />
                                                Edit
                                            </Link>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDelete(
                                                        student
                                                    )
                                                }
                                                disabled={
                                                    deletingId ===
                                                    student.id
                                                }
                                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                {deletingId ===
                                                student.id ? (
                                                    <RefreshCw className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <Trash2 className="h-4 w-4" />
                                                )}

                                                <span className="hidden sm:inline">
                                                    Delete
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                );
                            }
                        )}
                    </div>
                )}
        </div>
    );
}

export default StudentList;

