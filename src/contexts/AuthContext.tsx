import React, { createContext, useContext, useEffect, useState } from "react";
import { getUserFromToken, FirebaseUserClaims } from "../utils/auth";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  user: FirebaseUserClaims | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<FirebaseUserClaims | null>(null);

  // 🔁 Carrega token e decodifica ao iniciar app
  useEffect(() => {
    const token = localStorage.getItem("token");
    /* console.log("🔐 Token no localStorage:", token); */

    if (token) {
      const decoded = getUserFromToken(token);
      /* console.log("📦 Token decodificado:", decoded); */

      if (decoded) {
        setUser(decoded);
      }
    }
  }, []);

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
    if (decoded?.role === 1) {
      navigate("/admin");
    }
  };

  // 🔓 Faz logout
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    if (user?.role === 1) {
      navigate("/login");
    }
  };

  // ✅ Sempre reflete o estado mais recente
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar o AuthContext
export const useAuth = () => useContext(AuthContext);
