import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface InfluencerProtectedRouteProps {
  children: JSX.Element;
  redirectTo?: string;
}

export function InfluencerProtectedRoute({
  children,
  redirectTo = "/login",
}: InfluencerProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuth();

  // Aguardar o carregamento da autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // Verificar se é um influenciador (role específico para influenciadores)
  const isInfluencer = user?.role === "influencer" || user?.role === 2;

  if (!isAuthenticated || !isInfluencer) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
}
