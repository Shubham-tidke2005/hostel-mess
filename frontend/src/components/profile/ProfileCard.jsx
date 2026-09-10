import {
    User,
    Mail,
    Phone,
    GraduationCap,
    MapPin,
    CalendarDays,
    Edit,
    KeyRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function ProfileCard({ profile }) {
    const navigate = useNavigate();

    if (!profile) {
        return null;
    }

    const getImageUrl = (image) => {
        if (!image) return null;

        if (image.startsWith("http://") || image.startsWith("https://")) {
            return image;
        }

        const baseUrl =
            import.meta.env.VITE_MEDIA_BASE_URL || "http://127.0.0.1:8000";

        return `${baseUrl}${image.startsWith("/") ? image : `/${image}`}`;
    };

    const profileImage = getImageUrl(profile.profile_image);

    const name =
        profile.full_name ||
        profile.name ||
        profile.user?.full_name ||
        "Student";

    const email =
        profile.email ||
        profile.user_email ||
        profile.user?.email ||
        "Not available";

    const initials = name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0])
        .join("")
        .toUpperCase();

    return (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            {/* Header */}
            <div className="h-32 bg-gradient-to-r from-blue-600 to-blue-700" />

            {/* Profile Content */}
            <div className="px-5 pb-6 sm:px-8">
                <div className="-mt-16 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                    {/* Profile Image + Name */}
                    <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end">
                        <div className="flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-blue-50 text-3xl font-bold text-[#2563EB] shadow-md">
                            {profileImage ? (
                                <img
                                    src={profileImage}
                                    alt={name}
                                    className="h-full w-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.style.display =
                                            "none";
                                    }}
                                />
                            ) : (
                                initials
                            )}
                        </div>

                        <div className="pb-1">
                            <h1 className="text-2xl font-bold text-[#1A1A1A]">
                                {name}
                            </h1>

                            <p className="mt-1 text-sm text-[#6C757D]">
                                {profile.department ||
                                    "Computer Engineering"}
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                        <button
                            type="button"
                            onClick={() => navigate("/profile/edit")}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-md"
                        >
                            <Edit size={17} />
                            Edit Profile
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/profile/change-password")
                            }
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-[#1A1A1A] transition-all hover:border-[#2563EB] hover:text-[#2563EB]"
                        >
                            <KeyRound size={17} />
                            Change Password
                        </button>
                    </div>
                </div>

                {/* Information */}
                <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <InfoItem
                        icon={<Mail size={18} />}
                        label="Email"
                        value={email}
                    />

                    <InfoItem
                        icon={<GraduationCap size={18} />}
                        label="Roll Number"
                        value={profile.roll_no}
                    />

                    <InfoItem
                        icon={<Phone size={18} />}
                        label="Phone"
                        value={profile.phone}
                    />

                    <InfoItem
                        icon={<GraduationCap size={18} />}
                        label="Department"
                        value={profile.department}
                    />

                    <InfoItem
                        icon={<CalendarDays size={18} />}
                        label="Year"
                        value={
                            profile.year
                                ? `Year ${profile.year}`
                                : null
                        }
                    />

                    <InfoItem
                        icon={<MapPin size={18} />}
                        label="Address"
                        value={profile.address}
                    />
                </div>
            </div>
        </div>
    );
}

/* ==========================================
   Information Item
========================================== */

function InfoItem({ icon, label, value }) {
    return (
        <div className="flex items-start gap-3 rounded-xl border border-gray-100 bg-[#F8F9FA] p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#2563EB] shadow-sm">
                {icon}
            </div>

            <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#6C757D]">
                    {label}
                </p>

                <p className="mt-1 break-words text-sm font-medium text-[#1A1A1A]">
                    {value || "Not available"}
                </p>
            </div>
        </div>
    );
}

export default ProfileCard;