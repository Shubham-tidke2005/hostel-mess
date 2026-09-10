
import { BrowserRouter, Routes, Route } from "react-router-dom";

import AuthLayout from "../layouts/AuthLayout";
import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "./ProtectedRoute";

import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";

import StudentList from "../pages/students/StudentList";
import StudentDetails from "../pages/students/StudentDetails";
import AddStudent from "../pages/students/AddStudent";
import EditStudent from "../pages/students/EditStudent";

import HostelList from "../pages/hostels/HostelList";
import AddHostel from "../pages/hostels/AddHostel";
import EditHostel from "../pages/hostels/EditHostel";
import HostelDetails from "../pages/hostels/HostelDetails";

import RoomList from "../pages/rooms/RoomList";
import BookingList from "../pages/bookings/BookingList";
import MenuList from "../pages/mess/MenuList";
import Profile from "../pages/profile/Profile";

import NotFound from "../pages/errors/NotFound";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes */}
                <Route element={<AuthLayout />}>
                    <Route path="/" element={<Login />} />
                </Route>

                {/* Protected Routes */}
                <Route
                    element={
                        <ProtectedRoute>
                            <MainLayout />
                        </ProtectedRoute>
                    }
                >
                    {/* Dashboard */}
                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />

                    {/* Student Management */}
                    <Route
                        path="/students"
                        element={<StudentList />}
                    />
                    <Route
                        path="/students/add"
                        element={<AddStudent />}
                    />
                    <Route
                        path="/students/:id"
                        element={<StudentDetails />}
                    />
                    <Route
                        path="/students/:id/edit"
                        element={<EditStudent />}
                    />

                    {/* Hostel Management */}
                    <Route
                        path="/hostels"
                        element={<HostelList />}
                    />
                    <Route
                        path="/hostels/add"
                        element={<AddHostel />}
                    />
                    <Route
                        path="/hostels/:id"
                        element={<HostelDetails />}
                    />
                    <Route
                        path="/hostels/:id/edit"
                        element={<EditHostel />}
                    />

                    {/* Room Management */}
                    <Route
                        path="/rooms"
                        element={<RoomList />}
                    />

                    {/* Booking Management */}
                    <Route
                        path="/bookings"
                        element={<BookingList />}
                    />

                    {/* Mess Management */}
                    <Route
                        path="/mess"
                        element={<MenuList />}
                    />

                    {/* Profile */}
                    <Route
                        path="/profile"
                        element={<Profile />}
                    />
                </Route>

                {/* 404 */}
                <Route
                    path="*"
                    element={<NotFound />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;

