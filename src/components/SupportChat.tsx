import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Mic, Paperclip, User, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Perguntas frequentes para sugestões rápidas
const commonQuestions = [
  "Como funciona a entrega dos seguidores?",
  "Quanto tempo leva para receber os seguidores?",
  "Os seguidores são de contas reais?",
  "Como faço para solicitar reembolso?",
  "Vocês oferecem garantia?",
];

// Respostas automáticas do chatbot
const botResponses: Record<string, string> = {
  "Como funciona a entrega dos seguidores?": "Nosso sistema é totalmente automatizado. Após a confirmação do pagamento, começamos a enviar os seguidores de forma gradual para parecer natural. Normalmente, iniciamos o envio em até 30 minutos após a confirmação.",
  
  "Quanto tempo leva para receber os seguidores?": "O tempo de entrega varia de acordo com o pacote escolhido. Para pacotes pequenos (até 1.000 seguidores), a entrega é concluída em 24-48 horas. Para pacotes maiores, pode levar até 3-5 dias para entrega completa, pois enviamos gradualmente para maior naturalidade.",
  
  "Os seguidores são de contas reais?": "Sim! Trabalhamos apenas com seguidores de contas reais e ativas. Isso garante melhor qualidade e permanência no seu perfil, além de possibilitar engajamento real com seu conteúdo.",
  
  "Como faço para solicitar reembolso?": "Se você não estiver satisfeito com nosso serviço, oferecemos reembolso total em até 7 dias após a compra. Basta entrar em contato conosco pelo e-mail suporte@empresa.com.br com o número do seu pedido.",
  
  "Vocês oferecem garantia?": "Sim! Oferecemos garantia de reposição de 30 dias. Se durante esse período você perder seguidores que enviamos, repomos gratuitamente. Basta entrar em contato com nosso suporte informando o número do pedido.",
};

// Mensagens iniciais do chatbot
const initialMessages = [
  {
    id: 1,
    sender: "bot",
    message: "Olá! Bem-vindo(a) ao nosso suporte. Como posso ajudar você hoje?",
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
];

export default function SupportChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Rolar para a última mensagem quando uma nova mensagem é adicionada
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  
  // Focar no input quando o chat é aberto
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);
  
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };
  
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!newMessage.trim()) return;
    
    // Adicionar mensagem do usuário
    const userMessage = {
      id: messages.length + 1,
      sender: "user",
      message: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage("");
    setShowSuggestions(false);
    
    // Simulação de digitação do bot
    setIsTyping(true);
    
    // Verificar se a mensagem corresponde a uma pergunta frequente
    const botResponse = botResponses[newMessage] || "Obrigado pelo seu contato! Um de nossos atendentes entrará em contato em breve para te ajudar.";
    
    // Simular resposta com delay para parecer mais natural
    setTimeout(() => {
      setIsTyping(false);
      
      const botMessage = {
        id: messages.length + 2,
        sender: "bot",
        message: botResponse,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, botMessage]);
    }, 1500);
  };
  
  const handleQuickQuestion = (question: string) => {
    setNewMessage(question);
    handleSendMessage();
  };
  
  return (
    <>
      {/* Botão de abertura do chat */}
      <button
        onClick={toggleChat}
        className={cn(
          "fixed right-7 bottom-24 z-40 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300",
          isOpen 
            ? "bg-white text-primary border border-gray-200 -translate-y-2" 
            : "bg-primary text-white hover:bg-primary/90"
        )}
        aria-label="Suporte ao cliente"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
      
      {/* Contador de notificações */}
      {!isOpen && (
        <span className="fixed right-5 bottom-28 z-50 flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
          1
        </span>
      )}
      
      {/* Janela do chat */}
      <div
        className={cn(
          "fixed bottom-20 sm:right-4 sm:bottom-40 left-0 right-0 sm:left-auto mx-auto sm:mx-0 z-40 w-[95vw] sm:w-[85vw] md:w-[60vw] lg:w-[40vw] max-w-md h-[400px] sm:h-[450px] max-h-[65vh] sm:max-h-[70vh] bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col transition-all duration-300 transform",
          isOpen 
            ? "translate-y-0 opacity-100" 
            : "translate-y-8 opacity-0 pointer-events-none"
        )}
      >
        {/* Cabeçalho */}
        <div className="bg-primary text-white p-3 sm:p-4 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold">Suporte ao Cliente</h3>
              <p className="text-xs opacity-80">
                <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                Online agora
              </p>
            </div>
          </div>
          <button 
            onClick={toggleChat}
            className="text-white/80 hover:text-white transition-colors"
            aria-label="Fechar chat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Corpo do chat */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 bg-gray-50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "mb-3 max-w-[85%] sm:max-w-[80%]",
                msg.sender === "user" ? "ml-auto" : "mr-auto"
              )}
            >
              <div
                className={cn(
                  "p-3 rounded-lg shadow-sm",
                  msg.sender === "user"
                    ? "bg-primary text-white rounded-br-none"
                    : "bg-white border border-gray-100 rounded-bl-none"
                )}
              >
                {msg.message}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {msg.time}
              </p>
            </div>
          ))}
          
          {/* Indicador de digitação */}
          {isTyping && (
            <div className="flex mb-4 max-w-[80%]">
              <div className="bg-white border border-gray-100 p-4 rounded-lg rounded-bl-none shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                </div>
              </div>
            </div>
          )}
          
          {/* Referência para rolagem automática */}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Sugestões de perguntas rápidas */}
        {showSuggestions && (
          <div className="p-3 sm:p-4 border-t border-gray-100">
            <p className="text-xs font-medium text-gray-500 mb-2">
              Perguntas frequentes:
            </p>
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {commonQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickQuestion(question)}
                  className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 py-1 sm:py-1.5 px-2 sm:px-3 rounded-full transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Formulário de envio */}
        <div className="p-2 sm:p-3 border-t border-gray-100">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Digite sua mensagem..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="pr-10 py-5 sm:py-6 text-sm"
                ref={inputRef}
              />
              <div className="absolute inset-y-0 right-0 flex items-center gap-1 pr-3">
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Anexar arquivo"
                >
                  <Paperclip className="w-4 h-4" />
                </button>
              </div>
            </div>
            <Button
              type="submit"
              aria-label="Enviar mensagem"
              disabled={!newMessage.trim()}
              className="w-10 h-10 rounded-full p-0 flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </>
  );
} 