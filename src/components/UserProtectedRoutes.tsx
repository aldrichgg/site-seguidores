// src/components/UserProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface Props {
  children: JSX.Element;
  redirectTo?: string;
}

export function UserProtectedRoute({ children, redirectTo = "/login" }: Props) {
  const { isAuthenticated, user } = useAuth();

  /* console.log("🔒 [UserProtectedRoute] isAuthenticated:", isAuthenticated);
  console.log("👤 [UserProtectedRoute] user:", user); */

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
}
