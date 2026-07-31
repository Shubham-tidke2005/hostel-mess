import { useEffect, useState } from "react";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";

import api from "../../services/api";

function OccupancyLineChart() {
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            const response = await api.get("/rooms/");

            const data = response.data.map((room) => ({
                room: room.room_number,
                occupied: room.occupied_beds,
                capacity: room.capacity,
            }));

            setChartData(data);

        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                Loading occupancy chart...
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
            <h2 className="mb-6 text-2xl font-bold text-[#1A1A1A]">
                Room Occupancy
            </h2>

            <div className="h-80">

                <ResponsiveContainer width="100%" height="100%">

                    <LineChart data={chartData}>

                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis dataKey="room" />

                        <YAxis />

                        <Tooltip />

                        <Line
                            type="monotone"
                            dataKey="occupied"
                            stroke="#2563EB"
                            strokeWidth={3}
                        />

                    </LineChart>

                </ResponsiveContainer>

            </div>

        </div>
    );
}

export default OccupancyLineChart;