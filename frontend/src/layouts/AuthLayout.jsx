
import { Outlet } from "react-router-dom";

function AuthLayout() {
    return (
        <div className="min-h-screen bg-[#F8F9FA]">
            <main className="min-h-screen">
                <Outlet />
            </main>
        </div>
    );
}

export default AuthLayout;
