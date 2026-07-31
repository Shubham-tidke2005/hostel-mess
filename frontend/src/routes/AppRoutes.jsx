import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layouts
import AuthLayout from "../layouts/AuthLayout";
import MainLayout from "../layouts/MainLayout";

// Route Protection
import ProtectedRoute from "./ProtectedRoute";

// Pages
import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";

import StudentList from "../pages/students/StudentList";
import HostelList from "../pages/hostels/HostelList";
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
          <Route
            path="/"
            element={<Login />}
          />
        </Route>

        {/* Protected Routes */}

        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/students"
            element={<StudentList />}
          />

          <Route
            path="/hostels"
            element={<HostelList />}
          />

          <Route
            path="/rooms"
            element={<RoomList />}
          />

          <Route
            path="/bookings"
            element={<BookingList />}
          />

          <Route
            path="/mess"
            element={<MenuList />}
          />

          <Route
            path="/profile"
            element={<Profile />}
          />
        </Route>

        {/* 404 Page */}

        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;