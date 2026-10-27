import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Pageskeleton from "../ui/Skeleton";

export default function PublicOnlyRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Pageskeleton />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}