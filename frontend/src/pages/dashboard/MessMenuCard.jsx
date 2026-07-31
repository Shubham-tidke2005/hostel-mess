import { useEffect, useState } from "react";
import { UtensilsCrossed } from "lucide-react";
import api from "../../services/api";

function MessMenuCard() {
    const [menu, setMenu] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTodayMenu();
    }, []);

    const fetchTodayMenu = async () => {
        try {
            const response = await api.get("/mess/");

            const today = new Date().toISOString().split("T")[0];

            const todayMenu = response.data.find(
                (item) => item.menu_date === today
            );

            setMenu(todayMenu || null);

        } catch (error) {
            console.error("Error fetching menu:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                Loading today's menu...
            </div>
        );
    }

    return (
        <div
            className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-6
                shadow-sm
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-[#2563EB]/40
                hover:shadow-xl
            "
        >
            <div className="mb-6 flex items-center justify-between">

                <div>
                    <h2 className="text-2xl font-bold text-[#1A1A1A]">
                        Today's Mess Menu
                    </h2>

                    <p className="text-sm text-[#6C757D]">
                        {new Date().toLocaleDateString()}
                    </p>
                </div>

                <div className="rounded-xl bg-[#2563EB] p-3 text-white">
                    <UtensilsCrossed size={24} />
                </div>

            </div>

            {menu ? (
                <div className="space-y-5">

                    <div className="rounded-xl bg-blue-50 p-4">
                        <h3 className="font-semibold text-[#2563EB]">
                            🍽 Breakfast
                        </h3>

                        <p className="mt-2 text-[#1A1A1A]">
                            {menu.breakfast}
                        </p>
                    </div>

                    <div className="rounded-xl bg-green-50 p-4">
                        <h3 className="font-semibold text-green-700">
                            🍛 Lunch
                        </h3>

                        <p className="mt-2 text-[#1A1A1A]">
                            {menu.lunch}
                        </p>
                    </div>

                    <div className="rounded-xl bg-orange-50 p-4">
                        <h3 className="font-semibold text-orange-700">
                            🌙 Dinner
                        </h3>

                        <p className="mt-2 text-[#1A1A1A]">
                            {menu.dinner}
                        </p>
                    </div>

                </div>
            ) : (
                <div className="flex h-48 items-center justify-center rounded-xl bg-gray-50">

                    <p className="text-[#6C757D]">
                        No menu available for today.
                    </p>

                </div>
            )}

        </div>
    );
}

export default MessMenuCard;