import { useEffect, useState } from "react";
import {
    Users,
    Building2,
    BedDouble,
    ClipboardList,
} from "lucide-react";

import StatCard from "./StatCard";
import OccupancyCard from "./OccupancyCard";
import { getDashboardStats } from "../../services/dashboardService";
import RecentBookings from "./RecentBookings";
import MessMenuCard from "./MessMenuCard";
import BookingStatusChart from "./BookingStatusChart";
import OccupancyLineChart from "./OccupancyLineChart";
import QuickActions from "./QuickActions";
import LoadingSkeleton from "./LoadingSkeleton";
import ErrorState from "./ErrorState";


function Dashboard() {
    const [error, setError] = useState("");

    const [stats, setStats] = useState({
        students: 0,
        hostels: 0,
        rooms: 0,
        bookings: 0,
    });

    const [occupancy, setOccupancy] = useState({
        totalRooms: 0,
        occupiedRooms: 0,
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            
            const data = await getDashboardStats();

            // Statistics
            setStats({
                students: data.students.length,
                hostels: data.hostels.length,
                rooms: data.rooms.length,
                bookings: data.bookings.length,
            });

            // Occupancy
            const occupiedRooms = data.rooms.filter(
                (room) => room.occupied_beds > 0
            ).length;

            setOccupancy({
                totalRooms: data.rooms.length,
                occupiedRooms,
            });
            setError("");

        } catch (error) {
            console.error("Dashboard Error:", error);
             setError("Unable to load dashboard data.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
    return (
        <LoadingSkeleton height="h-[600px]" />
    );
    }

    if (error) {
        return (
            <ErrorState
                message={error}
                onRetry={fetchStats}
            />
        );
    }

    return (
    <div className="space-y-8">

        {/* Header */}
        <div>
            <h1 className="text-4xl font-bold text-[#1A1A1A]">
                Dashboard
            </h1>

            <p className="text-[#6C757D] mt-2">
                Welcome to Hostel Management System
            </p>
        </div>

        {/* Quick Actions */}
        <QuickActions />

        {/* Statistics Cards */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

            <StatCard
                title="Students"
                value={stats.students}
                icon={Users}
                color="bg-blue-600"
            />

            <StatCard
                title="Hostels"
                value={stats.hostels}
                icon={Building2}
                color="bg-green-600"
            />

            <StatCard
                title="Rooms"
                value={stats.rooms}
                icon={BedDouble}
                color="bg-orange-500"
            />

            <StatCard
                title="Bookings"
                value={stats.bookings}
                icon={ClipboardList}
                color="bg-purple-600"
            />

        </div>

        {/* Occupancy Section */}
        <div className="grid gap-6 lg:grid-cols-2">

            <OccupancyCard
                totalRooms={occupancy.totalRooms}
                occupiedRooms={occupancy.occupiedRooms}
            />

            <OccupancyLineChart />

        </div>

        {/* Analytics Section */}
        <div className="grid gap-6 lg:grid-cols-2">

            <BookingStatusChart />

            <MessMenuCard />

        </div>

        {/* Recent Bookings */}
        <RecentBookings />

    </div>
    );
}

export default Dashboard;