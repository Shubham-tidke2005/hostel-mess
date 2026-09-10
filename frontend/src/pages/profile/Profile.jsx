import { useCallback, useEffect, useState } from "react";
import {
    RefreshCw,
    User,
} from "lucide-react";
import toast from "react-hot-toast";

import ProfileCard from "../../components/profile/ProfileCard";
import { getProfile } from "../../services/profileService";

function Profile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    // ==========================================
    // Fetch Profile
    // ==========================================
    const fetchProfile = useCallback(async (showRefresh = false) => {
        try {
            if (showRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError("");

            const data = await getProfile();

            setProfile(data);
        } catch (err) {
            console.error("Profile Error:", err);

            const message =
                err?.response?.data?.detail ||
                err?.response?.data?.message ||
                "Unable to load profile.";

            setError(message);

            if (showRefresh) {
                toast.error(message);
            }
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    // ==========================================
    // Loading
    // ==========================================
    if (loading) {
        return (
            <div className="space-y-8">
                <div className="animate-pulse">
                    <div className="h-9 w-40 rounded-lg bg-gray-200" />
                    <div className="mt-3 h-4 w-72 rounded bg-gray-200" />
                </div>

                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                    <div className="h-32 animate-pulse bg-gray-200" />

                    <div className="px-5 pb-8 sm:px-8">
                        <div className="-mt-16 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                            <div className="flex items-end gap-4">
                                <div className="h-32 w-32 rounded-2xl bg-gray-200" />

                                <div className="pb-2">
                                    <div className="h-7 w-48 rounded bg-gray-200" />
                                    <div className="mt-2 h-4 w-32 rounded bg-gray-200" />
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <div className="h-11 w-32 rounded-xl bg-gray-200" />
                                <div className="h-11 w-40 rounded-xl bg-gray-200" />
                            </div>
                        </div>

                        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {[1, 2, 3, 4, 5, 6].map((item) => (
                                <div
                                    key={item}
                                    className="h-20 rounded-xl bg-gray-100"
                                />
                            ))}
                        </div>
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
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                        <User size={26} />
                    </div>

                    <h2 className="mt-5 text-xl font-bold text-[#1A1A1A]">
                        Unable to load profile
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-[#6C757D]">
                        {error || "Profile information is not available."}
                    </p>

                    <button
                        type="button"
                        onClick={() => fetchProfile(true)}
                        disabled={refreshing}
                        className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <RefreshCw
                            size={17}
                            className={
                                refreshing ? "animate-spin" : ""
                            }
                        />
                        {refreshing ? "Retrying..." : "Try Again"}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* ==================================
                Header
            ================================== */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[#1A1A1A] sm:text-4xl">
                        My Profile
                    </h1>

                    <p className="mt-2 text-sm text-[#6C757D]">
                        View and manage your account information.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => fetchProfile(true)}
                    disabled={refreshing}
                    className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-[#1A1A1A] transition-all hover:border-[#2563EB] hover:text-[#2563EB] disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto"
                >
                    <RefreshCw
                        size={16}
                        className={
                            refreshing ? "animate-spin" : ""
                        }
                    />
                    Refresh
                </button>
            </div>

            {/* ==================================
                Profile Card
            ================================== */}
            <ProfileCard profile={profile} />
        </div>
    );
}

export default Profile;