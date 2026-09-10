
import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ children }) {
    const location = useLocation();

    const token = localStorage.getItem("access_token");

    console.log("ProtectedRoute token:", token);

    if (!token) {
        return (
            <Navigate
                to="/"
                replace
                state={{ from: location }}
            />
        );
    }

    return children;
}

export default ProtectedRoute;

