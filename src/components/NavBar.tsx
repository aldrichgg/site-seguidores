import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Menu, X, SearchIcon } from "lucide-react";
import InstagramIcon from "@/assets/icons/instagram";
import FacebookIcon from "@/assets/icons/facebook";
import YoutubeIcon from "@/assets/icons/youtube";
import TikTokIcon from "@/assets/icons/tiktok";

const NavBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const navigate = useNavigate();

  // Efeito para detectar rolagem e ativar a navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Detectar seção ativa para navegação
      const sections = ["services", "benefits", "how-it-works", "faq", "contact"];
      let current = "home";

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element && window.scrollY >= element.offsetTop - 200) {
          current = section;
        }
      }

      setActiveSection(current);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Links de navegação
  const navLinks = [
    { href: "#", label: "Início", id: "home" },
    { href: "#services", label: "Serviços", id: "services" },
    { href: "#benefits", label: "Benefícios", id: "benefits" },
    { href: "#how-it-works", label: "Como Funciona", id: "how-it-works" },
    { href: "#faq", label: "FAQ", id: "faq" },
    { href: "#contact", label: "Contato", id: "contact" },
  ];

  // Função para navegação suave
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: "smooth",
      });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "py-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-md" 
          : "py-4 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 text-xl font-bold relative z-10"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-accent relative overflow-hidden">
            <span className="absolute inset-0 bg-white/20 transform rotate-45 translate-y-2/3"></span>
              {/* Indicador de notificação animado */}
              <span className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full animate-pulse"></span>
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              ImpulseGram
            </span>
            
            {/* Emblema de tendência */}
            
            
        </Link>

          {/* Links de navegação para telas maiores */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.id)}
                className={`px-3 py-2 rounded-full text-sm font-medium transition-all relative ${
                  activeSection === link.id
                    ? "text-primary"
                    : "text-gray-700 dark:text-gray-300 hover:text-primary"
                }`}
              >
                {link.label}
                {activeSection === link.id && (
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full"></span>
                )}
              </a>
            ))}
          </div>

          {/* Ações da navbar para telas maiores */}
          <div className="hidden md:flex items-center gap-2">
            {/* Ícones de redes sociais */}
            <div className="flex items-center gap-1 mr-2">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-600 hover:text-[#E1306C] dark:text-gray-400 hover-lift transition-all"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-600 hover:text-[#1877F2] dark:text-gray-400 hover-lift transition-all"
                aria-label="Facebook"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-600 hover:text-[#FF0000] dark:text-gray-400 hover-lift transition-all"
                aria-label="YouTube"
              >
                <YoutubeIcon className="w-4 h-4" />
              </a>
              <a 
                href="https://tiktok.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-600 hover:text-black dark:text-gray-400 hover-lift transition-all"
                aria-label="TikTok"
              >
                <TikTokIcon className="w-4 h-4" />
              </a>
            </div>

            {/* Botões de ação */}
            <Button 
              variant="ghost"
              size="sm"
              onClick={() => navigate("/acompanhar-pedido")}
              className="gap-1"
            >
              <SearchIcon className="w-4 h-4" />
              Acompanhar Pedido
            </Button>
            
            <Button 
              size="sm" 
              className="rounded-full px-5 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 relative group"
              asChild
            >
              <a href="/login">
                Comprar
                <span className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity"></span>
              </a>
            </Button>
          </div>

          {/* Menu mobile */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Abrir menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[85%] sm:w-80 pt-10">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-8">
                    <Link 
                      to="/" 
                      className="flex items-center gap-2 text-lg font-bold"
                    >
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary to-accent relative overflow-hidden">
                        <span className="absolute inset-0 bg-white/20 transform rotate-45 translate-y-2/3"></span>
                      </div>
                      <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                        ImpulseGram
                      </span>
                    </Link>
                  </div>
      
                  <div className="space-y-1 flex-1">
                    {navLinks.map((link) => (
                      <SheetClose asChild key={link.id}>
                        <a
                          href={link.href}
                          onClick={(e) => scrollToSection(e, link.id)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                            activeSection === link.id
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                          }`}
                        >
                          {activeSection === link.id && (
                            <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                          )}
                          {link.label}
                        </a>
                      </SheetClose>
                    ))}

                    <SheetClose asChild>
                      <Link
                        to="/acompanhar-pedido"
                        className="flex items-center gap-2 px-4 py-3 mt-2 rounded-lg border border-gray-100 bg-gray-50 text-gray-800 hover:bg-gray-100 transition-all"
                      >
                        <SearchIcon className="w-4 h-4" />
                        Acompanhar Pedido
                      </Link>
                    </SheetClose>
                  </div>
            
                  <div className="pt-6 mt-auto border-t">
                    <div className="flex justify-center gap-4 mb-6">
                      <a 
                        href="https://instagram.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-[#E1306C] hover:text-white transition-all"
                        aria-label="Instagram"
                      >
                        <InstagramIcon className="w-5 h-5" />
                      </a>
                      <a 
                        href="https://facebook.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-[#1877F2] hover:text-white transition-all"
                        aria-label="Facebook"
                      >
                        <FacebookIcon className="w-5 h-5" />
                      </a>
                      <a 
                        href="https://youtube.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-[#FF0000] hover:text-white transition-all"
                        aria-label="YouTube"
                      >
                        <YoutubeIcon className="w-5 h-5" />
                      </a>
                      <a 
                        href="https://tiktok.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-black hover:text-white transition-all"
                        aria-label="TikTok"
                      >
                        <TikTokIcon className="w-5 h-5" />
                      </a>
                    </div>
                    
                    <div className="flex justify-center">
                      <Button 
                        onClick={() => navigate("/#services")}
                        className="rounded-full px-6 py-5 bg-gradient-to-r from-primary to-accent text-white hover:from-primary/90 hover:to-accent/90 hover:shadow-lg transition-all"
                      >
                        Comprar agora
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default NavBar;
