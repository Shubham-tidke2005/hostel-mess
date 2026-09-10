import { useEffect, useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";

const EMPTY_FORM = {
    hostel_name: "",
    hostel_type: "",
    address: "",
    total_rooms: "",
};

function HostelForm({
    initialData = null,
    onSubmit,
    submitting = false,
    submitLabel = "Save Hostel",
}) {
    const [formData, setFormData] = useState(EMPTY_FORM);

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [errors, setErrors] = useState({});

    const fileInputRef = useRef(null);

    useEffect(() => {
        if (!initialData) {
            setFormData(EMPTY_FORM);
            setImageFile(null);
            setImagePreview("");
            setErrors({});
            return;
        }

        setFormData({
            hostel_name: initialData.hostel_name || "",
            hostel_type: initialData.hostel_type || "",
            address: initialData.address || "",
            total_rooms: initialData.total_rooms ?? "",
        });

        setImageFile(null);

        if (initialData.hostel_image) {
            setImagePreview(initialData.hostel_image);
        } else {
            setImagePreview("");
        }

        setErrors({});
    }, [initialData]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    const handleImageChange = (event) => {
        const file = event.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setErrors((prev) => ({
                ...prev,
                hostel_image: "Please select a valid image file.",
            }));
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setErrors((prev) => ({
                ...prev,
                hostel_image: "Image size must be less than 5 MB.",
            }));
            return;
        }

        setImageFile(file);

        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);

        setErrors((prev) => ({
            ...prev,
            hostel_image: "",
        }));
    };

    const removeImage = () => {
        setImageFile(null);

        if (initialData?.hostel_image) {
            setImagePreview(initialData.hostel_image);
        } else {
            setImagePreview("");
        }

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.hostel_name.trim()) {
            newErrors.hostel_name = "Hostel name is required.";
        } else if (formData.hostel_name.trim().length < 2) {
            newErrors.hostel_name =
                "Hostel name must contain at least 2 characters.";
        }

        if (!formData.hostel_type) {
            newErrors.hostel_type = "Please select hostel type.";
        }

        if (!formData.address.trim()) {
            newErrors.address = "Address is required.";
        }

        if (
            formData.total_rooms === "" ||
            Number.isNaN(Number(formData.total_rooms))
        ) {
            newErrors.total_rooms = "Total rooms is required.";
        } else if (Number(formData.total_rooms) <= 0) {
            newErrors.total_rooms = "Total rooms must be greater than 0.";
        } else if (!Number.isInteger(Number(formData.total_rooms))) {
            newErrors.total_rooms = "Total rooms must be a whole number.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validate()) return;

        const data = new FormData();

        data.append("hostel_name", formData.hostel_name.trim());
        data.append("hostel_type", formData.hostel_type);
        data.append("address", formData.address.trim());
        data.append("total_rooms", formData.total_rooms);

        if (imageFile) {
            data.append("hostel_image", imageFile);
        }

        await onSubmit(data);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6"
            encType="multipart/form-data"
        >
            {/* Hostel Name */}
            <div>
                <label
                    htmlFor="hostel_name"
                    className="mb-2 block text-sm font-medium text-[#1A1A1A]"
                >
                    Hostel Name
                </label>

                <input
                    id="hostel_name"
                    name="hostel_name"
                    type="text"
                    value={formData.hostel_name}
                    onChange={handleChange}
                    placeholder="Enter hostel name"
                    disabled={submitting}
                    className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-[#1A1A1A] outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                        errors.hostel_name
                            ? "border-red-400 focus:ring-red-100"
                            : "border-slate-200 focus:border-[#2563EB] focus:ring-blue-100"
                    }`}
                />

                {errors.hostel_name && (
                    <p className="mt-1.5 text-sm text-red-600">
                        {errors.hostel_name}
                    </p>
                )}
            </div>

            {/* Hostel Type */}
            <div>
                <label
                    htmlFor="hostel_type"
                    className="mb-2 block text-sm font-medium text-[#1A1A1A]"
                >
                    Hostel Type
                </label>

                <select
                    id="hostel_type"
                    name="hostel_type"
                    value={formData.hostel_type}
                    onChange={handleChange}
                    disabled={submitting}
                    className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-[#1A1A1A] outline-none transition focus:ring-2 ${
                        errors.hostel_type
                            ? "border-red-400 focus:ring-red-100"
                            : "border-slate-200 focus:border-[#2563EB] focus:ring-blue-100"
                    }`}
                >
                    <option value="">Select hostel type</option>
                    <option value="Boys">Boys</option>
                    <option value="Girls">Girls</option>
                    <option value="Other">Other</option>
                </select>

                {errors.hostel_type && (
                    <p className="mt-1.5 text-sm text-red-600">
                        {errors.hostel_type}
                    </p>
                )}
            </div>

            {/* Address */}
            <div>
                <label
                    htmlFor="address"
                    className="mb-2 block text-sm font-medium text-[#1A1A1A]"
                >
                    Address
                </label>

                <textarea
                    id="address"
                    name="address"
                    rows={4}
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter hostel address"
                    disabled={submitting}
                    className={`w-full resize-none rounded-xl border bg-white px-4 py-3 text-sm text-[#1A1A1A] outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                        errors.address
                            ? "border-red-400 focus:ring-red-100"
                            : "border-slate-200 focus:border-[#2563EB] focus:ring-blue-100"
                    }`}
                />

                {errors.address && (
                    <p className="mt-1.5 text-sm text-red-600">
                        {errors.address}
                    </p>
                )}
            </div>

            {/* Total Rooms */}
            <div>
                <label
                    htmlFor="total_rooms"
                    className="mb-2 block text-sm font-medium text-[#1A1A1A]"
                >
                    Total Rooms
                </label>

                <input
                    id="total_rooms"
                    name="total_rooms"
                    type="number"
                    min="1"
                    step="1"
                    value={formData.total_rooms}
                    onChange={handleChange}
                    placeholder="Enter total rooms"
                    disabled={submitting}
                    className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-[#1A1A1A] outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                        errors.total_rooms
                            ? "border-red-400 focus:ring-red-100"
                            : "border-slate-200 focus:border-[#2563EB] focus:ring-blue-100"
                    }`}
                />

                {errors.total_rooms && (
                    <p className="mt-1.5 text-sm text-red-600">
                        {errors.total_rooms}
                    </p>
                )}
            </div>

            {/* Hostel Image */}
            <div>
                <label className="mb-2 block text-sm font-medium text-[#1A1A1A]">
                    Hostel Image
                </label>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={submitting}
                    className="hidden"
                />

                {!imagePreview ? (
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={submitting}
                        className="flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center transition hover:border-[#2563EB] hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <ImagePlus className="mb-3 h-9 w-9 text-slate-400" />

                        <span className="text-sm font-medium text-[#1A1A1A]">
                            Upload hostel image
                        </span>

                        <span className="mt-1 text-xs text-[#6C757D]">
                            PNG, JPG, JPEG up to 5 MB
                        </span>
                    </button>
                ) : (
                    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                        <img
                            src={imagePreview}
                            alt="Hostel preview"
                            className="h-64 w-full object-cover"
                        />

                        <button
                            type="button"
                            onClick={removeImage}
                            disabled={submitting}
                            className="absolute right-3 top-3 rounded-full bg-white p-2 text-[#1A1A1A] shadow-md transition hover:bg-red-50 hover:text-red-600 disabled:opacity-60"
                            aria-label="Remove hostel image"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                )}

                {errors.hostel_image && (
                    <p className="mt-1.5 text-sm text-red-600">
                        {errors.hostel_image}
                    </p>
                )}
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                    type="button"
                    onClick={() => window.history.back()}
                    disabled={submitting}
                    className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-[#1A1A1A] transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {submitting ? "Saving..." : submitLabel}
                </button>
            </div>
        </form>
    );
}

export default HostelForm;