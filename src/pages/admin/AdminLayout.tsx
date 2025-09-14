import React, { useState, useEffect, useRef } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import Chart from "react-apexcharts";
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Users, 
  Settings as SettingsIcon, 
  BarChart, 
  Layers, 
  LogOut, 
  Search,
  ThumbsUp,
  Music,
  Tag,
  MessageSquare,
  ChevronRight,
  LucideIcon,
  Menu, 
  X,
  Bell,
  Cog,
  UserPlus,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

// Links de navegação
const navItems = [
  { 
    icon: LayoutDashboard, 
    label: "Dashboard", 
    path: "/admin",
  },
  { 
    icon: ShoppingCart, 
    label: "Vendas", 
    path: "/admin/vendas",
  },
  { 
    icon: Users, 
    label: "Clientes", 
    path: "/admin/clientes",
  },
  { 
    icon: UserPlus, 
    label: "Influenciadores", 
    path: "/admin/influenciadores",
  },
  { 
    icon: Cog, 
    label: "Configurar Serviços", 
    path: "/admin/configurar-servicos",
  },
  /* { 
    icon: SettingsIcon, 
    label: "Configurações", 
    path: "/admin/configuracoes",
  }, */
];

const AdminLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const mobileMenuRef = useRef<HTMLDivElement>(null);
const { logout } = useAuth();
  // Efeito para ajustar sidebar em diferentes tamanhos de tela
  useEffect(() => {
    const handleResize = () => {
      // Em telas maiores que 768px (md), sidebar fica aberta por padrão
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    // Adiciona listener de resize
    window.addEventListener("resize", handleResize);
    
    // Chama uma vez no início para definir estado inicial
    handleResize();

    // Limpa listener quando componente desmonta
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    logout()
  };

  return (
    <div id="webcrumbs">
      <div className="w-full bg-white p-4 sm:p-5 md:p-7 font-sans min-h-screen overflow-hidden">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6 space-y-3 md:space-y-0">
          <div className="flex items-center justify-between w-full md:w-auto">
            <div className="flex items-center space-x-2">
              <svg
                width="48px"
                height="48px"
                viewBox="0 0 1024 1024"
                className="icon"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                fill="#000000"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <path
                    d="M878.3 192.9H145.7c-16.5 0-30 13.5-30 30V706c0 16.5 13.5 30 30 30h732.6c16.5 0 30-13.5 30-30V222.9c0-16.5-13.5-30-30-30z"
                    fill="#FFFFFF"
                  ></path>
                  <path
                    d="M145.7 736h732.6c16.5 0 30-13.5 30-30v-22.1H115.7V706c0 16.6 13.5 30 30 30z"
                    fill="#E6E6E6"
                  ></path>
                  <path
                    d="M878.3 152.9H145.7c-38.6 0-70 31.4-70 70V706c0 38.6 31.4 70 70 70h732.6c38.6 0 70-31.4 70-70V222.9c0-38.6-31.4-70-70-70z m30 531V706c0 16.5-13.5 30-30 30H145.7c-16.5 0-30-13.5-30-30V222.9c0-16.5 13.5-30 30-30h732.6c16.5 0 30 13.5 30 30v461zM678 871.1H346c-11 0-20-9-20-20s9-20 20-20h332c11 0 20 9 20 20s-9 20-20 20z"
                    fill="#005BFF"
                  ></path>
                  <path
                    d="M127.1 662.7c-2.7 0-5.4-1.1-7.3-3.2-3.7-4.1-3.5-10.4 0.6-14.1l236.5-219.6L463 541.9l258.9-290.7 183.7 196.3c3.8 4 3.6 10.4-0.4 14.1-4 3.8-10.3 3.6-14.1-0.4L722.3 280.8l-259 290.9L355.7 454 133.9 660c-2 1.8-4.4 2.7-6.8 2.7z"
                    fill="#06F3FF"
                  ></path>
                  <path
                    d="M156.4 541.9a82.7 82.8 0 1 0 165.4 0 82.7 82.8 0 1 0-165.4 0Z"
                    fill="#D7E7FF"
                  ></path>
                  <path
                    d="M179.8 541.9a59.3 59.3 0 1 0 118.6 0 59.3 59.3 0 1 0-118.6 0Z"
                    fill="#B5CFF4"
                  ></path>
                  <path
                    d="M208.9 541.9a30.2 30.3 0 1 0 60.4 0 30.2 30.3 0 1 0-60.4 0Z"
                    fill="#005BFF"
                  ></path>
                  <path
                    d="M580.9 329.9a82.7 82.8 0 1 0 165.4 0 82.7 82.8 0 1 0-165.4 0Z"
                    fill="#D7E7FF"
                  ></path>
                  <path
                    d="M604.3 329.9a59.3 59.3 0 1 0 118.6 0 59.3 59.3 0 1 0-118.6 0Z"
                    fill="#B5CFF4"
                  ></path>
                  <path
                    d="M633.4 329.9a30.2 30.3 0 1 0 60.4 0 30.2 30.3 0 1 0-60.4 0Z"
                    fill="#005BFF"
                  ></path>
                  <path
                    d="M719.3 539.6a46.3 46.4 0 1 0 92.6 0 46.3 46.4 0 1 0-92.6 0Z"
                    fill="#D7E7FF"
                  ></path>
                  <path
                    d="M732.4 539.6a33.2 33.2 0 1 0 66.4 0 33.2 33.2 0 1 0-66.4 0Z"
                    fill="#B5CFF4"
                  ></path>
                  <path
                    d="M748.7 539.6a16.9 17 0 1 0 33.8 0 16.9 17 0 1 0-33.8 0Z"
                    fill="#005BFF"
                  ></path>
                  <path
                    d="M436.8 720.1H275.2c-5 0-9-4-9-9s4-9 9-9h161.6c5 0 9 4 9 9 0 4.9-4.1 9-9 9zM220.6 720.1h-26.5c-5 0-9-4-9-9s4-9 9-9h26.5c5 0 9 4 9 9 0 4.9-4.1 9-9 9z"
                    fill="#FFFFFF"
                  ></path>
                </g>
              </svg>

              <h1 className="text-xl md:text-2xl font-bold">Painel ImpulseGram</h1>
                </div>
            
            {/* Menu hamburguer para mobile */}
            <Sheet>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="md:hidden inline-flex items-center justify-center rounded-md p-2.5 text-primary-600 hover:bg-primary-50"
                >
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Abrir menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] sm:w-[350px] p-0">
                <div className="py-6 px-5 bg-gradient-to-br from-primary-50 to-blue-50 border-b border-primary-100">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center space-x-2">
                      <svg
                        width="40px"
                        height="40px"
                        viewBox="0 0 1024 1024"
                        className="icon"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="#000000"
                      >
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          <path
                            d="M878.3 192.9H145.7c-16.5 0-30 13.5-30 30V706c0 16.5 13.5 30 30 30h732.6c16.5 0 30-13.5 30-30V222.9c0-16.5-13.5-30-30-30z"
                            fill="#FFFFFF"
                          ></path>
                          <path
                            d="M145.7 736h732.6c16.5 0 30-13.5 30-30v-22.1H115.7V706c0 16.6 13.5 30 30 30z"
                            fill="#E6E6E6"
                          ></path>
                          <path
                            d="M878.3 152.9H145.7c-38.6 0-70 31.4-70 70V706c0 38.6 31.4 70 70 70h732.6c38.6 0 70-31.4 70-70V222.9c0-38.6-31.4-70-70-70z m30 531V706c0 16.5-13.5 30-30 30H145.7c-16.5 0-30-13.5-30-30V222.9c0-16.5 13.5-30 30-30h732.6c16.5 0 30 13.5 30 30v461zM678 871.1H346c-11 0-20-9-20-20s9-20 20-20h332c11 0 20 9 20 20s-9 20-20 20z"
                            fill="#005BFF"
                          ></path>
                          <path
                            d="M127.1 662.7c-2.7 0-5.4-1.1-7.3-3.2-3.7-4.1-3.5-10.4 0.6-14.1l236.5-219.6L463 541.9l258.9-290.7 183.7 196.3c3.8 4 3.6 10.4-0.4 14.1-4 3.8-10.3 3.6-14.1-0.4L722.3 280.8l-259 290.9L355.7 454 133.9 660c-2 1.8-4.4 2.7-6.8 2.7z"
                            fill="#06F3FF"
                          ></path>
                          <path
                            d="M156.4 541.9a82.7 82.8 0 1 0 165.4 0 82.7 82.8 0 1 0-165.4 0Z"
                            fill="#D7E7FF"
                          ></path>
                          <path
                            d="M179.8 541.9a59.3 59.3 0 1 0 118.6 0 59.3 59.3 0 1 0-118.6 0Z"
                            fill="#B5CFF4"
                          ></path>
                          <path
                            d="M208.9 541.9a30.2 30.3 0 1 0 60.4 0 30.2 30.3 0 1 0-60.4 0Z"
                            fill="#005BFF"
                          ></path>
                          <path
                            d="M580.9 329.9a82.7 82.8 0 1 0 165.4 0 82.7 82.8 0 1 0-165.4 0Z"
                            fill="#D7E7FF"
                          ></path>
                          <path
                            d="M604.3 329.9a59.3 59.3 0 1 0 118.6 0 59.3 59.3 0 1 0-118.6 0Z"
                            fill="#B5CFF4"
                          ></path>
                          <path
                            d="M633.4 329.9a30.2 30.3 0 1 0 60.4 0 30.2 30.3 0 1 0-60.4 0Z"
                            fill="#005BFF"
                          ></path>
                          <path
                            d="M719.3 539.6a46.3 46.4 0 1 0 92.6 0 46.3 46.4 0 1 0-92.6 0Z"
                            fill="#D7E7FF"
                          ></path>
                          <path
                            d="M732.4 539.6a33.2 33.2 0 1 0 66.4 0 33.2 33.2 0 1 0-66.4 0Z"
                            fill="#B5CFF4"
                          ></path>
                          <path
                            d="M748.7 539.6a16.9 17 0 1 0 33.8 0 16.9 17 0 1 0-33.8 0Z"
                            fill="#005BFF"
                          ></path>
                          <path
                            d="M436.8 720.1H275.2c-5 0-9-4-9-9s4-9 9-9h161.6c5 0 9 4 9 9 0 4.9-4.1 9-9 9zM220.6 720.1h-26.5c-5 0-9-4-9-9s4-9 9-9h26.5c5 0 9 4 9 9 0 4.9-4.1 9-9 9z"
                            fill="#FFFFFF"
                          ></path>
                        </g>
                      </svg>
                      <h2 className="text-xl font-bold text-primary-800">ImpulseGram</h2>
                    </div>
                    <SheetClose asChild>
                      <Button variant="ghost" size="icon" className="text-primary-600 hover:bg-primary-50">
                        <X className="h-5 w-5" />
                      </Button>
                    </SheetClose>
                  </div>
                  
                  <div className="flex items-center gap-3 mb-4 mt-6 bg-white p-3 rounded-lg shadow-sm">
                    <Avatar className="h-10 w-10 border-2 border-primary-200">
                      <AvatarImage src="https://i.pravatar.cc/40?img=3" alt="Admin" />
                      <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-primary-800">Admin User</p>
                      <p className="text-xs text-primary-600">Administrador</p>
                    </div>
                  </div>
              </div>

                <nav className="p-4">
                  <ul className="space-y-2">
                {navItems.map((item) => (
                      <li key={item.path} className="transform hover:translate-x-1 transition-transform">
                        <SheetClose asChild>
                    <Link 
                      to={item.path}
                            className={cn(
                              "flex items-center space-x-3 p-3 rounded-lg transition-all",
                              currentPath === item.path
                                ? "bg-primary-50 text-primary-700 shadow-sm"
                                : "hover:bg-gray-50 hover:text-primary-600"
                            )}
                          >
                            <item.icon size={20} className={currentPath === item.path ? "text-primary-600" : "text-gray-500"} />
                            <span className={currentPath === item.path ? "font-medium" : ""}>
                      {item.label}
                            </span>
                            <ChevronRight 
                              size={16} 
                              className={cn(
                                "ml-auto transition-transform",
                                currentPath === item.path ? "text-primary-600" : "text-gray-400",
                                currentPath === item.path ? "opacity-100" : "opacity-50"
                              )}
                            />
                    </Link>
                        </SheetClose>
                      </li>
                ))}
                  </ul>

                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <SheetClose asChild>
                <Button 
                        variant="outline" 
                        className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </Button>
                    </SheetClose>
              </div>
                </nav>
              </SheetContent>
            </Sheet>
            </div>

          <div className="flex items-center space-x-4 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-gray-400" />
              </span>
              <input
                type="text"
                placeholder="Pesquisar..." 
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm hover:shadow-md transition-shadow"
              />
          </div>

            <div className="relative">
              <Button 
                variant="ghost" 
                size="icon" 
                className="p-2.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-all shadow-sm hover:shadow-md relative"
              >
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
                <Bell className="h-5 w-5" />
              </Button>
            </div>

            <details className="relative hidden md:block">
              <summary className="list-none cursor-pointer flex items-center space-x-2">
                <img
                  src="https://i.pravatar.cc/40?img=3"
                  alt="Admin"
                  className="w-10 h-10 rounded-full object-cover border-2 border-primary-500 hover:border-primary-400 transition-colors shadow-md hover:shadow-lg transform hover:scale-105 transition-transform"
                />
                <span className="hidden md:inline font-medium">Admin User</span>
              </summary>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <ul>
                  <li className="px-4 py-3 hover:bg-gray-50 transition-colors rounded-t-lg border-b border-gray-100">
                    <a href="#" className="flex items-center space-x-2">
                      <span className="material-symbols-outlined">
                        account_circle
                      </span>
                      <span>Profile</span>
                    </a>
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-50 transition-colors">
                    <a href="#" className="flex items-center space-x-2">
                      <span className="material-symbols-outlined">
                        settings
                      </span>
                      <span>Settings</span>
                    </a>
                  </li>
                  <li className="px-4 py-3 hover:bg-red-50 transition-colors text-red-600 rounded-b-lg">
                    <a
                      href="#"
                      className="flex items-center space-x-3 hover:text-red-700 transition-colors"
                      onClick={(e) => {
                        e.preventDefault();
                        handleLogout();
                      }}
                    >
                      <span className="material-symbols-outlined">logout</span>
                      <span>Sair</span>
                    </a>
                  </li>
                </ul>
              </div>
            </details>
          </div>
        </header>

        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
          {/* Sidebar para desktop */}
          <aside className="hidden md:block w-64 mb-6 md:mb-0 md:pr-4">
            <nav className="bg-white rounded-xl shadow-sm p-3 md:p-4">
              <ul className="space-y-3">
                {navItems.map((item) => (
                  <li
                    key={item.path}
                    className="transform hover:translate-x-1 transition-transform"
                  >
                    <Link
                      to={item.path}
                      className={`flex items-center space-x-3 p-3 rounded-lg ${
                        currentPath === item.path
                          ? "bg-primary-50 text-primary-700"
                          : "hover:bg-gray-50 transition-colors"
                      }`}
                    >
                      <item.icon size={20} className={currentPath === item.path ? "text-primary-600" : ""} />
                      <span
                        className={
                          currentPath === item.path ? "font-medium" : ""
                        }
                      >
                        {item.label}
                      </span>
                      {currentPath === item.path && (
                        <ChevronRight size={16} className="ml-auto text-primary-600" />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          <main className="flex-1">
          <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout; 