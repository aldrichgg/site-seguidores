import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Eye, EyeOff, CheckCircle, X } from "lucide-react";

interface ProfilePrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  profileLink: string;
}

const ProfilePrivacyModal: React.FC<ProfilePrivacyModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  profileLink,
}) => {
  // Prevenir scroll do body quando modal estiver aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-2xl flex flex-col max-h-[90vh] w-[95vw] max-w-[500px] mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-b border-amber-200 flex-shrink-0">
          <div className="p-6 pb-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800 leading-tight">
                  ⚠️ Verificação Importante
                </h2>
                <p className="text-gray-600 mt-1">
                  Antes de gerar o PIX, confirme se seu perfil está público
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {/* Aviso Principal */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Eye className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-red-800 mb-2">
                  Seu perfil precisa estar PÚBLICO
                </h3>
                <p className="text-sm text-red-700 leading-relaxed">
                  Para que possamos entregar seus seguidores, é essencial que seu perfil esteja configurado como público. 
                  Perfis privados não podem receber seguidores automaticamente.
                </p>
              </div>
            </div>
          </div>

          {/* Link do Perfil */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-blue-800 mb-2">
                  Seu perfil informado:
                </h3>
                <div className="bg-white border border-blue-300 rounded-lg p-3">
                  <p className="text-sm text-blue-700 font-mono break-all">
                    {profileLink}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Instruções */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <Eye className="h-5 w-5 text-green-600" />
              Como verificar se seu perfil está público:
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-green-600">1</span>
                </div>
                <p className="text-sm text-gray-700">
                  Acesse seu perfil no Instagram/TikTok
                </p>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-green-600">2</span>
                </div>
                <p className="text-sm text-gray-700">
                  Vá em "Configurações" → "Privacidade"
                </p>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-green-600">3</span>
                </div>
                <p className="text-sm text-gray-700">
                  Certifique-se que "Conta Privada" está DESATIVADA
                </p>
              </div>
            </div>
          </div>

          {/* Aviso Final */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <EyeOff className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-amber-800 font-medium">
                  ⚠️ Se seu perfil estiver privado, não conseguiremos entregar os seguidores!
                </p>
                <p className="text-xs text-amber-700 mt-1">
                  Após confirmar que está público, clique em "Confirmar e Gerar PIX"
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 pt-0 flex flex-col sm:flex-row gap-3 flex-shrink-0 border-t border-gray-200 bg-gray-50">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
          <Button
            onClick={onConfirm}
            className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Confirmar e Gerar PIX
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePrivacyModal;
