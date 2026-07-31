import { TrendingUp } from "lucide-react";

function StatCard({
    title,
    value,
    icon: Icon,
    color = "bg-[#2563EB]",
    growth = null,
}) {
    return (
        <div
            className="
                group
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
            <div className="flex items-start justify-between">

                {/* Left */}

                <div>

                    <p className="text-sm font-medium text-[#6C757D]">
                        {title}
                    </p>

                    <h2 className="mt-3 text-4xl font-bold text-[#1A1A1A]">
                        {value}
                    </h2>

                    {growth && (
                        <div className="mt-4 flex items-center gap-2">

                            <TrendingUp
                                size={16}
                                className="text-green-600"
                            />

                            <span className="text-sm font-medium text-green-600">
                                {growth}
                            </span>

                        </div>
                    )}

                </div>

                {/* Icon */}

                <div
                    className={`
                        ${color}
                        flex
                        h-14
                        w-14
                        items-center
                        justify-center
                        rounded-2xl
                        text-white
                        transition-transform
                        duration-300
                        group-hover:scale-110
                    `}
                >
                    <Icon size={28} />
                </div>

            </div>

        </div>
    );
}

export default StatCard;