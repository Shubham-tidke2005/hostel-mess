import { useState } from "react";
import { Outlet } from "react-router-dom";

import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import Footer from "../components/layout/Footer";

function MainLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#F8F9FA]">

            <Navbar
                toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            />

            <div className="flex">

                <Sidebar
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />

                <main className="flex-1 lg:ml-72 p-6">
                    <Outlet />
                    <Footer />
                </main>

            </div>

        </div>
    );
}

export default MainLayout;