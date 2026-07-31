import { useEffect, useState } from "react";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend,
} from "recharts";

import api from "../../services/api";

const COLORS = [
    "#22C55E",
    "#F59E0B",
    "#EF4444",
];

function BookingStatusChart() {
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookingStatus();
    }, []);

    const fetchBookingStatus = async () => {
        try {
            const response = await api.get("/bookings/");

            const bookings = response.data;

            const approved = bookings.filter(
                (booking) =>
                    booking.status.toLowerCase() === "approved"
            ).length;

            const pending = bookings.filter(
                (booking) =>
                    booking.status.toLowerCase() === "pending"
            ).length;

            const rejected = bookings.filter(
                (booking) =>
                    booking.status.toLowerCase() === "rejected"
            ).length;

            setChartData([
                {
                    name: "Approved",
                    value: approved,
                },
                {
                    name: "Pending",
                    value: pending,
                },
                {
                    name: "Rejected",
                    value: rejected,
                },
            ]);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                Loading booking chart...
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
                Booking Status
            </h2>

            <div className="h-80">

                <ResponsiveContainer width="100%" height="100%">

                    <PieChart>

                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            outerRadius={95}
                            dataKey="value"
                            label
                        >

                            {chartData.map((entry, index) => (
                                <Cell
                                    key={entry.name}
                                    fill={
                                        COLORS[
                                            index % COLORS.length
                                        ]
                                    }
                                />
                            ))}

                        </Pie>

                        <Tooltip />

                        <Legend />

                    </PieChart>

                </ResponsiveContainer>

            </div>

        </div>
    );
}

export default BookingStatusChart;