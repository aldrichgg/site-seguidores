import React, { createContext, useContext, useEffect, useState } from "react";
import { getUserFromToken, FirebaseUserClaims } from "../utils/auth";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  user: FirebaseUserClaims | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<FirebaseUserClaims | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 🔁 Carrega token e decodifica ao iniciar app
  useEffect(() => {
    const token = localStorage.getItem("token");
    /* console.log("🔐 Token no localStorage:", token); */

    if (token) {
      const decoded = getUserFromToken(token);
      /* console.log("📦 Token decodificado:", decoded); */

      if (decoded) {
        setUser(decoded);
        
        // Redirecionar baseado no role apenas se não estiver já na rota correta
        const currentPath = window.location.pathname;
        
        if (decoded.role === 1 && !currentPath.startsWith("/admin")) {
          navigate("/admin");
        } else if (decoded.role === 2 && !currentPath.startsWith("/influencer")) {
          navigate("/influencer");
        } else if (decoded.role === 3 && !currentPath.startsWith("/attendant")) {
          navigate("/attendant");
        }
      }
    }
    
    // Marcar como carregado
    setIsLoading(false);
  }, [navigate]);

  // 🔁 Log para acompanhar mudanças no user
  useEffect(() => {
    /* console.log("👤 Usuário atualizado:", user);
    console.log("🔒 Está autenticado:", !!user); */
  }, [user]);

  // ✅ Faz login e salva user no contexto
  const login = (token: string) => {
    localStorage.setItem("token", token);
    const decoded = getUserFromToken(token);
    /* console.log("✅ Login efetuado com token decodificado:", decoded); */

    if (decoded) {
      setUser(decoded);
    }
    
    // Redirecionar baseado no role
    if (decoded?.role === 1) {
      navigate("/admin");
    } else if (decoded?.role === 2) {
      navigate("/influencer");
    } else if (decoded?.role === 3) {
      navigate("/attendant");
    }
  };

  // 🔓 Faz logout
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    if (user?.role === 1 || user?.role === 2 || user?.role === 3) {
      navigate("/login");
    }
  };

  // ✅ Sempre reflete o estado mais recente
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar o AuthContext
export const useAuth = () => useContext(AuthContext);
