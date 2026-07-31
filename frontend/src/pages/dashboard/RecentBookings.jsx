import { useEffect, useState } from "react";
import api from "../../services/api";

function RecentBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const response = await api.get("/bookings/");

            // Latest 5 bookings
            setBookings(response.data.slice(0, 5));
        } catch (error) {
            console.error("Error fetching bookings:", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case "approved":
                return "bg-green-100 text-green-700";

            case "pending":
                return "bg-yellow-100 text-yellow-700";

            case "rejected":
                return "bg-red-100 text-red-700";

            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    if (loading) {
        return (
            <div className="rounded-2xl bg-white p-6 shadow-sm">
                Loading recent bookings...
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-6 flex items-center justify-between">

                <h2 className="text-2xl font-bold text-[#1A1A1A]">
                    Recent Bookings
                </h2>

                <button
                    className="
                        rounded-lg
                        bg-[#2563EB]
                        px-4
                        py-2
                        text-white
                        transition
                        hover:bg-blue-700
                    "
                >
                    View All
                </button>

            </div>

            <div className="overflow-x-auto">

                <table className="min-w-full">

                    <thead>

                        <tr className="border-b">

                            <th className="py-3 text-left">
                                Student
                            </th>

                            <th className="py-3 text-left">
                                Room
                            </th>

                            <th className="py-3 text-left">
                                Booking Date
                            </th>

                            <th className="py-3 text-left">
                                Status
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {bookings.map((booking) => (

                            <tr
                                key={booking.id}
                                className="border-b hover:bg-gray-50"
                            >

                                <td className="py-4">
                                    {booking.student}
                                </td>

                                <td className="py-4">
                                    {booking.room}
                                </td>

                                <td className="py-4">
                                    {booking.booking_date}
                                </td>

                                <td className="py-4">

                                    <span
                                        className={`
                                            rounded-full
                                            px-3
                                            py-1
                                            text-sm
                                            font-medium
                                            ${getStatusColor(booking.status)}
                                        `}
                                    >
                                        {booking.status}
                                    </span>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>
    );
}

export default RecentBookings;