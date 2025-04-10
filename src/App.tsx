import { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Index from "@/pages/Index";
import Payment from "@/pages/Payment";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import NotFound from "@/pages/NotFound";
import OrderStatus from "@/pages/OrderStatus";
import TermsAndPrivacy from "@/pages/TermsAndPrivacy";
import ScrollToTop from "@/components/ScrollToTop";
import FloatingReviews from "@/components/FloatingReviews";
import SupportChat from "@/components/SupportChat";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/toaster";

import AdminLayout from "@/pages/admin/AdminLayout";
import AdminLogin from "@/pages/admin/AdminLogin";
import Dashboard from "@/pages/admin/Dashboard";
import Orders from "@/pages/admin/Orders";
import Customers from "@/pages/admin/Customers";
import Services from "@/pages/admin/Services";
import Analytics from "@/pages/admin/Analytics";
import Settings from "@/pages/admin/Settings";

import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute"; // admin
import { UserProtectedRoute } from "./components/UserProtectedRoutes"; // usuário comum

function AppContent() {
  const location = useLocation();
  const isPaymentPage = location.pathname === "/payment";
  const isAdminPage = location.pathname.startsWith("/admin");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/criar-conta" element={<Register />} />
        <Route path="/termos-e-privacidade" element={<TermsAndPrivacy />} />
        

        {/* Rota protegida para usuário comum */}
        <Route path="/payment" element={<Payment />} />
        <Route path="/acompanhar-pedido" element={<OrderStatus />} />
        {/* <Route
          path="/payment"
          element={
            <UserProtectedRoute>
              <Payment />
            </UserProtectedRoute>
          }
        />

        <Route
          path="/acompanhar-pedido"
          element={
            <UserProtectedRoute>
              <OrderStatus />
            </UserProtectedRoute>
          }
        /> */}

        {/* Rotas de administração */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute redirectTo="/admin/login">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="pedidos" element={<Orders />} />
          <Route path="clientes" element={<Customers />} />
          <Route path="servicos" element={<Services />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="configuracoes" element={<Settings />} />
        </Route>

        {/* Rota 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Toaster />

      {!isPaymentPage && !isAdminPage && <ScrollToTop />}
      {!isPaymentPage && !isAdminPage && <FloatingReviews />}
      {!isPaymentPage && !isAdminPage && <SupportChat />}
    </>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <BrowserRouter>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
