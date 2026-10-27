import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Pageskeleton from "../ui/Skeleton";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Wait until AuthContext finishes reading localStorage token
  if (loading) {
    return <Pageskeleton />;
  }

  // Not logged in → send to home
  if (!isAuthenticated) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }

  return children;
}