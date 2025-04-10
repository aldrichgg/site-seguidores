import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: JSX.Element;
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  redirectTo = "/login",
}: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();

  // Aqui você pode fazer validações adicionais, como role === 'admin'
  const isAdmin = user?.role === "admin" || user?.role === 1;

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
}
