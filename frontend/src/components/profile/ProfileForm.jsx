import { useEffect, useRef, useState } from "react";
import {
    ArrowLeft,
    Camera,
    Save,
    User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const EMPTY_FORM = {
    full_name: "",
    email: "",
    roll_no: "",
    phone: "",
    department: "",
    year: "",
    address: "",
    profile_image: null,
};

function ProfileForm({
    initialData = null,
    onSubmit,
    loading = false,
}) {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState(EMPTY_FORM);
    const [errors, setErrors] = useState({});
    const [preview, setPreview] = useState(null);

    // ==========================================
    // Load profile data
    // ==========================================
    useEffect(() => {
        if (!initialData) {
            setFormData(EMPTY_FORM);
            setPreview(null);
            return;
        }

        setFormData({
            full_name:
                initialData.full_name ||
                initialData.name ||
                "",
            email:
                initialData.email ||
                initialData.user_email ||
                initialData.user?.email ||
                "",
            roll_no: initialData.roll_no || "",
            phone: initialData.phone || "",
            department: initialData.department || "",
            year: initialData.year || "",
            address: initialData.address || "",
            profile_image: null,
        });

        const existingImage = getImageUrl(
            initialData.profile_image
        );

        setPreview(existingImage);
        setErrors({});
    }, [initialData]);

    // ==========================================
    // Input change
    // ==========================================
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

    // ==========================================
    // Profile image
    // ==========================================
    const handleImageChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please select a valid image.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Profile image must be smaller than 5 MB.");
            return;
        }

        setFormData((prev) => ({
            ...prev,
            profile_image: file,
        }));

        setPreview(URL.createObjectURL(file));

        setErrors((prev) => ({
            ...prev,
            profile_image: "",
        }));
    };

    // ==========================================
    // Validation
    // ==========================================
    const validateForm = () => {
        const newErrors = {};

        if (!formData.full_name.trim()) {
            newErrors.full_name = "Name is required.";
        }

        if (!formData.phone.trim()) {
            newErrors.phone = "Phone number is required.";
        } else if (!/^\d{10}$/.test(formData.phone.trim())) {
            newErrors.phone =
                "Phone number must contain 10 digits.";
        }

        if (!formData.department.trim()) {
            newErrors.department = "Department is required.";
        }

        if (!formData.year) {
            newErrors.year = "Year is required.";
        }

        if (!formData.address.trim()) {
            newErrors.address = "Address is required.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    // ==========================================
    // Submit
    // ==========================================
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error("Please fix the highlighted fields.");
            return;
        }

        try {
            await onSubmit({
                full_name: formData.full_name.trim(),
                phone: formData.phone.trim(),
                department: formData.department.trim(),
                year: Number(formData.year),
                address: formData.address.trim(),
                ...(formData.profile_image && {
                    profile_image: formData.profile_image,
                }),
            });
        } catch (error) {
            console.error("Profile update error:", error);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA]">
            <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">

                {/* Header */}
                <div className="mb-8">
                    <button
                        type="button"
                        onClick={() => navigate("/profile")}
                        className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-[#6C757D] transition-colors hover:text-[#2563EB]"
                    >
                        <ArrowLeft size={18} />
                        Back to Profile
                    </button>

                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[#2563EB]">
                            <User size={24} />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold text-[#1A1A1A] sm:text-3xl">
                                Edit Profile
                            </h1>

                            <p className="mt-1 text-sm text-[#6C757D]">
                                Update your personal and academic information.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-7"
                    >

                        {/* Profile Image */}
                        <div className="border-b border-gray-100 pb-7">
                            <label className="mb-4 block text-sm font-semibold text-[#1A1A1A]">
                                Profile Image
                            </label>

                            <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
                                <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-blue-50 text-2xl font-bold text-[#2563EB]">
                                    {preview ? (
                                        <img
                                            src={preview}
                                            alt="Profile preview"
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <User size={40} />
                                    )}
                                </div>

                                <div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            fileInputRef.current?.click()
                                        }
                                        disabled={loading}
                                        className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-[#1A1A1A] transition-all hover:border-[#2563EB] hover:text-[#2563EB] disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        <Camera size={17} />
                                        Choose Image
                                    </button>

                                    <p className="mt-2 text-xs text-[#6C757D]">
                                        JPG, PNG or WEBP. Maximum size 5 MB.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Basic Information */}
                        <div>
                            <h2 className="mb-5 text-lg font-bold text-[#1A1A1A]">
                                Personal Information
                            </h2>

                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                                {/* Name */}
                                <InputField
                                    label="Name"
                                    name="full_name"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    error={errors.full_name}
                                    required
                                    disabled={loading}
                                />

                                {/* Email */}
                                <InputField
                                    label="Email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    disabled
                                    helper="Email cannot be changed here."
                                />

                                {/* Roll Number */}
                                <InputField
                                    label="Roll Number"
                                    name="roll_no"
                                    value={formData.roll_no}
                                    disabled
                                />

                                {/* Phone */}
                                <InputField
                                    label="Phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    error={errors.phone}
                                    required
                                    disabled={loading}
                                    maxLength={10}
                                />

                                {/* Department */}
                                <InputField
                                    label="Department"
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    error={errors.department}
                                    required
                                    disabled={loading}
                                />

                                {/* Year */}
                                <div>
                                    <label
                                        htmlFor="year"
                                        className="mb-2 block text-sm font-semibold text-[#1A1A1A]"
                                    >
                                        Year{" "}
                                        <span className="text-red-500">
                                            *
                                        </span>
                                    </label>

                                    <select
                                        id="year"
                                        name="year"
                                        value={formData.year}
                                        onChange={handleChange}
                                        disabled={loading}
                                        className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-[#1A1A1A] outline-none transition-all focus:border-[#2563EB] focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-50 ${
                                            errors.year
                                                ? "border-red-400"
                                                : "border-gray-300"
                                        }`}
                                    >
                                        <option value="">
                                            Select year
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
                                            Fourth Year
                                        </option>
                                    </select>

                                    {errors.year && (
                                        <p className="mt-1.5 text-xs font-medium text-red-500">
                                            {errors.year}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Address */}
                        <div>
                            <label
                                htmlFor="address"
                                className="mb-2 block text-sm font-semibold text-[#1A1A1A]"
                            >
                                Address{" "}
                                <span className="text-red-500">
                                    *
                                </span>
                            </label>

                            <textarea
                                id="address"
                                name="address"
                                rows={4}
                                value={formData.address}
                                onChange={handleChange}
                                disabled={loading}
                                placeholder="Enter your address"
                                className={`w-full resize-none rounded-xl border bg-white px-4 py-3 text-sm text-[#1A1A1A] outline-none transition-all placeholder:text-gray-400 focus:border-[#2563EB] focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-50 ${
                                    errors.address
                                        ? "border-red-400"
                                        : "border-gray-300"
                                }`}
                            />

                            {errors.address && (
                                <p className="mt-1.5 text-xs font-medium text-red-500">
                                    {errors.address}
                                </p>
                            )}
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={() => navigate("/profile")}
                                disabled={loading}
                                className="rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-[#1A1A1A] transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <Save size={17} />
                                {loading
                                    ? "Saving..."
                                    : "Save Changes"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

/* ==========================================
   Input Field
========================================== */

function InputField({
    label,
    name,
    type = "text",
    value,
    onChange,
    error,
    helper,
    required = false,
    disabled = false,
    maxLength,
}) {
    return (
        <div>
            <label
                htmlFor={name}
                className="mb-2 block text-sm font-semibold text-[#1A1A1A]"
            >
                {label}{" "}
                {required && (
                    <span className="text-red-500">*</span>
                )}
            </label>

            <input
                id={name}
                name={name}
                type={type}
                value={value || ""}
                onChange={onChange}
                disabled={disabled}
                maxLength={maxLength}
                className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-[#1A1A1A] outline-none transition-all placeholder:text-gray-400 focus:border-[#2563EB] focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 ${
                    error
                        ? "border-red-400"
                        : "border-gray-300"
                }`}
            />

            {error && (
                <p className="mt-1.5 text-xs font-medium text-red-500">
                    {error}
                </p>
            )}

            {helper && !error && (
                <p className="mt-1.5 text-xs text-[#6C757D]">
                    {helper}
                </p>
            )}
        </div>
    );
}

/* ==========================================
   Image URL Helper
========================================== */

function getImageUrl(image) {
    if (!image) return null;

    if (
        image.startsWith("http://") ||
        image.startsWith("https://")
    ) {
        return image;
    }

    const baseUrl =
        import.meta.env.VITE_MEDIA_BASE_URL ||
        "http://127.0.0.1:8000";

    return `${baseUrl}${image.startsWith("/") ? image : `/${image}`}`;
}

export default ProfileForm;