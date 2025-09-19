import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="sticky top-0 bg-white z-10 pb-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-gray-900">
              Termos e Condições – Impulsegram
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-8 pt-4">
          {/* Introdução */}
          <div className="text-center">
            <p className="text-lg text-gray-700">
              Bem-vindo à Impulsegram 🚀.
            </p>
            <p className="text-gray-600 mt-2">
              Ao acessar e utilizar nossos serviços, você concorda com os presentes Termos e Condições. Leia com atenção.
            </p>
          </div>

          {/* Termos e Condições */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 border-b-2 border-blue-500 pb-2">
              Termos e Condições
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  1. Objeto
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  A Impulsegram é uma plataforma que oferece serviços de crescimento digital, como fornecimento de seguidores, engajamento e estratégias de visibilidade em redes sociais (Instagram e Facebook).
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  2. Uso dos Serviços
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">•</span>
                    <span>O cliente é responsável por fornecer corretamente as informações solicitadas no momento da compra (ex.: link do perfil, quantidade desejada, etc.).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">•</span>
                    <span>A Impulsegram não se responsabiliza por erros no fornecimento de dados pelo cliente.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">•</span>
                    <span>Caso o cliente forneça informações incorretas (como link errado, perfil inválido ou privado), não haverá direito a reembolso.</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  3. Prazos de Entrega
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">•</span>
                    <span>A entrega dos serviços pode variar de acordo com o pacote adquirido.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">•</span>
                    <span>Em alguns casos, podem ocorrer pequenas variações de prazo devido a ajustes técnicos ou instabilidades da própria rede social.</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  4. Reembolsos e Cancelamentos
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">•</span>
                    <span>Não oferecemos reembolso em casos de erro do cliente no momento da compra.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">•</span>
                    <span>Reembolsos só serão analisados em situações em que o serviço não tenha sido entregue por falha comprovada da Impulsegram.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">•</span>
                    <span>Compras processadas e entregues, mesmo que parcialmente, não são passíveis de estorno.</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  5. Alterações nos Termos
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  A Impulsegram pode atualizar estes Termos a qualquer momento, e a versão atualizada será sempre publicada em nosso site.
                </p>
              </div>
            </div>
          </div>

          {/* Separador */}
          <div className="border-t border-gray-200 pt-8">
            <div className="text-center text-gray-400 text-2xl">⸻</div>
          </div>

          {/* Política de Privacidade */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 border-b-2 border-green-500 pb-2 flex items-center gap-2">
              🔒 Política de Privacidade – Impulsegram
            </h2>
            <p className="text-gray-700 leading-relaxed">
              A Impulsegram respeita sua privacidade e está comprometida em proteger os dados pessoais de seus clientes.
            </p>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  1. Coleta de Informações
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">•</span>
                    <span>Coletamos informações fornecidas voluntariamente pelo cliente, como nome, e-mail, link do perfil e dados de pagamento.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">•</span>
                    <span>Também coletamos informações técnicas de navegação por meio de cookies e ferramentas analíticas.</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  2. Uso das Informações
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">•</span>
                    <span>Os dados coletados são usados para processar pedidos, entregar serviços, oferecer suporte e melhorar a experiência do cliente.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">•</span>
                    <span>A Impulsegram não compartilha, vende ou aluga informações pessoais a terceiros.</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  3. Proteção de Dados
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">•</span>
                    <span>Utilizamos medidas de segurança para proteger os dados pessoais contra acessos não autorizados, perda ou alteração.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">•</span>
                    <span>O cliente é responsável por manter a confidencialidade de seus dados de acesso.</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  4. Direitos do Usuário
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">•</span>
                    <span>O cliente pode solicitar a exclusão de seus dados pessoais armazenados, exceto aqueles necessários para cumprimento de obrigações legais.</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  5. Alterações na Política
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Esta Política de Privacidade pode ser atualizada periodicamente. Qualquer alteração será publicada em nosso site.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t pt-4 mt-8">
          <div className="flex justify-center">
            <Button onClick={onClose} className="px-8 py-2">
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TermsModal;
