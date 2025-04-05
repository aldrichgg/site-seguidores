import React, { useState } from "react";
import { BadgeCustom } from "./ui/badge-custom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, CheckCircle, Send, MessageSquare, Mail, Phone, MapPin } from "lucide-react";

// Interface para os dados do formulário
interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const ContactSection = () => {
  // Estados do formulário
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  // Função para validar o formulário
  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório";
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "E-mail é obrigatório";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "E-mail inválido";
      isValid = false;
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Assunto é obrigatório";
      isValid = false;
    }

    if (!formData.message.trim()) {
      newErrors.message = "Mensagem é obrigatória";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Função para lidar com alterações nos campos
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  // Função para lidar com a seleção do assunto
  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      subject: value,
    }));
    
    // Limpar erro do campo quando o usuário selecionar um valor
    if (errors.subject) {
      setErrors((prev) => ({
        ...prev,
        subject: undefined,
      }));
    }
  };

  // Função para enviar o formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Simulação de envio (em uma aplicação real, aqui seria uma chamada API)
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
        
        // Resetar formulário após 3 segundos
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({
            name: "",
            email: "",
            subject: "",
            message: "",
          });
        }, 3000);
      }, 1500);
    }
  };

  return (
    <section className="py-10 md:py-16 bg-white relative overflow-hidden">
      {/* Elementos decorativos */}
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-gray-50 to-transparent"></div>
      <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-gradient-to-br from-primary/5 to-accent/5 animate-pulse-slow"></div>
      <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-gradient-to-tr from-primary/5 to-accent/5 animate-pulse-slow"></div>
      
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-8 slide-up animate-fade-in">
          <BadgeCustom variant="outline" className="mb-3">Entre em Contato</BadgeCustom>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            Estamos aqui para<br />ajudar você
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Tem alguma dúvida ou precisa de assistência? Nossa equipe está pronta para atender você e oferecer todo o suporte necessário.
          </p>
        </div>
        
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
            {/* Informações de contato */}
            <div className="lg:col-span-2 animate-slide-right">
              <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-5 md:p-6 h-full flex flex-col">
                <h3 className="text-xl font-semibold mb-4">Informações de Contato</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex gap-3 items-center">
                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">Email</h4>
                      <p className="font-medium">contato@impulsegram.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 hover:translate-x-1 transition-transform duration-300">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Telefone</p>
                      <p className="font-medium">(11) 98765-4321</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 hover:translate-x-1 transition-transform duration-300">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Endereço</p>
                      <p className="font-medium">Av. Paulista, 1000 - São Paulo, SP</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-auto">
                  <h4 className="text-sm font-medium mb-2">Nos siga nas redes sociais</h4>
                  <div className="flex items-center gap-2">
                    <a 
                      href="https://instagram.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-gray-600 hover:text-[#E1306C] hover:shadow-md transition-all hover:-translate-y-1"
                      aria-label="Instagram"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                      </svg>
                    </a>
                    <a 
                      href="https://facebook.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-gray-600 hover:text-[#1877F2] hover:shadow-md transition-all hover:-translate-y-1"
                      aria-label="Facebook"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                      </svg>
                    </a>
                    <a 
                      href="https://twitter.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-gray-600 hover:text-[#1DA1F2] hover:shadow-md transition-all hover:-translate-y-1"
                      aria-label="Twitter"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                      </svg>
                    </a>
                    <a 
                      href="https://linkedin.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-gray-600 hover:text-[#0077B5] hover:shadow-md transition-all hover:-translate-y-1"
                      aria-label="LinkedIn"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                        <rect x="2" y="9" width="4" height="12"></rect>
                        <circle cx="4" cy="4" r="2"></circle>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Formulário de contato */}
            <div className="lg:col-span-3 animate-slide-left">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 md:p-6 hover:shadow-xl transition-all duration-300">
                {isSubmitted ? (
                  <div className="flex flex-col items-center justify-center py-6">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-3 animate-bounce-slow">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 animate-fade-in">Mensagem Enviada!</h3>
                    <p className="text-center text-muted-foreground mb-4 animate-fade-in">
                      Obrigado por entrar em contato. Responderemos o mais breve possível.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium">
                          Nome completo
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="Digite seu nome"
                          value={formData.name}
                          onChange={handleChange}
                          className={errors.name ? "border-red-500" : ""}
                        />
                        {errors.name && (
                          <p className="text-xs text-red-500">{errors.name}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium">
                          E-mail
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="Digite seu e-mail"
                          value={formData.email}
                          onChange={handleChange}
                          className={errors.email ? "border-red-500" : ""}
                        />
                        {errors.email && (
                          <p className="text-xs text-red-500">{errors.email}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-sm font-medium">
                        Assunto
                      </Label>
                      <Select 
                        onValueChange={handleSelectChange}
                        value={formData.subject}
                      >
                        <SelectTrigger 
                          id="subject"
                          className={errors.subject ? "border-red-500" : ""}
                        >
                          <SelectValue placeholder="Selecione o assunto" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="duvida">Dúvida sobre serviços</SelectItem>
                          <SelectItem value="suporte">Suporte técnico</SelectItem>
                          <SelectItem value="parceria">Proposta de parceria</SelectItem>
                          <SelectItem value="outro">Outro assunto</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.subject && (
                        <p className="text-xs text-red-500">{errors.subject}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-sm font-medium">
                        Mensagem
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Digite sua mensagem aqui..."
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        className={errors.message ? "border-red-500" : ""}
                      />
                      {errors.message && (
                        <p className="text-xs text-red-500">{errors.message}</p>
                      )}
                    </div>
                    
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full md:w-auto rounded-full px-8 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all hover:shadow-lg"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Enviar mensagem
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
          
          {/* Banner de chamada para ação */}
          <div className="mt-16 animate-slide-up">
            <div className="max-w-5xl mx-auto px-4">
              <div className="bg-gradient-to-r from-primary to-accent rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
                <div className="text-white text-center md:text-left">
                  <h3 className="text-xl md:text-2xl font-bold mb-2">Pronto para impulsionar suas redes sociais?</h3>
                  <p className="text-white/90">Comece agora e veja resultados em poucos dias!</p>
                </div>
                <div>
                  <Button onClick={() => window.location.href = '/#services'} className="bg-white text-primary hover:bg-white/90 hover:text-primary/90 w-full md:w-auto">
                    Ver Planos
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection; 