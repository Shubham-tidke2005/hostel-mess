import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import MenuForm from "../../components/mess/MenuForm";
import { getMenu, updateMenu } from "../../services/messService";

function EditMenu() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [menu, setMenu] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    // -----------------------------
    // Fetch menu
    // -----------------------------
    useEffect(() => {
        const fetchMenu = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getMenu(id);

                setMenu(data);
            } catch (err) {
                console.error("Failed to fetch menu:", err);

                const message =
                    err?.response?.data?.detail ||
                    err?.response?.data?.message ||
                    "Failed to load mess menu.";

                setError(message);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchMenu();
        }
    }, [id]);

    // -----------------------------
    // Update menu
    // -----------------------------
    const handleSubmit = async (menuData) => {
        try {
            setSaving(true);

            await updateMenu(id, menuData);

            toast.success("Mess menu updated successfully.");

            navigate("/mess");
        } catch (err) {
            console.error("Failed to update menu:", err);

            const responseData = err?.response?.data;

            // Handle DRF validation errors
            if (responseData && typeof responseData === "object") {
                if (responseData.menu_date) {
                    toast.error(
                        Array.isArray(responseData.menu_date)
                            ? responseData.menu_date[0]
                            : responseData.menu_date
                    );
                } else if (responseData.detail) {
                    toast.error(responseData.detail);
                } else {
                    const firstError = Object.values(responseData)[0];

                    toast.error(
                        Array.isArray(firstError)
                            ? firstError[0]
                            : String(firstError)
                    );
                }
            } else {
                toast.error("Failed to update mess menu.");
            }

            // Re-throw so MenuForm can handle unexpected errors too.
            throw err;
        } finally {
            setSaving(false);
        }
    };

    // -----------------------------
    // Loading state
    // -----------------------------
    if (loading) {
        return (
            <div className="min-h-screen bg-[#F8F9FA]">
                <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
                    <div className="animate-pulse">
                        <div className="mb-5 h-4 w-36 rounded bg-gray-200" />

                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-gray-200" />

                            <div>
                                <div className="h-8 w-56 rounded bg-gray-200" />
                                <div className="mt-3 h-4 w-72 rounded bg-gray-200" />
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
                        <div className="animate-pulse space-y-7">
                            <div className="h-20 rounded-xl bg-gray-100" />

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                <div className="h-44 rounded-xl bg-gray-100" />
                                <div className="h-44 rounded-xl bg-gray-100" />
                                <div className="h-44 rounded-xl bg-gray-100" />
                            </div>

                            <div className="h-12 rounded-xl bg-gray-100" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // -----------------------------
    // Error state
    // -----------------------------
    if (error || !menu) {
        return (
            <div className="min-h-screen bg-[#F8F9FA]">
                <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
                    <div className="rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                            !
                        </div>

                        <h1 className="mt-5 text-xl font-bold text-[#1A1A1A]">
                            Unable to load menu
                        </h1>

                        <p className="mt-2 text-sm leading-6 text-[#6C757D]">
                            {error || "The requested mess menu could not be found."}
                        </p>

                        <button
                            type="button"
                            onClick={() => navigate("/mess")}
                            className="mt-6 rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                        >
                            Back to Mess Menu
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <MenuForm
            initialData={menu}
            onSubmit={handleSubmit}
            loading={saving}
        />
    );
}

export default EditMenu;