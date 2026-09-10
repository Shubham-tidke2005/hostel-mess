import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "../layouts/MainLayout";

// ==============================
// Auth
// ==============================
import Login from "../pages/auth/Login";

// ==============================
// Dashboard
// ==============================
import Dashboard from "../pages/dashboard/Dashboard";

// ==============================
// Students
// ==============================
import StudentList from "../pages/students/StudentList";
import AddStudent from "../pages/students/AddStudent";
import EditStudent from "../pages/students/EditStudent";
import StudentDetails from "../pages/students/StudentDetails";

// ==============================
// Hostels
// ==============================
import HostelList from "../pages/hostels/HostelList";
import AddHostel from "../pages/hostels/AddHostel";
import EditHostel from "../pages/hostels/EditHostel";
import HostelDetails from "../pages/hostels/HostelDetails";

// ==============================
// Rooms
// ==============================
import RoomList from "../pages/rooms/RoomList";
import AddRoom from "../pages/rooms/AddRoom";
import EditRoom from "../pages/rooms/EditRoom";
import RoomDetails from "../pages/rooms/RoomDetails";

// ==============================
// Bookings
// ==============================
import BookingList from "../pages/bookings/BookingList";
import CreateBooking from "../pages/bookings/CreateBooking";
import BookingDetails from "../pages/bookings/BookingDetails";
import BookingApproval from "../pages/bookings/BookingApproval";

// ==============================
// Mess
// ==============================
import MenuList from "../pages/mess/MenuList";
import AddMenu from "../pages/mess/AddMenu";
import EditMenu from "../pages/mess/EditMenu";
import TodayMenu from "../pages/mess/TodayMenu";



import EditProfile from "../pages/profile/EditProfile";
import ChangePassword from "../pages/profile/ChangePassword";

// ==============================
// Profile
// ==============================
import Profile from "../pages/profile/Profile";

function AppRoutes() {
    return (
        <Routes>
            {/* =====================================
                PUBLIC ROUTES
            ===================================== */}

            <Route path="/" element={<Login />} />

            {/* =====================================
                PROTECTED ROUTES
            ===================================== */}

            <Route
                element={
                    <ProtectedRoute>
                        <MainLayout />
                    </ProtectedRoute>
                }
            >
                {/* ================================
                    Dashboard
                ================================= */}
                <Route path="/dashboard" element={<Dashboard />} />

                {/* ================================
                    Students
                ================================= */}
                <Route
                    path="/students"
                    element={<StudentList />}
                />

                <Route
                    path="/students/add"
                    element={<AddStudent />}
                />

                <Route
                    path="/students/:id/edit"
                    element={<EditStudent />}
                />

                <Route
                    path="/students/:id"
                    element={<StudentDetails />}
                />

                {/* ================================
                    Hostels
                ================================= */}
                <Route
                    path="/hostels"
                    element={<HostelList />}
                />

                <Route
                    path="/hostels/add"
                    element={<AddHostel />}
                />

                <Route
                    path="/hostels/:id/edit"
                    element={<EditHostel />}
                />

                <Route
                    path="/hostels/:id"
                    element={<HostelDetails />}
                />

                {/* ================================
                    Rooms
                ================================= */}
                <Route
                    path="/rooms"
                    element={<RoomList />}
                />

                <Route
                    path="/rooms/add"
                    element={<AddRoom />}
                />

                <Route
                    path="/rooms/:id/edit"
                    element={<EditRoom />}
                />

                <Route
                    path="/rooms/:id"
                    element={<RoomDetails />}
                />

                {/* ================================
                    Bookings
                ================================= */}
                <Route
                    path="/bookings"
                    element={<BookingList />}
                />

                <Route
                    path="/bookings/create"
                    element={<CreateBooking />}
                />

                <Route
                    path="/bookings/:id/approval"
                    element={<BookingApproval />}
                />

                <Route
                    path="/bookings/:id"
                    element={<BookingDetails />}
                />

                {/* ================================
                    Mess
                ================================= */}
                <Route
                    path="/mess"
                    element={<MenuList />}
                />

                <Route
                    path="/mess/add"
                    element={<AddMenu />}
                />

                <Route
                    path="/mess/today"
                    element={<TodayMenu />}
                />

                <Route
                    path="/mess/:id/edit"
                    element={<EditMenu />}
                />

                {/* ================================
                    Profile
                ================================= */}
                <Route
                    path="/profile"
                    element={<Profile />}
                />

                {/* ================================
                    Unknown protected route
                ================================= */}
                <Route
                    path="*"
                    element={<Navigate to="/dashboard" replace />}
                />
            </Route>

            {/* =====================================
                UNKNOWN PUBLIC ROUTE
            ===================================== */}

            <Route
                path="*"
                element={<Navigate to="/" replace />}
            />

            <Route path="/profile" element={<Profile />} />

<Route
    path="/profile/edit"
    element={<EditProfile />}
/>

<Route
    path="/profile/change-password"
    element={<ChangePassword />}
/>
        </Routes>
    );
}

export default AppRoutes;