import { useEffect, useState } from "react";
import { ArrowLeft, Save, Utensils } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const EMPTY_FORM = {
    menu_date: "",
    breakfast: "",
    lunch: "",
    dinner: "",
};

function MenuForm({ initialData = null, onSubmit, loading = false }) {
    const navigate = useNavigate();

    const [formData, setFormData] = useState(EMPTY_FORM);
    const [errors, setErrors] = useState({});

    // Load existing menu data while editing
    useEffect(() => {
        if (!initialData) {
            setFormData(EMPTY_FORM);
            return;
        }

        setFormData({
            menu_date: initialData.menu_date || "",
            breakfast: initialData.breakfast || "",
            lunch: initialData.lunch || "",
            dinner: initialData.dinner || "",
        });

        setErrors({});
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Clear field error when user edits
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.menu_date.trim()) {
            newErrors.menu_date = "Menu date is required.";
        }

        if (!formData.breakfast.trim()) {
            newErrors.breakfast = "Breakfast is required.";
        }

        if (!formData.lunch.trim()) {
            newErrors.lunch = "Lunch is required.";
        }

        if (!formData.dinner.trim()) {
            newErrors.dinner = "Dinner is required.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error("Please fix the errors before submitting.");
            return;
        }

        try {
            await onSubmit({
                menu_date: formData.menu_date,
                breakfast: formData.breakfast.trim(),
                lunch: formData.lunch.trim(),
                dinner: formData.dinner.trim(),
            });
        } catch (error) {
            // Allow parent component to handle API errors.
            // If parent does not catch the error, show a generic message.
            console.error("Menu form submission error:", error);
            toast.error("Failed to save menu.");
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA]">
            <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">

                {/* Header */}
                <div className="mb-8">
                    <button
                        type="button"
                        onClick={() => navigate("/mess")}
                        className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-[#6C757D] transition-colors hover:text-[#2563EB]"
                    >
                        <ArrowLeft size={18} />
                        Back to Mess Menu
                    </button>

                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[#2563EB]">
                            <Utensils size={24} />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold text-[#1A1A1A] sm:text-3xl">
                                {initialData ? "Edit Mess Menu" : "Add Mess Menu"}
                            </h1>

                            <p className="mt-1 text-sm text-[#6C757D]">
                                {initialData
                                    ? "Update the meals for this date."
                                    : "Create a daily breakfast, lunch, and dinner menu."}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form Card */}
                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
                    <form onSubmit={handleSubmit} className="space-y-7">

                        {/* Menu Date */}
                        <div>
                            <label
                                htmlFor="menu_date"
                                className="mb-2 block text-sm font-semibold text-[#1A1A1A]"
                            >
                                Menu Date <span className="text-red-500">*</span>
                            </label>

                            <input
                                id="menu_date"
                                name="menu_date"
                                type="date"
                                value={formData.menu_date}
                                onChange={handleChange}
                                disabled={loading}
                                className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-[#1A1A1A] outline-none transition-all placeholder:text-gray-400 focus:border-[#2563EB] focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-50 ${
                                    errors.menu_date
                                        ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                                        : "border-gray-300"
                                }`}
                            />

                            {errors.menu_date && (
                                <p className="mt-1.5 text-xs font-medium text-red-500">
                                    {errors.menu_date}
                                </p>
                            )}
                        </div>

                        {/* Meals */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

                            {/* Breakfast */}
                            <div>
                                <label
                                    htmlFor="breakfast"
                                    className="mb-2 block text-sm font-semibold text-[#1A1A1A]"
                                >
                                    Breakfast <span className="text-red-500">*</span>
                                </label>

                                <textarea
                                    id="breakfast"
                                    name="breakfast"
                                    rows={5}
                                    maxLength={500}
                                    value={formData.breakfast}
                                    onChange={handleChange}
                                    disabled={loading}
                                    placeholder="e.g. Poha, Tea, Banana"
                                    className={`w-full resize-none rounded-xl border bg-white px-4 py-3 text-sm text-[#1A1A1A] outline-none transition-all placeholder:text-gray-400 focus:border-[#2563EB] focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-50 ${
                                        errors.breakfast
                                            ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                                            : "border-gray-300"
                                    }`}
                                />

                                <div className="mt-1.5 flex items-center justify-between">
                                    {errors.breakfast ? (
                                        <p className="text-xs font-medium text-red-500">
                                            {errors.breakfast}
                                        </p>
                                    ) : (
                                        <span />
                                    )}

                                    <span className="text-xs text-[#6C757D]">
                                        {formData.breakfast.length}/500
                                    </span>
                                </div>
                            </div>

                            {/* Lunch */}
                            <div>
                                <label
                                    htmlFor="lunch"
                                    className="mb-2 block text-sm font-semibold text-[#1A1A1A]"
                                >
                                    Lunch <span className="text-red-500">*</span>
                                </label>

                                <textarea
                                    id="lunch"
                                    name="lunch"
                                    rows={5}
                                    maxLength={500}
                                    value={formData.lunch}
                                    onChange={handleChange}
                                    disabled={loading}
                                    placeholder="e.g. Rice, Dal, Roti, Sabzi"
                                    className={`w-full resize-none rounded-xl border bg-white px-4 py-3 text-sm text-[#1A1A1A] outline-none transition-all placeholder:text-gray-400 focus:border-[#2563EB] focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-50 ${
                                        errors.lunch
                                            ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                                            : "border-gray-300"
                                    }`}
                                />

                                <div className="mt-1.5 flex items-center justify-between">
                                    {errors.lunch ? (
                                        <p className="text-xs font-medium text-red-500">
                                            {errors.lunch}
                                        </p>
                                    ) : (
                                        <span />
                                    )}

                                    <span className="text-xs text-[#6C757D]">
                                        {formData.lunch.length}/500
                                    </span>
                                </div>
                            </div>

                            {/* Dinner */}
                            <div>
                                <label
                                    htmlFor="dinner"
                                    className="mb-2 block text-sm font-semibold text-[#1A1A1A]"
                                >
                                    Dinner <span className="text-red-500">*</span>
                                </label>

                                <textarea
                                    id="dinner"
                                    name="dinner"
                                    rows={5}
                                    maxLength={500}
                                    value={formData.dinner}
                                    onChange={handleChange}
                                    disabled={loading}
                                    placeholder="e.g. Chapati, Paneer, Salad"
                                    className={`w-full resize-none rounded-xl border bg-white px-4 py-3 text-sm text-[#1A1A1A] outline-none transition-all placeholder:text-gray-400 focus:border-[#2563EB] focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-50 ${
                                        errors.dinner
                                            ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                                            : "border-gray-300"
                                    }`}
                                />

                                <div className="mt-1.5 flex items-center justify-between">
                                    {errors.dinner ? (
                                        <p className="text-xs font-medium text-red-500">
                                            {errors.dinner}
                                        </p>
                                    ) : (
                                        <span />
                                    )}

                                    <span className="text-xs text-[#6C757D]">
                                        {formData.dinner.length}/500
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Info */}
                        <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
                            <p className="text-sm text-blue-800">
                                <span className="font-semibold">Note:</span>{" "}
                                Only one mess menu can be created for each date.
                            </p>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">

                            <button
                                type="button"
                                onClick={() => navigate("/mess")}
                                disabled={loading}
                                className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-[#1A1A1A] transition-all hover:border-gray-400 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <Save size={18} />

                                {loading
                                    ? "Saving..."
                                    : initialData
                                    ? "Update Menu"
                                    : "Save Menu"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default MenuForm;