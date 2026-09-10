import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import ProfileForm from "../../components/profile/ProfileForm";
import {
    getProfile,
    updateProfile,
} from "../../services/profileService";

function EditProfile() {
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    // ==========================================
    // Fetch Profile
    // ==========================================
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getProfile();

                setProfile(data);
            } catch (err) {
                console.error("Edit Profile Error:", err);

                const message =
                    err?.response?.data?.detail ||
                    err?.response?.data?.message ||
                    "Unable to load profile.";

                setError(message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    // ==========================================
    // Update Profile
    // ==========================================
    const handleSubmit = async (profileData) => {
        try {
            setSaving(true);

            const updatedProfile =
                await updateProfile(profileData);

            setProfile(updatedProfile);

            toast.success("Profile updated successfully.");

            navigate("/profile");
        } catch (err) {
            console.error("Update Profile Error:", err);

            const responseData = err?.response?.data;

            if (
                responseData &&
                typeof responseData === "object"
            ) {
                if (responseData.detail) {
                    toast.error(responseData.detail);
                } else {
                    const firstError =
                        Object.values(responseData)[0];

                    toast.error(
                        Array.isArray(firstError)
                            ? firstError[0]
                            : String(firstError)
                    );
                }
            } else {
                toast.error("Failed to update profile.");
            }

            throw err;
        } finally {
            setSaving(false);
        }
    };

    // ==========================================
    // Loading
    // ==========================================
    if (loading) {
        return (
            <div className="min-h-[600px]">
                <div className="animate-pulse">
                    <div className="h-4 w-36 rounded bg-gray-200" />

                    <div className="mt-5 flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-gray-200" />

                        <div>
                            <div className="h-8 w-48 rounded bg-gray-200" />
                            <div className="mt-3 h-4 w-72 rounded bg-gray-200" />
                        </div>
                    </div>
                </div>

                <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                    <div className="animate-pulse space-y-7">
                        <div className="h-28 rounded-xl bg-gray-100" />

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            {[1, 2, 3, 4, 5, 6].map((item) => (
                                <div
                                    key={item}
                                    className="h-20 rounded-xl bg-gray-100"
                                />
                            ))}
                        </div>

                        <div className="h-28 rounded-xl bg-gray-100" />
                    </div>
                </div>
            </div>
        );
    }

    // ==========================================
    // Error
    // ==========================================
    if (error || !profile) {
        return (
            <div className="flex min-h-[500px] items-center justify-center">
                <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
                    <h2 className="text-xl font-bold text-[#1A1A1A]">
                        Unable to load profile
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-[#6C757D]">
                        {error || "Profile information is unavailable."}
                    </p>

                    <button
                        type="button"
                        onClick={() => navigate("/profile")}
                        className="mt-6 rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                    >
                        Back to Profile
                    </button>
                </div>
            </div>
        );
    }

    return (
        <ProfileForm
            initialData={profile}
            onSubmit={handleSubmit}
            loading={saving}
        />
    );
}

export default EditProfile;