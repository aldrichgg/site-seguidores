import React from "react";

const TestimonialsSection: React.FC = () => {
    return (
        <section className="py-12 md:py-20 px-3 md:px-4 bg-secondary/50 relative">
            {/* Background pattern */}
            <div className="absolute inset-0 bg-mesh-1 opacity-50 pointer-events-none" />
            
            <div className="w-full max-w-[1200px] mx-auto bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-4 md:p-8 shadow-lg">
                <div className="text-center mb-6 md:mb-10">
                    <h2 className="text-2xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                        Mais de 10.000 clientes satisfeitos!
                    </h2>
                    <p className="text-base md:text-xl text-gray-600 max-w-2xl mx-auto">
                        Descubra o que nossos clientes estão dizendo sobre nossa entrega rápida e resultados
                        impressionantes.
                    </p>
                </div>

                <div className="relative overflow-hidden">
                    <div className="flex space-x-4 md:space-x-6 animate-scroll-mobile md:animate-scroll">
                        {/* Testimonial Card 1 */}
                        <div className="min-w-[280px] md:min-w-[350px] bg-white rounded-xl shadow-md p-4 md:p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-primary-200">
                            <div className="flex items-center mb-3 md:mb-4">
                                <img
                                    src="https://randomuser.me/api/portraits/women/23.jpg"
                                    alt="Cliente"
                                    className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover border-2 border-primary-300"
                                />
                                <div className="ml-3 md:ml-4">
                                    <h3 className="font-bold text-base md:text-lg">Amanda Silva</h3>
                                    <div className="flex items-center">
                                        <i className="fa-brands fa-instagram text-pink-600 mr-2"></i>
                                        <span className="text-gray-600 text-xs md:text-sm">@amanda.style</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex mb-2 md:mb-3 text-yellow-400">
                                <i className="fa-solid fa-star text-sm md:text-base"></i>
                                <i className="fa-solid fa-star text-sm md:text-base"></i>
                                <i className="fa-solid fa-star text-sm md:text-base"></i>
                                <i className="fa-solid fa-star text-sm md:text-base"></i>
                                <i className="fa-solid fa-star text-sm md:text-base"></i>
                            </div>
                            <p className="text-gray-700 text-sm md:text-base">
                                Meu engajamento triplicou em apenas uma semana! Entrega super rápida e os seguidores são
                                de qualidade. Recomendo muito!
                            </p>
                            <div className="mt-3 md:mt-4 flex flex-wrap gap-2">
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                                    Entrega Rápida
                                </span>
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                                    Compra Verificada
                                </span>
                            </div>
                        </div>

                        {/* Testimonial Card 2 */}
                        <div className="min-w-[280px] md:min-w-[350px] bg-white rounded-xl shadow-md p-4 md:p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-primary-200">
                            <div className="flex items-center mb-3 md:mb-4">
                                <img
                                    src="https://randomuser.me/api/portraits/men/46.jpg"
                                    alt="Cliente"
                                    className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover border-2 border-primary-300"
                                />
                                <div className="ml-3 md:ml-4">
                                    <h3 className="font-bold text-base md:text-lg">Carlos Mendes</h3>
                                    <div className="flex items-center">
                                        <i className="fa-brands fa-youtube text-red-600 mr-2"></i>
                                        <span className="text-gray-600 text-xs md:text-sm">CarlosTech</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex mb-2 md:mb-3 text-yellow-400">
                                <i className="fa-solid fa-star text-sm md:text-base"></i>
                                <i className="fa-solid fa-star text-sm md:text-base"></i>
                                <i className="fa-solid fa-star text-sm md:text-base"></i>
                                <i className="fa-solid fa-star text-sm md:text-base"></i>
                                <i className="fa-solid fa-star-half-alt text-sm md:text-base"></i>
                            </div>
                            <p className="text-gray-700 text-sm md:text-base">
                                Meu canal cresceu exponencialmente após a compra. Agora consigo monetizar meus vídeos e
                                obter parcerias. Serviço excelente!
                            </p>
                            <div className="mt-3 md:mt-4 flex flex-wrap gap-2">
                                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full font-medium">
                                    Crescimento Orgânico
                                </span>
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                                    Clientes Reais
                                </span>
                            </div>
                        </div>

                        {/* Testimonial Card 3 */}
                        <div className="min-w-[280px] md:min-w-[350px] bg-white rounded-xl shadow-md p-4 md:p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-primary-200">
                            <div className="flex items-center mb-3 md:mb-4">
                                <img
                                    src="https://randomuser.me/api/portraits/women/65.jpg"
                                    alt="Cliente"
                                    className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover border-2 border-primary-300"
                                />
                                <div className="ml-3 md:ml-4">
                                    <h3 className="font-bold text-base md:text-lg">Juliana Passos</h3>
                                    <div className="flex items-center">
                                        <i className="fa-brands fa-tiktok text-black mr-2"></i>
                                        <span className="text-gray-600 text-xs md:text-sm">@ju.dances</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex mb-2 md:mb-3 text-yellow-400">
                                <i className="fa-solid fa-star text-sm md:text-base"></i>
                                <i className="fa-solid fa-star text-sm md:text-base"></i>
                                <i className="fa-solid fa-star text-sm md:text-base"></i>
                                <i className="fa-solid fa-star text-sm md:text-base"></i>
                                <i className="fa-solid fa-star text-sm md:text-base"></i>
                            </div>
                            <p className="text-gray-700 text-sm md:text-base">
                                Finalmente meus vídeos estão viralizando! Os seguidores novos realmente interagem com
                                meu conteúdo. Compra 100% segura!
                            </p>
                            <div className="mt-3 md:mt-4 flex flex-wrap gap-2">
                                <span className="text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded-full font-medium">
                                    Maior Alcance
                                </span>
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                                    Suporte Excelente
                                </span>
                            </div>
                        </div>

                        {/* Testimonial Card 4 */}
                        <div className="min-w-[280px] md:min-w-[350px] bg-white rounded-xl shadow-md p-4 md:p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-primary-200">
                            <div className="flex items-center mb-3 md:mb-4">
                                <img
                                    src="https://randomuser.me/api/portraits/men/32.jpg"
                                    alt="Cliente"
                                    className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover border-2 border-primary-300"
                                />
                                <div className="ml-3 md:ml-4">
                                    <h3 className="font-bold text-base md:text-lg">Pedro Almeida</h3>
                                    <div className="flex items-center">
                                        <i className="fa-brands fa-facebook text-blue-600 mr-2"></i>
                                        <span className="text-gray-600 text-xs md:text-sm">Pedro Fitness</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex mb-2 md:mb-3 text-yellow-400">
                                <i className="fa-solid fa-star text-sm md:text-base"></i>
                                <i className="fa-solid fa-star text-sm md:text-base"></i>
                                <i className="fa-solid fa-star text-sm md:text-base"></i>
                                <i className="fa-solid fa-star text-sm md:text-base"></i>
                                <i className="fa-solid fa-star text-sm md:text-base"></i>
                            </div>
                            <p className="text-gray-700 text-sm md:text-base">
                                Minha página de treinos decolou após o serviço. Consegui mais credibilidade e agora
                                marcas me procuram para parcerias!
                            </p>
                            <div className="mt-3 md:mt-4 flex flex-wrap gap-2">
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                                    Mais Credibilidade
                                </span>
                                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-medium">
                                    Compra Segura
                                </span>
                            </div>
                        </div>

                        {/* Testimonial Card 5 */}
                        <div className="min-w-[280px] md:min-w-[350px] bg-white rounded-xl shadow-md p-4 md:p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-primary-200">
                            <div className="flex items-center mb-3 md:mb-4">
                                <img
                                    src="https://randomuser.me/api/portraits/women/41.jpg"
                                    alt="Cliente"
                                    className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover border-2 border-primary-300"
                                />
                                <div className="ml-3 md:ml-4">
                                    <h3 className="font-bold text-base md:text-lg">Fernanda Costa</h3>
                                    <div className="flex items-center">
                                        <i className="fa-brands fa-instagram text-pink-600 mr-2"></i>
                                        <span className="text-gray-600 text-xs md:text-sm">@fe.beauty</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex mb-2 md:mb-3 text-yellow-400">
                                <i className="fa-solid fa-star text-sm md:text-base"></i>
                                <i className="fa-solid fa-star text-sm md:text-base"></i>
                                <i className="fa-solid fa-star text-sm md:text-base"></i>
                                <i className="fa-solid fa-star text-sm md:text-base"></i>
                                <i className="fa-solid fa-star text-sm md:text-base"></i>
                            </div>
                            <p className="text-gray-700 text-sm md:text-base">
                                Os resultados superaram minhas expectativas! Crescimento real e orgânico. Fiz três
                                compras e sempre entregaram mais do que prometido.
                            </p>
                            <div className="mt-3 md:mt-4 flex flex-wrap gap-2">
                                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full font-medium">
                                    Cliente VIP
                                </span>
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                                    Resultados Comprovados
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="absolute top-0 bottom-0 left-0 w-8 md:w-12 bg-gradient-to-r from-primary-50 to-transparent"></div>
                    <div className="absolute top-0 bottom-0 right-0 w-8 md:w-12 bg-gradient-to-l from-primary-50 to-transparent"></div>
                </div>

                <div className="mt-8 md:mt-12 flex flex-col items-center">
                    <div className="grid grid-cols-2 md:flex md:flex-wrap justify-center gap-2 md:gap-4 mb-6 md:mb-8">
                        <div className="flex items-center bg-white p-2 md:p-3 rounded-lg shadow-md">
                            <span className="material-symbols-outlined text-green-600 text-xl md:text-2xl mr-1 md:mr-2">verified</span>
                            <span className="font-medium text-sm md:text-base">Compra 100% Segura</span>
                        </div>
                        <div className="flex items-center bg-white p-2 md:p-3 rounded-lg shadow-md">
                            <span className="material-symbols-outlined text-blue-600 text-xl md:text-2xl mr-1 md:mr-2">people</span>
                            <span className="font-medium text-sm md:text-base">Seguidores Reais</span>
                        </div>
                        <div className="flex items-center bg-white p-2 md:p-3 rounded-lg shadow-md">
                            <span className="material-symbols-outlined text-yellow-600 text-xl md:text-2xl mr-1 md:mr-2">
                                rocket_launch
                            </span>
                            <span className="font-medium text-sm md:text-base">Entrega Imediata</span>
                        </div>
                        <div className="flex items-center bg-white p-2 md:p-3 rounded-lg shadow-md">
                            <span className="material-symbols-outlined text-purple-600 text-xl md:text-2xl mr-1 md:mr-2">
                                support_agent
                            </span>
                            <span className="font-medium text-sm md:text-base">Suporte 24/7</span>
                        </div>
                    </div>

                    <button className="bg-primary hover:bg-primary/90 text-white font-bold py-3 md:py-4 px-5 md:px-10 rounded-full text-sm md:text-base transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center group w-full md:w-auto justify-center">
                        <span>Junte-se aos nossos clientes satisfeitos!</span>
                        <span className="material-symbols-outlined ml-2 group-hover:translate-x-1 transition-transform">
                            arrow_forward
                        </span>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
