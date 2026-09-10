import { useEffect, useState } from "react";
import {
    ImagePlus,
    Loader2,
    X,
} from "lucide-react";

function StudentForm({
    initialData = {},
    onSubmit,
    submitting = false,
    submitLabel = "Save Student",
}) {
    const [formData, setFormData] = useState({
        roll_no: "",
        full_name: "",
        gender: "",
        phone: "",
        department: "",
        year: "",
        address: "",
    });

    const [profileImage, setProfileImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [existingImage, setExistingImage] = useState(null);
    const [errors, setErrors] = useState({});

    /*
    |--------------------------------------------------------------------------
    | Load Existing Student Data
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        if (!initialData || Object.keys(initialData).length === 0) {
            return;
        }

        setFormData({
            roll_no: initialData.roll_no || "",
            full_name: initialData.full_name || "",
            gender: initialData.gender || "",
            phone: initialData.phone || "",
            department: initialData.department || "",
            year: initialData.year
                ? String(initialData.year)
                : "",
            address: initialData.address || "",
        });

        /*
        |--------------------------------------------------------------------------
        | Existing Profile Image
        |--------------------------------------------------------------------------
        */

        if (initialData.profile_image) {
            const imageUrl = getMediaUrl(
                initialData.profile_image
            );

            setExistingImage(imageUrl);
            setImagePreview(imageUrl);
        } else {
            setExistingImage(null);
            setImagePreview(null);
        }
    }, [initialData]);

    /*
    |--------------------------------------------------------------------------
    | Input Change
    |--------------------------------------------------------------------------
    */

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        /*
        |--------------------------------------------------------------------------
        | Remove Field Error While Typing
        |--------------------------------------------------------------------------
        */

        if (errors[name]) {
            setErrors((previous) => ({
                ...previous,
                [name]: "",
            }));
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Profile Image Change
    |--------------------------------------------------------------------------
    */

    const handleImageChange = (event) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        /*
        |--------------------------------------------------------------------------
        | Validate File Type
        |--------------------------------------------------------------------------
        */

        if (!file.type.startsWith("image/")) {
            setErrors((previous) => ({
                ...previous,
                profile_image:
                    "Please select a valid image file.",
            }));

            event.target.value = "";
            return;
        }

        /*
        |--------------------------------------------------------------------------
        | Validate File Size - 5 MB
        |--------------------------------------------------------------------------
        */

        const maxSize = 5 * 1024 * 1024;

        if (file.size > maxSize) {
            setErrors((previous) => ({
                ...previous,
                profile_image:
                    "Image size must be less than 5 MB.",
            }));

            event.target.value = "";
            return;
        }

        /*
        |--------------------------------------------------------------------------
        | Save Selected Image
        |--------------------------------------------------------------------------
        */

        setProfileImage(file);

        /*
        |--------------------------------------------------------------------------
        | Create Preview
        |--------------------------------------------------------------------------
        */

        const previewUrl = URL.createObjectURL(file);

        setImagePreview(previewUrl);

        setErrors((previous) => ({
            ...previous,
            profile_image: "",
        }));
    };

    /*
    |--------------------------------------------------------------------------
    | Remove Selected Image
    |--------------------------------------------------------------------------
    */

    const removeImage = () => {
        setProfileImage(null);

        /*
        |--------------------------------------------------------------------------
        | Restore Existing Image During Edit
        |--------------------------------------------------------------------------
        */

        setImagePreview(existingImage);

        const input = document.getElementById(
            "profile_image"
        );

        if (input) {
            input.value = "";
        }

        setErrors((previous) => ({
            ...previous,
            profile_image: "",
        }));
    };

    /*
    |--------------------------------------------------------------------------
    | Form Validation
    |--------------------------------------------------------------------------
    */

    const validate = () => {
        const newErrors = {};

        /*
        |--------------------------------------------------------------------------
        | Roll Number
        |--------------------------------------------------------------------------
        */

        if (!formData.roll_no.trim()) {
            newErrors.roll_no =
                "Roll number is required.";
        }

        /*
        |--------------------------------------------------------------------------
        | Full Name
        |--------------------------------------------------------------------------
        */

        if (!formData.full_name.trim()) {
            newErrors.full_name =
                "Full name is required.";
        }

        /*
        |--------------------------------------------------------------------------
        | Gender
        |--------------------------------------------------------------------------
        */

        if (!formData.gender) {
            newErrors.gender =
                "Gender is required.";
        }

        /*
        |--------------------------------------------------------------------------
        | Phone
        |--------------------------------------------------------------------------
        */

        if (!formData.phone.trim()) {
            newErrors.phone =
                "Phone number is required.";
        } else if (
            !/^\d{10}$/.test(formData.phone.trim())
        ) {
            newErrors.phone =
                "Phone number must contain exactly 10 digits.";
        }

        /*
        |--------------------------------------------------------------------------
        | Department
        |--------------------------------------------------------------------------
        */

        if (!formData.department.trim()) {
            newErrors.department =
                "Department is required.";
        }

        /*
        |--------------------------------------------------------------------------
        | Year
        |--------------------------------------------------------------------------
        */

        if (!formData.year) {
            newErrors.year =
                "Year is required.";
        }

        /*
        |--------------------------------------------------------------------------
        | Address
        |--------------------------------------------------------------------------
        */

        // Address is optional.
        // No validation required.

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    /*
    |--------------------------------------------------------------------------
    | Form Submit
    |--------------------------------------------------------------------------
    */

    const handleSubmit = async (event) => {
        event.preventDefault();

        /*
        |--------------------------------------------------------------------------
        | Validate Form
        |--------------------------------------------------------------------------
        */

        if (!validate()) {
            return;
        }

        /*
        |--------------------------------------------------------------------------
        | Create FormData
        |--------------------------------------------------------------------------
        */

        const data = new FormData();

        data.append(
            "roll_no",
            formData.roll_no.trim()
        );

        data.append(
            "full_name",
            formData.full_name.trim()
        );

        data.append(
            "gender",
            formData.gender
        );

        data.append(
            "phone",
            formData.phone.trim()
        );

        data.append(
            "department",
            formData.department.trim()
        );

        data.append(
            "year",
            Number(formData.year)
        );

        data.append(
            "address",
            formData.address.trim()
        );

        /*
        |--------------------------------------------------------------------------
        | Add New Image Only
        |--------------------------------------------------------------------------
        |
        | During edit:
        | - If user doesn't select a new image -> keep existing image.
        | - If user selects a new image -> send new image.
        |
        */

        if (profileImage) {
            data.append(
                "profile_image",
                profileImage
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Send Data To Parent
        |--------------------------------------------------------------------------
        */

        await onSubmit(data);
    };

    /*
    |--------------------------------------------------------------------------
    | JSX
    |--------------------------------------------------------------------------
    */

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6"
        >
            {/* ============================================================
                PERSONAL INFORMATION
            ============================================================ */}

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-[#1A1A1A]">
                        Personal Information
                    </h2>

                    <p className="mt-1 text-sm text-[#6C757D]">
                        Enter the student's basic information.
                    </p>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                    {/* Roll Number */}

                    <InputField
                        label="Roll Number"
                        name="roll_no"
                        value={formData.roll_no}
                        onChange={handleChange}
                        error={errors.roll_no}
                        placeholder="Enter roll number"
                        required
                    />

                    {/* Full Name */}

                    <InputField
                        label="Full Name"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        error={errors.full_name}
                        placeholder="Enter full name"
                        required
                    />

                    {/* Gender */}

                    <SelectField
                        label="Gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        error={errors.gender}
                        required
                        options={[
                            {
                                value: "Male",
                                label: "Male",
                            },
                            {
                                value: "Female",
                                label: "Female",
                            },
                            {
                                value: "Other",
                                label: "Other",
                            },
                        ]}
                    />

                    {/* Phone */}

                    <InputField
                        label="Phone Number"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        error={errors.phone}
                        placeholder="Enter 10-digit phone number"
                        type="tel"
                        maxLength={10}
                        required
                    />
                </div>
            </div>

            {/* ============================================================
                ACADEMIC INFORMATION
            ============================================================ */}

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-[#1A1A1A]">
                        Academic Information
                    </h2>

                    <p className="mt-1 text-sm text-[#6C757D]">
                        Enter the student's academic details.
                    </p>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                    {/* Department */}

                    <InputField
                        label="Department"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        error={errors.department}
                        placeholder="e.g. Computer Engineering"
                        required
                    />

                    {/* Year */}

                    <SelectField
                        label="Year"
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        error={errors.year}
                        required
                        options={[
                            {
                                value: "1",
                                label: "1st Year",
                            },
                            {
                                value: "2",
                                label: "2nd Year",
                            },
                            {
                                value: "3",
                                label: "3rd Year",
                            },
                            {
                                value: "4",
                                label: "4th Year",
                            },
                        ]}
                    />
                </div>
            </div>

            {/* ============================================================
                ADDRESS
            ============================================================ */}

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-[#1A1A1A]">
                        Address
                    </h2>

                    <p className="mt-1 text-sm text-[#6C757D]">
                        Enter the student's residential address.
                    </p>
                </div>

                <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Enter residential address"
                    className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm text-[#1A1A1A] outline-none transition placeholder:text-gray-400 focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
                />
            </div>

            {/* ============================================================
                PROFILE IMAGE
            ============================================================ */}

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-[#1A1A1A]">
                        Profile Image
                    </h2>

                    <p className="mt-1 text-sm text-[#6C757D]">
                        Upload a profile image. Maximum size:
                        {" "}
                        5 MB.
                    </p>
                </div>

                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                    {/* Image Preview */}

                    {imagePreview ? (
                        <div className="relative flex-shrink-0">
                            <img
                                src={imagePreview}
                                alt={
                                    formData.full_name ||
                                    "Student profile"
                                }
                                className="h-28 w-28 rounded-2xl border border-gray-200 object-cover shadow-sm"
                            />

                            {/* Remove New Image */}

                            {profileImage && (
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    disabled={submitting}
                                    title="Remove selected image"
                                    className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white shadow-sm transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <X size={15} />
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="flex h-28 w-28 flex-shrink-0 items-center justify-center rounded-2xl bg-gray-100">
                            <ImagePlus className="h-8 w-8 text-gray-400" />
                        </div>
                    )}

                    {/* File Upload */}

                    <div>
                        <label
                            htmlFor="profile_image"
                            className={`inline-flex cursor-pointer items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-[#1A1A1A] transition hover:border-[#2563EB] hover:text-[#2563EB] ${
                                submitting
                                    ? "pointer-events-none opacity-50"
                                    : ""
                            }`}
                        >
                            <ImagePlus size={18} />

                            {imagePreview
                                ? "Change Image"
                                : "Choose Image"}
                        </label>

                        <input
                            id="profile_image"
                            name="profile_image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            disabled={submitting}
                            className="hidden"
                        />

                        <p className="mt-2 text-xs text-[#6C757D]">
                            JPG, JPEG, PNG or other image formats.
                        </p>

                        {errors.profile_image && (
                            <p className="mt-2 text-sm text-red-500">
                                {errors.profile_image}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* ============================================================
                FORM ACTIONS
            ============================================================ */}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                {/* Cancel */}

                <button
                    type="button"
                    onClick={() => window.history.back()}
                    disabled={submitting}
                    className="rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-[#1A1A1A] transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Cancel
                </button>

                {/* Submit */}

                <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {submitting && (
                        <Loader2
                            size={18}
                            className="animate-spin"
                        />
                    )}

                    {submitting
                        ? "Saving..."
                        : submitLabel}
                </button>
            </div>
        </form>
    );
}

/*
|--------------------------------------------------------------------------
| Input Field
|--------------------------------------------------------------------------
*/

function InputField({
    label,
    name,
    value,
    onChange,
    error,
    placeholder = "",
    type = "text",
    required = false,
    maxLength,
}) {
    return (
        <div>
            <label
                htmlFor={name}
                className="mb-2 block text-sm font-medium text-[#1A1A1A]"
            >
                {label}

                {required && (
                    <span className="ml-1 text-red-500">
                        *
                    </span>
                )}
            </label>

            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                maxLength={maxLength}
                className={`w-full rounded-xl border px-4 py-3 text-sm text-[#1A1A1A] outline-none transition placeholder:text-gray-400 focus:ring-2 ${
                    error
                        ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                        : "border-gray-300 focus:border-[#2563EB] focus:ring-blue-100"
                }`}
            />

            {error && (
                <p className="mt-1.5 text-sm text-red-500">
                    {error}
                </p>
            )}
        </div>
    );
}

/*
|--------------------------------------------------------------------------
| Select Field
|--------------------------------------------------------------------------
*/

function SelectField({
    label,
    name,
    value,
    onChange,
    error,
    options,
    required = false,
}) {
    return (
        <div>
            <label
                htmlFor={name}
                className="mb-2 block text-sm font-medium text-[#1A1A1A]"
            >
                {label}

                {required && (
                    <span className="ml-1 text-red-500">
                        *
                    </span>
                )}
            </label>

            <select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-[#1A1A1A] outline-none transition focus:ring-2 ${
                    error
                        ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                        : "border-gray-300 focus:border-[#2563EB] focus:ring-blue-100"
                }`}
            >
                <option value="">
                    Select {label}
                </option>

                {options.map((option) => (
                    <option
                        key={option.value}
                        value={option.value}
                    >
                        {option.label}
                    </option>
                ))}
            </select>

            {error && (
                <p className="mt-1.5 text-sm text-red-500">
                    {error}
                </p>
            )}
        </div>
    );
}

/*
|--------------------------------------------------------------------------
| Media URL Helper
|--------------------------------------------------------------------------
*/

function getMediaUrl(image) {
    if (!image) {
        return null;
    }

    /*
    |--------------------------------------------------------------------------
    | Already Absolute URL
    |--------------------------------------------------------------------------
    */

    if (
        image.startsWith("http://") ||
        image.startsWith("https://")
    ) {
        return image;
    }

    /*
    |--------------------------------------------------------------------------
    | Backend Media URL
    |--------------------------------------------------------------------------
    */

    const baseUrl =
        import.meta.env.VITE_MEDIA_BASE_URL ||
        "http://127.0.0.1:8000";

    return `${baseUrl}${image}`;
}

export default StudentForm;

