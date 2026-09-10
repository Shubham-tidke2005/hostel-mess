
import { useState } from "react";
import { Menu } from "lucide-react";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";


function MainLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const openSidebar = () => {
        setSidebarOpen(true);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };


    return (
        <div className="min-h-screen bg-[#F8F9FA]">

            <div className="flex min-h-screen">

                {/* Sidebar */}
                <Sidebar
                    isOpen={sidebarOpen}
                    onClose={closeSidebar}
                />


                {/* Main Content Area */}
                <div className="flex min-w-0 flex-1 flex-col">

                    {/* Mobile Header */}
                    <div className="flex h-16 items-center border-b border-slate-200 bg-white px-4 lg:hidden">

                        <button
                            type="button"
                            onClick={openSidebar}
                            className="rounded-xl p-2 text-[#6C757D] transition hover:bg-slate-100 hover:text-[#1A1A1A]"
                            aria-label="Open sidebar"
                        >
                            <Menu className="h-6 w-6" />
                        </button>

                        <div className="ml-3">
                            <p className="text-lg font-bold text-[#1A1A1A]">
                                HostelMS
                            </p>
                        </div>

                    </div>


                    {/* Desktop / Main Navbar */}
                    <Navbar />


                    {/* Page Content */}
                    <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">

                        <div className="mx-auto max-w-7xl">
                            <Outlet />
                        </div>

                    </main>


                    {/* Footer */}
                    <Footer />

                </div>

            </div>

        </div>
    );
}

export default MainLayout;

