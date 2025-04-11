import React from "react";
import { Link } from "react-router-dom";
import InstagramIcon from "@/assets/icons/instagram";
import FacebookIcon from "@/assets/icons/facebook";
import YoutubeIcon from "@/assets/icons/youtube";
import TikTokIcon from "@/assets/icons/tiktok";
import { Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-slate-900 to-slate-800 text-white relative overflow-hidden">
      {/* Elementos decorativos de redes sociais */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent"></div>
      <div className="absolute inset-0 bg-pattern-overlay opacity-5 pointer-events-none"></div>
      
      {/* Círculos decorativos estilo bolhas de notificação */}
      <div className="absolute -top-12 -left-12 w-24 h-24 rounded-full bg-primary/20 blur-xl"></div>
      <div className="absolute -bottom-12 -right-12 w-24 h-24 rounded-full bg-accent/20 blur-xl"></div>
      
      <div className="max-w-7xl mx-auto py-12 px-6 md:px-8 lg:py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Logo e Sobre */}
          <div className="space-y-4">
            <div className="text-xl font-bold flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary to-accent relative overflow-hidden">
                <span className="absolute inset-0 bg-white/20 transform rotate-45 translate-y-2/3"></span>
              </div>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                ImpulseGram
              </span>
            </div>
            
            <p className="text-sm text-gray-300 max-w-xs">
              Potencialize sua presença nas redes sociais com nossos serviços de alta qualidade e impulsione seu crescimento digital.
            </p>
            
            <div className="pt-4">
              <div className="flex space-x-3">
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#E1306C] flex items-center justify-center transition-colors duration-300"
                  aria-label="Instagram"
                >
                  <InstagramIcon className="w-4 h-4" />
                </a>
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#1877F2] flex items-center justify-center transition-colors duration-300"
                  aria-label="Facebook"
                >
                  <FacebookIcon className="w-4 h-4" />
                </a>
                <a 
                  href="https://youtube.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#FF0000] flex items-center justify-center transition-colors duration-300"
                  aria-label="YouTube"
                >
                  <YoutubeIcon className="w-4 h-4" />
                </a>
                <a 
                  href="https://tiktok.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-black flex items-center justify-center transition-colors duration-300"
                  aria-label="TikTok"
                >
                  <TikTokIcon className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
          
          {/* Links Rápidos */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <span className="w-6 h-0.5 bg-primary/60 mr-2"></span>
              Links Rápidos
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/60"></span>
                  Início
                </Link>
              </li>
              <li>
                <a href="/#services" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/60"></span>
                  Serviços
                </a>
              </li>
              <li>
                <a href="/#benefits" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/60"></span>
                  Benefícios
                </a>
              </li>
              <li>
                <a href="/#how-it-works" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/60"></span>
                  Como Funciona
                </a>
              </li>
              <li>
                <a href="/#faq" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/60"></span>
                  FAQ
                </a>
              </li>
            </ul>
          </div>
          
          {/* Serviços */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <span className="w-6 h-0.5 bg-accent/60 mr-2"></span>
              Serviços
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="/#services" onClick={() => document.querySelector('[value="instagram"]')?.dispatchEvent(new Event('click'))} className="text-gray-300 hover:text-white hover:translate-x-1 transition-all flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E1306C]/80"></span>
                  Instagram
                </a>
              </li>
              <li>
                <a href="/#services" onClick={() => document.querySelector('[value="facebook"]')?.dispatchEvent(new Event('click'))} className="text-gray-300 hover:text-white hover:translate-x-1 transition-all flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1877F2]/80"></span>
                  Facebook
                </a>
              </li>
              <li>
                <a href="/#services" onClick={() => document.querySelector('[value="youtube"]')?.dispatchEvent(new Event('click'))} className="text-gray-300 hover:text-white hover:translate-x-1 transition-all flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF0000]/80"></span>
                  YouTube
                </a>
              </li>
              <li>
                <a href="/#services" onClick={() => document.querySelector('[value="tiktok"]')?.dispatchEvent(new Event('click'))} className="text-gray-300 hover:text-white hover:translate-x-1 transition-all flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/80"></span>
                  TikTok
                </a>
              </li>
            </ul>
          </div>
          
          {/* Contato */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <span className="w-6 h-0.5 bg-accent/60 mr-2"></span>
              Contato
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-gray-300">
                <Mail className="text-primary h-4 w-4" />
                <span>contato@impulsegram.com</span>
              </li>
              <li className="flex items-start gap-2 text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-accent/80 shrink-0 mt-0.5">
                  <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" />
                </svg>
                <span>(12) 12 98145-7975</span>
              </li>
              <li className="flex items-start gap-2 text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-accent/80 shrink-0 mt-0.5">
                  <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
                <span>São Paulo, SP</span>
              </li>
              <li className="flex items-start gap-2 text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-accent/80 shrink-0 mt-0.5">
                  <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
                </svg>
                <span>Seg - Sex: 9h às 18h</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Barra de rodapé */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} ImpulseGram. Todos os direitos reservados.
          </p>
          
          <div className="flex gap-4 text-xs text-gray-400">
            <Link to="/termos-e-privacidade" className="hover:text-white transition-colors">Termos de Uso</Link>
            <Link to="/termos-e-privacidade?tab=privacy" className="hover:text-white transition-colors">Política de Privacidade</Link>
            <Link to="/termos-e-privacidade" className="hover:text-white transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
