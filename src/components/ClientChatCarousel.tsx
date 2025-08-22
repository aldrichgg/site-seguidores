import React, { useState } from "react";

import chat1 from "@/assets/imgs/WhatsApp_Image_2025-07-24_at_23.06.57.jpeg";
import chat2 from "@/assets/imgs/WhatsApp_Image_2025-07-24_at_23.06.58_1.jpeg";
import chat3 from "@/assets/imgs/WhatsApp_Image_2025-07-24_at_23.06.58_2.jpeg";
import chat4 from "@/assets/imgs/WhatsApp_Image_2025-07-24_at_23.06.58.jpeg";
import chat5 from "@/assets/imgs/WhatsApp_Image_2025-07-24_at_23.06.59_1.jpeg";
import chat6 from "@/assets/imgs/WhatsApp_Image_2025-07-24_at_23.06.59_2.jpeg";
import chat7 from "@/assets/imgs/WhatsApp_Image_2025-07-24_at_23.06.59_3.jpeg";
import chat8 from "@/assets/imgs/WhatsApp_Image_2025-07-24_at_23.06.59.jpeg";
import chat9 from "@/assets/imgs/WhatsApp_Image_2025-07-24_at_23.13.54.jpeg";
import chat10 from "@/assets/imgs/WhatsApp_Image_2025-07-24_at_23.13.55_1.jpeg";
import chat11 from "@/assets/imgs/WhatsApp_Image_2025-07-24_at_23.13.55_2.jpeg";
import chat12 from "@/assets/imgs/WhatsApp_Image_2025-07-24_at_23.13.55_3.jpeg";
import chat13 from "@/assets/imgs/WhatsApp_Image_2025-07-24_at_23.13.55.jpeg";

const images = [
  chat1, chat2, chat3, chat4, chat5, chat6, chat7,
  chat8, chat9, chat10, chat11, chat12, chat13,
];

const VISIBLE = 4;

const ClientChatCarousel = () => {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((c) => (c + 1) % images.length);
  const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);

  const getVisible = () =>
    Array.from({ length: Math.min(VISIBLE, images.length) }, (_, i) => {
      const index = (current + i) % images.length;
      return { src: images[index], index };
    });

  const isIndexVisible = (idx: number) => {
    for (let i = 0; i < Math.min(VISIBLE, images.length); i++) {
      if ((current + i) % images.length === idx) return true;
    }
    return false;
  };

  const navDisabled = images.length <= 1;

  return (
    <div className="w-full max-w-7xl mx-auto mb-12">
      {/* Título da seção */}
      <div className="text-center mb-6">
        <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">
          <span className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            O que nossos clientes dizem
          </span>
        </h3>
        <div className="mx-auto mt-2 h-1 w-28 rounded-full bg-primary/90"></div>
        <p className="text-muted-foreground max-w-2xl mx-auto">História de sucesso para quem confiou na impulsegram para crescer!</p>
      </div>

      {/* Carrossel */}
      <div className="relative">
        <button
          onClick={prev}
          disabled={navDisabled}
          className="absolute -left-3 md:-left-6 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/90 p-3 shadow ring-1 ring-black/5 hover:bg-white disabled:opacity-40"
          aria-label="Anterior"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                  className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
        </button>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {getVisible().map((img) => (
            <div
              key={img.index}
              className="rounded-xl overflow-hidden shadow-sm transition-transform duration-200 hover:-translate-y-0.5"
            >
              <img
                src={img.src}
                alt={`Conversa ${img.index + 1}`}
                className="w-full h-64 md:h-80 lg:h-96 object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        <button
          onClick={next}
          disabled={navDisabled}
          className="absolute -right-3 md:-right-6 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/90 p-3 shadow ring-1 ring-black/5 hover:bg-white disabled:opacity-40"
          aria-label="Próximo"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
        </button>
      </div>

      {/* Indicadores */}
      <div className="flex justify-center gap-2 mt-4">
        {images.map((_, idx) => (
          <span
            key={idx}
            className={`h-2 w-2 rounded-full transition-colors ${
              isIndexVisible(idx) ? "bg-primary" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ClientChatCarousel;
