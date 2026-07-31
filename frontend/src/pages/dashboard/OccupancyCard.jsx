import { BedDouble } from "lucide-react";

function OccupancyCard({
    totalRooms,
    occupiedRooms,
}) {
    const percentage =
        totalRooms === 0
            ? 0
            : Math.round((occupiedRooms / totalRooms) * 100);

    const availableRooms = totalRooms - occupiedRooms;

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
            <div className="flex items-center justify-between">

                <div>

                    <h2 className="text-xl font-semibold text-[#1A1A1A]">
                        Room Occupancy
                    </h2>

                    <p className="mt-1 text-sm text-[#6C757D]">
                        Current hostel occupancy
                    </p>

                </div>

                <div className="rounded-xl bg-[#2563EB] p-3 text-white">
                    <BedDouble size={24} />
                </div>

            </div>

            <div className="mt-8">

                <p className="text-3xl font-bold text-[#1A1A1A]">
                    {occupiedRooms} / {totalRooms}
                </p>

                <p className="mt-2 text-[#6C757D]">
                    Occupied Rooms
                </p>

            </div>

            {/* Progress Bar */}

            <div className="mt-6 h-3 w-full overflow-hidden rounded-full bg-gray-200">

                <div
                    className="h-full rounded-full bg-[#2563EB] transition-all duration-700"
                    style={{
                        width: `${percentage}%`,
                    }}
                />

            </div>

            <div className="mt-4 flex justify-between">

                <span className="font-semibold text-[#2563EB]">
                    {percentage}%
                </span>

                <span className="text-[#6C757D]">
                    Available : {availableRooms}
                </span>

            </div>

        </div>
    );
}

export default OccupancyCard;