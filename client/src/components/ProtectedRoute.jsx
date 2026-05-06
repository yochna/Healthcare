import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
    const token = localStorage.getItem("token");
    const location = useLocation();

    if(!token) {
        // redirect to login AND remember where they came from
        return (
            <Navigate
                to="/admin/login"
                state={{ from: location.pathname }}
                replace
            />
        );
    }

    return children;
}