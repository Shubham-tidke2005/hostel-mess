import { useEffect, useState } from "react";
import {
    User,
    Phone,
    GraduationCap,
    MapPin,
    Image as ImageIcon,
    Upload,
    Save,
    X,
    Trash2,
} from "lucide-react";

const initialFormData = {
    full_name: "",
    roll_no: "",
    gender: "",
    phone: "",
    department: "",
    year: "",
    address: "",
    profile_image: null,
};

function StudentForm({
    onSubmit,
    loading = false,
    onCancel,
}) {
    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});
    const [preview, setPreview] = useState("");

    /*
    |--------------------------------------------------------------------------
    | Cleanup Preview URL
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        return () => {
            if (preview) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    /*
    |--------------------------------------------------------------------------
    | Normal Input Change
    |--------------------------------------------------------------------------
    */

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Phone Input
    |--------------------------------------------------------------------------
    */

    const handlePhoneChange = (e) => {
        const value = e.target.value
            .replace(/\D/g, "")
            .slice(0, 10);

        setFormData((prev) => ({
            ...prev,
            phone: value,
        }));

        if (errors.phone) {
            setErrors((prev) => ({
                ...prev,
                phone: "",
            }));
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Profile Image
    |--------------------------------------------------------------------------
    */

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) {
            return;
        }

        // Validate file type
        if (!file.type.startsWith("image/")) {
            setErrors((prev) => ({
                ...prev,
                profile_image:
                    "Please select a valid image file.",
            }));

            return;
        }

        // Maximum 5 MB
        const maxSize = 5 * 1024 * 1024;

        if (file.size > maxSize) {
            setErrors((prev) => ({
                ...prev,
                profile_image:
                    "Image size must be less than 5 MB.",
            }));

            return;
        }

        // Clear previous error
        setErrors((prev) => ({
            ...prev,
            profile_image: "",
        }));

        // Store file
        setFormData((prev) => ({
            ...prev,
            profile_image: file,
        }));

        // Remove previous preview URL
        if (preview) {
            URL.revokeObjectURL(preview);
        }

        // Create new preview
        const previewUrl = URL.createObjectURL(file);

        setPreview(previewUrl);
    };

    /*
    |--------------------------------------------------------------------------
    | Remove Image
    |--------------------------------------------------------------------------
    */

    const handleRemoveImage = () => {
        if (preview) {
            URL.revokeObjectURL(preview);
        }

        setPreview("");

        setFormData((prev) => ({
            ...prev,
            profile_image: null,
        }));

        const fileInput =
            document.getElementById("profile_image");

        if (fileInput) {
            fileInput.value = "";
        }

        setErrors((prev) => ({
            ...prev,
            profile_image: "",
        }));
    };

    /*
    |--------------------------------------------------------------------------
    | Validation
    |--------------------------------------------------------------------------
    */

    const validate = () => {
        const newErrors = {};

        // Full Name
        if (!formData.full_name.trim()) {
            newErrors.full_name =
                "Full name is required.";
        } else if (
            formData.full_name.trim().length < 3
        ) {
            newErrors.full_name =
                "Full name must be at least 3 characters.";
        }

        // Roll Number
        if (!formData.roll_no.trim()) {
            newErrors.roll_no =
                "Roll number is required.";
        } else if (
            formData.roll_no.trim().length < 2
        ) {
            newErrors.roll_no =
                "Roll number must be at least 2 characters.";
        }

        // Gender
        if (!formData.gender) {
            newErrors.gender =
                "Please select gender.";
        }

        // Phone
        if (!formData.phone.trim()) {
            newErrors.phone =
                "Phone number is required.";
        } else if (
            !/^\d{10}$/.test(formData.phone.trim())
        ) {
            newErrors.phone =
                "Phone number must contain exactly 10 digits.";
        }

        // Department
        if (!formData.department.trim()) {
            newErrors.department =
                "Department is required.";
        } else if (
            formData.department.trim().length < 2
        ) {
            newErrors.department =
                "Department must be at least 2 characters.";
        }

        // Year
        if (!formData.year) {
            newErrors.year =
                "Please select academic year.";
        }

        // Address
        if (!formData.address.trim()) {
            newErrors.address =
                "Address is required.";
        } else if (
            formData.address.trim().length < 5
        ) {
            newErrors.address =
                "Address must be at least 5 characters.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    /*
    |--------------------------------------------------------------------------
    | Submit
    |--------------------------------------------------------------------------
    */

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        const submitData = new FormData();

        submitData.append(
            "full_name",
            formData.full_name.trim()
        );

        submitData.append(
            "roll_no",
            formData.roll_no.trim()
        );

        submitData.append(
            "gender",
            formData.gender
        );

        submitData.append(
            "phone",
            formData.phone.trim()
        );

        submitData.append(
            "department",
            formData.department.trim()
        );

        submitData.append(
            "year",
            Number(formData.year)
        );

        submitData.append(
            "address",
            formData.address.trim()
        );

        // Only append image when selected
        if (formData.profile_image) {
            submitData.append(
                "profile_image",
                formData.profile_image
            );
        }

        await onSubmit(submitData);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-8"
        >

            {/* ==================================================
                Personal Information
            =================================================== */}

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">

                <div className="mb-6 flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                        <User className="h-5 w-5 text-[#2563EB]" />
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-[#1A1A1A]">
                            Personal Information
                        </h2>

                        <p className="text-sm text-[#6C757D]">
                            Enter the student's basic details.
                        </p>
                    </div>

                </div>

                <div className="grid gap-6 md:grid-cols-2">

                    {/* Full Name */}

                    <div>
                        <label className="mb-2 block text-sm font-medium text-[#1A1A1A]">
                            Full Name{" "}
                            <span className="text-red-500">
                                *
                            </span>
                        </label>

                        <input
                            type="text"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            placeholder="Enter full name"
                            disabled={loading}
                            className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
                                errors.full_name
                                    ? "border-red-400 focus:ring-2 focus:ring-red-100"
                                    : "border-gray-300 focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
                            } disabled:cursor-not-allowed disabled:bg-gray-50`}
                        />

                        {errors.full_name && (
                            <p className="mt-1.5 text-xs text-red-500">
                                {errors.full_name}
                            </p>
                        )}
                    </div>

                    {/* Roll Number */}

                    <div>
                        <label className="mb-2 block text-sm font-medium text-[#1A1A1A]">
                            Roll Number{" "}
                            <span className="text-red-500">
                                *
                            </span>
                        </label>

                        <input
                            type="text"
                            name="roll_no"
                            value={formData.roll_no}
                            onChange={handleChange}
                            placeholder="Enter roll number"
                            disabled={loading}
                            className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
                                errors.roll_no
                                    ? "border-red-400 focus:ring-2 focus:ring-red-100"
                                    : "border-gray-300 focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
                            } disabled:cursor-not-allowed disabled:bg-gray-50`}
                        />

                        {errors.roll_no && (
                            <p className="mt-1.5 text-xs text-red-500">
                                {errors.roll_no}
                            </p>
                        )}
                    </div>

                    {/* Gender */}

                    <div>
                        <label className="mb-2 block text-sm font-medium text-[#1A1A1A]">
                            Gender{" "}
                            <span className="text-red-500">
                                *
                            </span>
                        </label>

                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            disabled={loading}
                            className={`w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition ${
                                errors.gender
                                    ? "border-red-400 focus:ring-2 focus:ring-red-100"
                                    : "border-gray-300 focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
                            } disabled:cursor-not-allowed disabled:bg-gray-50`}
                        >
                            <option value="">
                                Select gender
                            </option>

                            <option value="Male">
                                Male
                            </option>

                            <option value="Female">
                                Female
                            </option>

                            <option value="Other">
                                Other
                            </option>
                        </select>

                        {errors.gender && (
                            <p className="mt-1.5 text-xs text-red-500">
                                {errors.gender}
                            </p>
                        )}
                    </div>

                    {/* Phone */}

                    <div>
                        <label className="mb-2 block text-sm font-medium text-[#1A1A1A]">
                            Phone Number{" "}
                            <span className="text-red-500">
                                *
                            </span>
                        </label>

                        <div className="relative">

                            <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6C757D]" />

                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handlePhoneChange}
                                placeholder="Enter 10-digit phone number"
                                maxLength={10}
                                inputMode="numeric"
                                disabled={loading}
                                className={`w-full rounded-xl border py-3 pl-11 pr-4 text-sm outline-none transition ${
                                    errors.phone
                                        ? "border-red-400 focus:ring-2 focus:ring-red-100"
                                        : "border-gray-300 focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
                                } disabled:cursor-not-allowed disabled:bg-gray-50`}
                            />

                        </div>

                        {errors.phone && (
                            <p className="mt-1.5 text-xs text-red-500">
                                {errors.phone}
                            </p>
                        )}
                    </div>

                </div>
            </div>

            {/* ==================================================
                Academic Information
            =================================================== */}

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">

                <div className="mb-6 flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                        <GraduationCap className="h-5 w-5 text-[#2563EB]" />
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-[#1A1A1A]">
                            Academic Information
                        </h2>

                        <p className="text-sm text-[#6C757D]">
                            Enter the student's academic details.
                        </p>
                    </div>

                </div>

                <div className="grid gap-6 md:grid-cols-2">

                    {/* Department */}

                    <div>
                        <label className="mb-2 block text-sm font-medium text-[#1A1A1A]">
                            Department{" "}
                            <span className="text-red-500">
                                *
                            </span>
                        </label>

                        <input
                            type="text"
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            placeholder="e.g. Computer Engineering"
                            disabled={loading}
                            className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
                                errors.department
                                    ? "border-red-400 focus:ring-2 focus:ring-red-100"
                                    : "border-gray-300 focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
                            } disabled:cursor-not-allowed disabled:bg-gray-50`}
                        />

                        {errors.department && (
                            <p className="mt-1.5 text-xs text-red-500">
                                {errors.department}
                            </p>
                        )}
                    </div>

                    {/* Year */}

                    <div>
                        <label className="mb-2 block text-sm font-medium text-[#1A1A1A]">
                            Academic Year{" "}
                            <span className="text-red-500">
                                *
                            </span>
                        </label>

                        <select
                            name="year"
                            value={formData.year}
                            onChange={handleChange}
                            disabled={loading}
                            className={`w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition ${
                                errors.year
                                    ? "border-red-400 focus:ring-2 focus:ring-red-100"
                                    : "border-gray-300 focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
                            } disabled:cursor-not-allowed disabled:bg-gray-50`}
                        >
                            <option value="">
                                Select academic year
                            </option>

                            <option value="1">
                                First Year
                            </option>

                            <option value="2">
                                Second Year
                            </option>

                            <option value="3">
                                Third Year
                            </option>

                            <option value="4">
                                Final Year
                            </option>
                        </select>

                        {errors.year && (
                            <p className="mt-1.5 text-xs text-red-500">
                                {errors.year}
                            </p>
                        )}
                    </div>

                </div>
            </div>

            {/* ==================================================
                Contact & Profile
            =================================================== */}

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">

                <div className="mb-6 flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                        <MapPin className="h-5 w-5 text-[#2563EB]" />
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-[#1A1A1A]">
                            Contact & Profile
                        </h2>

                        <p className="text-sm text-[#6C757D]">
                            Add address and profile image.
                        </p>
                    </div>

                </div>

                <div className="space-y-6">

                    {/* Address */}

                    <div>
                        <label className="mb-2 block text-sm font-medium text-[#1A1A1A]">
                            Address{" "}
                            <span className="text-red-500">
                                *
                            </span>
                        </label>

                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            rows={4}
                            placeholder="Enter student's address"
                            disabled={loading}
                            className={`w-full resize-none rounded-xl border px-4 py-3 text-sm outline-none transition ${
                                errors.address
                                    ? "border-red-400 focus:ring-2 focus:ring-red-100"
                                    : "border-gray-300 focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
                            } disabled:cursor-not-allowed disabled:bg-gray-50`}
                        />

                        {errors.address && (
                            <p className="mt-1.5 text-xs text-red-500">
                                {errors.address}
                            </p>
                        )}
                    </div>

                    {/* ==================================================
                        Profile Image Upload
                    =================================================== */}

                    <div>

                        <label className="mb-2 block text-sm font-medium text-[#1A1A1A]">
                            Profile Image
                        </label>

                        {!preview ? (
                            <label
                                htmlFor="profile_image"
                                className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-10 transition hover:border-[#2563EB] hover:bg-blue-50/50"
                            >
                                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
                                    <Upload className="h-6 w-6 text-[#2563EB]" />
                                </div>

                                <p className="text-sm font-medium text-[#1A1A1A]">
                                    Click to upload profile image
                                </p>

                                <p className="mt-1 text-xs text-[#6C757D]">
                                    PNG, JPG or JPEG · Maximum 5 MB
                                </p>

                                <input
                                    id="profile_image"
                                    type="file"
                                    accept="image/png,image/jpeg,image/jpg"
                                    onChange={handleImageChange}
                                    disabled={loading}
                                    className="hidden"
                                />
                            </label>
                        ) : (
                            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">

                                <div className="flex flex-col items-center gap-5 sm:flex-row">

                                    {/* Preview */}

                                    <div className="relative">

                                        <img
                                            src={preview}
                                            alt="Profile preview"
                                            className="h-32 w-32 rounded-2xl border-4 border-white object-cover shadow-md"
                                        />

                                    </div>

                                    {/* File Information */}

                                    <div className="flex-1 text-center sm:text-left">

                                        <div className="flex items-center justify-center gap-2 sm:justify-start">
                                            <ImageIcon className="h-4 w-4 text-[#2563EB]" />

                                            <p className="max-w-xs truncate text-sm font-medium text-[#1A1A1A]">
                                                {formData.profile_image?.name}
                                            </p>
                                        </div>

                                        <p className="mt-1 text-xs text-[#6C757D]">
                                            {(
                                                formData.profile_image
                                                    ?.size /
                                                1024 /
                                                1024
                                            ).toFixed(2)}{" "}
                                            MB
                                        </p>

                                        <div className="mt-4 flex flex-wrap justify-center gap-3 sm:justify-start">

                                            <label
                                                htmlFor="profile_image"
                                                className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-[#1A1A1A] transition hover:bg-gray-100"
                                            >
                                                <Upload className="h-4 w-4" />
                                                Change
                                            </label>

                                            <button
                                                type="button"
                                                onClick={handleRemoveImage}
                                                disabled={loading}
                                                className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                Remove
                                            </button>

                                        </div>

                                        <input
                                            id="profile_image"
                                            type="file"
                                            accept="image/png,image/jpeg,image/jpg"
                                            onChange={handleImageChange}
                                            disabled={loading}
                                            className="hidden"
                                        />

                                    </div>

                                </div>

                            </div>
                        )}

                        {errors.profile_image && (
                            <p className="mt-1.5 text-xs text-red-500">
                                {errors.profile_image}
                            </p>
                        )}

                    </div>

                </div>
            </div>

            {/* ==================================================
                Actions
            =================================================== */}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                <button
                    type="button"
                    onClick={onCancel}
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3 font-medium text-[#1A1A1A] transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <X className="h-5 w-5" />
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <Save className="h-5 w-5" />

                    {loading
                        ? "Creating..."
                        : "Create Student"}
                </button>

            </div>

        </form>
    );
}

export default StudentForm;