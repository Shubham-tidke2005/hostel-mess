import { useNavigate } from "react-router-dom";
import {
    UserPlus,
    Building2,
    BedDouble,
    ClipboardPlus,
    UtensilsCrossed,
} from "lucide-react";

function QuickActions() {
    const navigate = useNavigate();

    const actions = [
        {
            title: "Add Student",
            icon: UserPlus,
            color: "bg-blue-500",
            path: "/students/add",
        },
        {
            title: "Add Hostel",
            icon: Building2,
            color: "bg-green-500",
            path: "/hostels/add",
        },
        {
            title: "Add Room",
            icon: BedDouble,
            color: "bg-orange-500",
            path: "/rooms/add",
        },
        {
            title: "New Booking",
            icon: ClipboardPlus,
            color: "bg-purple-500",
            path: "/bookings/add",
        },
        {
            title: "Mess Menu",
            icon: UtensilsCrossed,
            color: "bg-pink-500",
            path: "/mess",
        },
    ];

    return (
        <div
            className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-6
                shadow-sm
            "
        >
            <h2 className="mb-6 text-2xl font-bold text-[#1A1A1A]">
                Quick Actions
            </h2>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

                {actions.map((action) => {
                    const Icon = action.icon;

                    return (
                        <button
                            key={action.title}
                            onClick={() => navigate(action.path)}
                            className="
                                group
                                flex
                                flex-col
                                items-center
                                gap-3
                                rounded-2xl
                                border
                                border-slate-200
                                bg-[#F8F9FA]
                                p-6
                                transition-all
                                duration-300
                                hover:-translate-y-1
                                hover:border-[#2563EB]/40
                                hover:shadow-lg
                            "
                        >
                            <div
                                className={`
                                    ${action.color}
                                    rounded-xl
                                    p-4
                                    text-white
                                    transition-transform
                                    duration-300
                                    group-hover:scale-110
                                `}
                            >
                                <Icon size={28} />
                            </div>

                            <span className="font-semibold text-[#1A1A1A]">
                                {action.title}
                            </span>
                        </button>
                    );
                })}

            </div>
        </div>
    );
}

export default QuickActions;