import React from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

interface LayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
  showNavBar?: boolean;
}

const Layout = ({ children, showFooter = true, showNavBar = true }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <Toaster />
      <Sonner />
      
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-primary text-white px-4 py-2 rounded"
      >
        Pular para o conteúdo principal
      </a>
      
      {showNavBar && <NavBar />}
      
      <main id="main-content" className="flex-1">
        {children}
      </main>
      
      {showFooter && <Footer />}
    </div>
  );
};

export default Layout; 