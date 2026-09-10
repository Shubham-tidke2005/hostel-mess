import { useState } from "react";
import {
    ArrowLeft,
    Eye,
    EyeOff,
    KeyRound,
    LockKeyhole,
    Save,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function ChangePasswordForm({
    onSubmit,
    loading = false,
}) {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        current_password: "",
        new_password: "",
        confirm_password: "",
    });

    const [errors, setErrors] = useState({});
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    // ==========================================
    // Handle input
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

        if (
            name === "new_password" ||
            name === "confirm_password"
        ) {
            setErrors((prev) => ({
                ...prev,
                confirm_password: "",
            }));
        }
    };

    // ==========================================
    // Validation
    // ==========================================
    const validateForm = () => {
        const newErrors = {};

        if (!formData.current_password) {
            newErrors.current_password =
                "Current password is required.";
        }

        if (!formData.new_password) {
            newErrors.new_password =
                "New password is required.";
        } else if (formData.new_password.length < 8) {
            newErrors.new_password =
                "Password must contain at least 8 characters.";
        }

        if (!formData.confirm_password) {
            newErrors.confirm_password =
                "Please confirm your new password.";
        } else if (
            formData.new_password !==
            formData.confirm_password
        ) {
            newErrors.confirm_password =
                "Passwords do not match.";
        }

        if (
            formData.current_password &&
            formData.new_password &&
            formData.current_password === formData.new_password
        ) {
            newErrors.new_password =
                "New password must be different from the current password.";
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
                current_password:
                    formData.current_password,
                new_password: formData.new_password,
            });
        } catch (error) {
            console.error(
                "Change password error:",
                error
            );
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA]">
            <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">

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
                            <KeyRound size={24} />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold text-[#1A1A1A] sm:text-3xl">
                                Change Password
                            </h1>

                            <p className="mt-1 text-sm text-[#6C757D]">
                                Keep your account secure with a strong password.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form Card */}
                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">

                    {/* Security Info */}
                    <div className="mb-7 flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
                        <LockKeyhole
                            size={19}
                            className="mt-0.5 shrink-0 text-[#2563EB]"
                        />

                        <div>
                            <p className="text-sm font-semibold text-blue-900">
                                Password requirements
                            </p>

                            <p className="mt-1 text-xs leading-5 text-blue-800">
                                Use at least 8 characters and choose a
                                password that you do not use elsewhere.
                            </p>
                        </div>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >
                        {/* Current Password */}
                        <PasswordField
                            label="Current Password"
                            name="current_password"
                            value={formData.current_password}
                            onChange={handleChange}
                            error={errors.current_password}
                            showPassword={showCurrent}
                            setShowPassword={setShowCurrent}
                            disabled={loading}
                        />

                        {/* New Password */}
                        <PasswordField
                            label="New Password"
                            name="new_password"
                            value={formData.new_password}
                            onChange={handleChange}
                            error={errors.new_password}
                            showPassword={showNew}
                            setShowPassword={setShowNew}
                            disabled={loading}
                        />

                        {/* Confirm Password */}
                        <PasswordField
                            label="Confirm New Password"
                            name="confirm_password"
                            value={formData.confirm_password}
                            onChange={handleChange}
                            error={errors.confirm_password}
                            showPassword={showConfirm}
                            setShowPassword={setShowConfirm}
                            disabled={loading}
                        />

                        {/* Buttons */}
                        <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={() =>
                                    navigate("/profile")
                                }
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
                                    ? "Updating..."
                                    : "Change Password"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

/* ==========================================
   Password Field
========================================== */

function PasswordField({
    label,
    name,
    value,
    onChange,
    error,
    showPassword,
    setShowPassword,
    disabled,
}) {
    return (
        <div>
            <label
                htmlFor={name}
                className="mb-2 block text-sm font-semibold text-[#1A1A1A]"
            >
                {label}
            </label>

            <div className="relative">
                <input
                    id={name}
                    name={name}
                    type={showPassword ? "text" : "password"}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    autoComplete="current-password"
                    className={`w-full rounded-xl border bg-white px-4 py-3 pr-12 text-sm text-[#1A1A1A] outline-none transition-all placeholder:text-gray-400 focus:border-[#2563EB] focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-50 ${
                        error
                            ? "border-red-400"
                            : "border-gray-300"
                    }`}
                    placeholder={`Enter ${label.toLowerCase()}`}
                />

                <button
                    type="button"
                    onClick={() =>
                        setShowPassword((prev) => !prev)
                    }
                    disabled={disabled}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed"
                    aria-label={
                        showPassword
                            ? "Hide password"
                            : "Show password"
                    }
                >
                    {showPassword ? (
                        <EyeOff size={18} />
                    ) : (
                        <Eye size={18} />
                    )}
                </button>
            </div>

            {error && (
                <p className="mt-1.5 text-xs font-medium text-red-500">
                    {error}
                </p>
            )}
        </div>
    );
}

export default ChangePasswordForm;