import React, { useState, useEffect } from "react";
import { BadgeCustom } from "@/components/ui/badge-custom";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileTextIcon, ShieldIcon, ArrowLeftIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

const TermsAndPrivacy = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<string>("terms");

  // Função para analisar a query string
  const getQueryParam = (param: string) => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get(param);
  };

  // Configurar a aba ativa com base na query string
  useEffect(() => {
    window.scrollTo(0, 0);
    const tabParam = getQueryParam('tab');
    if (tabParam === 'privacy') {
      setActiveTab('privacy');
    } else {
      setActiveTab('terms');
    }
  }, [location.search]);

  return (
    <main className="min-h-screen flex flex-col">
      <NavBar />

      <section className="pt-24 pb-10 md:pt-32 md:pb-16 bg-white flex-grow">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 text-muted-foreground hover:text-foreground"
                asChild
              >
                <Link to="/">
                  <ArrowLeftIcon className="w-4 h-4" />
                  Voltar ao Início
                </Link>
              </Button>
            </div>
            
            <div className="text-center mb-8">
              <BadgeCustom variant="outline" className="mb-3">Informações Legais</BadgeCustom>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Termos e Privacidade
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Informações importantes sobre como utilizamos seus dados e os termos de uso da plataforma.
              </p>
            </div>
            
            <Card className="shadow-lg border-none overflow-hidden fade-in">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-2 w-full rounded-none">
                  <TabsTrigger 
                    value="terms" 
                    className="data-[state=active]:bg-background py-4 flex gap-2"
                  >
                    <FileTextIcon className="h-4 w-4" />
                    <span>Termos de Uso</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="privacy" 
                    className="data-[state=active]:bg-background py-4 flex gap-2"
                  >
                    <ShieldIcon className="h-4 w-4" />
                    <span>Política de Privacidade</span>
                  </TabsTrigger>
                </TabsList>
                
                <CardContent className="p-0">
                  <TabsContent value="terms" className="m-0">
                    <ScrollArea className="h-[500px] p-6">
                      <div className="space-y-4">
                        <h2 className="text-2xl font-bold">Termos de Uso</h2>
                        <p className="text-muted-foreground">Última atualização: 15 de Outubro de 2023</p>
                        
                        <div>
                          <h2 className="text-xl font-bold mb-3 text-primary">1. Aceitação dos Termos</h2>
                          <p className="text-muted-foreground mb-3">
                            Ao acessar e usar os serviços da GrowthBoost, você concorda com estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não poderá usar nossos serviços.
                          </p>
                        </div>

                        <div>
                          <h2 className="text-xl font-bold mb-3 text-primary">2. Descrição dos Serviços</h2>
                          <p className="text-muted-foreground mb-3">
                            A GrowthBoost oferece serviços de aumento de seguidores, curtidas, visualizações e engajamento para diversas plataformas de mídia social, incluindo Instagram, Facebook, YouTube e TikTok.
                          </p>
                          <p className="text-muted-foreground mb-3">
                            Nossos serviços são projetados para aumentar sua presença online de maneira orgânica e segura, utilizando métodos que não violam os termos de serviço das plataformas sociais.
                          </p>
                        </div>

                        <div>
                          <h2 className="text-xl font-bold mb-3 text-primary">3. Conta de Usuário</h2>
                          <p className="text-muted-foreground mb-3">
                            Para utilizar alguns de nossos serviços, você pode precisar criar uma conta. Você é responsável por manter a confidencialidade de sua senha e é totalmente responsável por todas as atividades que ocorrem em sua conta.
                          </p>
                          <p className="text-muted-foreground mb-3">
                            Você concorda em notificar imediatamente a GrowthBoost sobre qualquer uso não autorizado de sua conta ou qualquer outra violação de segurança.
                          </p>
                        </div>

                        <div>
                          <h2 className="text-xl font-bold mb-3 text-primary">4. Pagamentos e Reembolsos</h2>
                          <p className="text-muted-foreground mb-3">
                            Todos os pagamentos são processados de forma segura através de nossos provedores de pagamento. Os preços estão sujeitos a alterações sem aviso prévio.
                          </p>
                          <p className="text-muted-foreground mb-3">
                            Reembolsos podem ser solicitados dentro de 7 dias após a compra, caso o serviço não tenha sido iniciado. Após o início do serviço, reembolsos serão avaliados caso a caso.
                          </p>
                        </div>

                        <div>
                          <h2 className="text-xl font-bold mb-3 text-primary">5. Limitações de Uso</h2>
                          <p className="text-muted-foreground mb-3">
                            Você concorda em não usar nossos serviços para:
                          </p>
                          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                            <li>Violar leis ou regulamentos locais, estaduais, nacionais ou internacionais;</li>
                            <li>Explorar ou prejudicar menores de qualquer forma;</li>
                            <li>Enviar publicidade não solicitada ou não autorizada;</li>
                            <li>Se passar por outra pessoa ou entidade;</li>
                            <li>Interferir na operação adequada do site ou serviços.</li>
                          </ul>
                        </div>

                        <div>
                          <h2 className="text-xl font-bold mb-3 text-primary">6. Direitos de Propriedade Intelectual</h2>
                          <p className="text-muted-foreground mb-3">
                            Todo o conteúdo presente no site da GrowthBoost, incluindo textos, gráficos, logotipos, ícones, imagens, clipes de áudio, downloads digitais e compilações de dados, é propriedade da GrowthBoost ou de seus fornecedores de conteúdo e está protegido pelas leis de direitos autorais.
                          </p>
                        </div>

                        <div>
                          <h2 className="text-xl font-bold mb-3 text-primary">7. Isenção de Responsabilidade</h2>
                          <p className="text-muted-foreground mb-3">
                            Os serviços são fornecidos "como estão" e "conforme disponíveis", sem quaisquer garantias expressas ou implícitas. A GrowthBoost não garante que os serviços serão ininterruptos, oportunos, seguros ou livres de erros.
                          </p>
                        </div>

                        <div>
                          <h2 className="text-xl font-bold mb-3 text-primary">8. Limitação de Responsabilidade</h2>
                          <p className="text-muted-foreground mb-3">
                            Em nenhum caso a GrowthBoost será responsável por danos indiretos, incidentais, especiais, consequenciais ou punitivos, incluindo perda de lucros, dados, uso ou outra perda intangível, resultantes do uso ou da incapacidade de usar os serviços.
                          </p>
                        </div>

                        <div>
                          <h2 className="text-xl font-bold mb-3 text-primary">9. Alterações nos Termos</h2>
                          <p className="text-muted-foreground mb-3">
                            A GrowthBoost reserva-se o direito de modificar estes termos a qualquer momento. É sua responsabilidade verificar regularmente se há alterações. O uso continuado dos serviços após a publicação de alterações constituirá seu consentimento para tais alterações.
                          </p>
                        </div>

                        <div>
                          <h2 className="text-xl font-bold mb-3 text-primary">10. Lei Aplicável</h2>
                          <p className="text-muted-foreground mb-3">
                            Estes termos serão regidos e interpretados de acordo com as leis do Brasil, sem considerar conflitos de disposições legais.
                          </p>
                        </div>

                        <div className="pt-4 border-t border-gray-100">
                          <p className="text-sm text-muted-foreground">
                            Última atualização: {new Date().toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="privacy" className="m-0">
                    <ScrollArea className="h-[500px] p-6">
                      <div className="space-y-4">
                        <h2 className="text-2xl font-bold">Política de Privacidade</h2>
                        <p className="text-muted-foreground">Última atualização: 15 de Outubro de 2023</p>
                        
                        <div>
                          <h2 className="text-xl font-bold mb-3 text-primary">1. Informações Coletadas</h2>
                          <p className="text-muted-foreground mb-3">
                            Coletamos os seguintes tipos de informações:
                          </p>
                          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                            <li><span className="font-medium">Informações pessoais:</span> Nome, endereço de e-mail, informações de pagamento e nomes de usuário em plataformas sociais.</li>
                            <li><span className="font-medium">Informações de uso:</span> Como você interage com nosso site, serviços que você adquire e preferências.</li>
                            <li><span className="font-medium">Informações técnicas:</span> Endereço IP, tipo de navegador, provedor de serviços de Internet, páginas de referência/saída, sistema operacional, data/hora e dados de clickstream.</li>
                          </ul>
                        </div>

                        <div>
                          <h2 className="text-xl font-bold mb-3 text-primary">2. Como Usamos Suas Informações</h2>
                          <p className="text-muted-foreground mb-3">
                            Utilizamos as informações coletadas para:
                          </p>
                          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                            <li>Fornecer, manter e melhorar nossos serviços;</li>
                            <li>Processar transações e enviar notificações relacionadas;</li>
                            <li>Enviar informações sobre novidades, ofertas especiais e promoções;</li>
                            <li>Monitorar o uso dos nossos serviços e analisar tendências;</li>
                            <li>Prevenir atividades fraudulentas e proteger os direitos de nossos usuários.</li>
                          </ul>
                        </div>

                        <div>
                          <h2 className="text-xl font-bold mb-3 text-primary">3. Compartilhamento de Informações</h2>
                          <p className="text-muted-foreground mb-3">
                            Podemos compartilhar suas informações com:
                          </p>
                          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                            <li><span className="font-medium">Prestadores de serviços:</span> Empresas que nos ajudam a fornecer serviços, como processadores de pagamento.</li>
                            <li><span className="font-medium">Parceiros de negócios:</span> Podemos compartilhar informações limitadas com parceiros comerciais para oferecer certos produtos, serviços ou promoções.</li>
                            <li><span className="font-medium">Conformidade legal:</span> Quando exigido por lei ou quando acreditamos de boa fé que tal ação é necessária para cumprir um processo legal.</li>
                          </ul>
                        </div>

                        <div>
                          <h2 className="text-xl font-bold mb-3 text-primary">4. Cookies e Tecnologias Semelhantes</h2>
                          <p className="text-muted-foreground mb-3">
                            Utilizamos cookies e tecnologias semelhantes para coletar e armazenar informações quando você visita nosso site. Você pode controlar o uso de cookies no nível do navegador, mas isso pode limitar sua capacidade de usar certos recursos do nosso site.
                          </p>
                        </div>

                        <div>
                          <h2 className="text-xl font-bold mb-3 text-primary">5. Segurança dos Dados</h2>
                          <p className="text-muted-foreground mb-3">
                            Implementamos medidas de segurança apropriadas para proteger contra acesso não autorizado, alteração, divulgação ou destruição de suas informações pessoais. No entanto, nenhum método de transmissão pela Internet ou método de armazenamento eletrônico é 100% seguro.
                          </p>
                        </div>

                        <div>
                          <h2 className="text-xl font-bold mb-3 text-primary">6. Seus Direitos</h2>
                          <p className="text-muted-foreground mb-3">
                            De acordo com a Lei Geral de Proteção de Dados (LGPD) do Brasil, você tem os seguintes direitos:
                          </p>
                          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                            <li>Direito de acesso às suas informações pessoais;</li>
                            <li>Direito de retificação de dados incompletos, inexatos ou desatualizados;</li>
                            <li>Direito de eliminar seus dados pessoais em determinadas circunstâncias;</li>
                            <li>Direito de portabilidade dos dados;</li>
                            <li>Direito de revogar seu consentimento a qualquer momento.</li>
                          </ul>
                        </div>

                        <div>
                          <h2 className="text-xl font-bold mb-3 text-primary">7. Retenção de Dados</h2>
                          <p className="text-muted-foreground mb-3">
                            Manteremos suas informações pessoais apenas pelo tempo necessário para cumprir os propósitos descritos nesta Política de Privacidade, a menos que um período de retenção mais longo seja exigido ou permitido por lei.
                          </p>
                        </div>

                        <div>
                          <h2 className="text-xl font-bold mb-3 text-primary">8. Menores de Idade</h2>
                          <p className="text-muted-foreground mb-3">
                            Nossos serviços não se destinam a pessoas com menos de 18 anos. Não coletamos intencionalmente informações pessoais de crianças menores de 18 anos. Se tomarmos conhecimento de que coletamos informações pessoais de uma criança menor de 18 anos, tomaremos medidas para remover essas informações.
                          </p>
                        </div>

                        <div>
                          <h2 className="text-xl font-bold mb-3 text-primary">9. Alterações na Política de Privacidade</h2>
                          <p className="text-muted-foreground mb-3">
                            Podemos atualizar esta Política de Privacidade de tempos em tempos. Informaremos sobre quaisquer alterações publicando a nova Política de Privacidade nesta página e, se as alterações forem significativas, enviaremos um aviso mais proeminente.
                          </p>
                        </div>

                        <div>
                          <h2 className="text-xl font-bold mb-3 text-primary">10. Contato</h2>
                          <p className="text-muted-foreground mb-3">
                            Se você tiver dúvidas sobre esta Política de Privacidade, entre em contato conosco em:
                          </p>
                          <p className="text-muted-foreground pl-5">
                            E-mail: contato@impulsegram.com<br />
                            Telefone: (12) 12 98145-7975
                          </p>
                        </div>

                        <div className="pt-4 border-t border-gray-100">
                          <p className="text-sm text-muted-foreground">
                            Última atualização: {new Date().toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>

            <div className="mt-8 flex justify-center">
              <Button
                variant="outline"
                className="rounded-full gap-2"
                asChild
              >
                <Link to="/">
                  <ArrowLeftIcon className="w-4 h-4" />
                  Voltar ao Início
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default TermsAndPrivacy; 