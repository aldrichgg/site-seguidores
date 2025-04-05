import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Index from "@/pages/Index";
import Payment from "@/pages/Payment";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import NotFound from "@/pages/NotFound";
import OrderStatus from "./pages/OrderStatus";
import TermsAndPrivacy from "@/pages/TermsAndPrivacy";
import ScrollToTop from "@/components/ScrollToTop";
import FloatingReviews from "@/components/FloatingReviews";
import SupportChat from "@/components/SupportChat";
import { ThemeProvider } from "@/components/ui/theme-provider";

// Importação das páginas de administração
import AdminLayout from "@/pages/admin/AdminLayout";
import AdminLogin from "@/pages/admin/AdminLogin";
import Dashboard from "@/pages/admin/Dashboard";
import Orders from "@/pages/admin/Orders";
import Customers from "@/pages/admin/Customers";
import Services from "@/pages/admin/Services";
import Analytics from "@/pages/admin/Analytics";
import Settings from "@/pages/admin/Settings";

// Componente para rotas protegidas
const ProtectedRoute = ({ children }) => {
  // Simulação de autenticação - em produção, verificar token JWT ou estado de autenticação real
  const isAuthenticated = localStorage.getItem("adminAuth") === "true";
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

function AppContent() {
  const location = useLocation();
  const isPaymentPage = location.pathname === '/payment';
  const isAdminPage = location.pathname.startsWith('/admin');

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Routes>
        {/* Rotas do cliente */}
        <Route path="/" element={<Index />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/login" element={<Login />} />
        <Route path="/criar-conta" element={<Register />} />
        <Route path="/acompanhar-pedido" element={<OrderStatus />} />
        <Route path="/termos-e-privacidade" element={<TermsAndPrivacy />} />
        
        {/* Rotas de administração */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
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
      {!isPaymentPage && !isAdminPage && <ScrollToTop />}
      {!isAdminPage && !isPaymentPage && <FloatingReviews />}
      {!isPaymentPage && !isAdminPage && <SupportChat />}
    </>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
