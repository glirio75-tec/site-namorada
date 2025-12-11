import React, { useState } from 'react';
import { ScrollText, X, Music2 } from 'lucide-react';

const SONG_TITLE = "Do Jeito Que Eu Imaginei";
const LYRICS = `Se um dia eu te encontrar
Do jeito que sonhei
Quem sabe ser seu par
Perfeito e te amar
Do jeito que eu imaginei

Ao virar a esquina
Atrás de uma cortina me perder
No escuro com você
Fogo na fogueira
O seu beijo e o desejo em seu olhar
As flores no altar

Véu e grinalda, lua de mel
Chuva de arroz e tudo depois
Dama de honra, pega o buquê
Ninguém mais feliz que eu e você

Vai ser um dia eu te encontrar
Do jeito que sonhei
Quem sabe ser seu par
Perfeito e te amar
Do jeito que eu imaginei`;

const LyricsOverlay: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-40 w-10 h-10 flex items-center justify-center bg-vg-blue-light/20 hover:bg-vg-yellow/20 text-vg-yellow rounded-full backdrop-blur-md border border-vg-yellow/30 shadow-lg transition-all duration-300 hover:scale-110 group"
        title="Ver Letra da Música"
      >
        <ScrollText className="w-5 h-5" />
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-vg-blue-dark/90 text-vg-yellow text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-vg-yellow/20">
          Nossa Música
        </span>
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div 
            className="absolute inset-0 bg-vg-blue-dark/90 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          <div className="relative w-full max-w-md bg-gradient-to-b from-vg-blue-mid to-vg-blue-dark border border-vg-yellow/20 rounded-2xl shadow-[0_0_50px_rgba(244,211,94,0.15)] overflow-hidden flex flex-col max-h-[80vh]">
            
            {/* Header */}
            <div className="p-4 border-b border-white/5 bg-white/5 flex justify-between items-center sticky top-0 z-10">
              <div className="flex items-center gap-2 text-vg-yellow">
                <Music2 className="w-5 h-5" />
                <h3 className="font-script text-2xl tracking-wide">{SONG_TITLE}</h3>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/50 hover:text-white transition-colors p-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto p-8 text-center custom-scrollbar">
              <div className="space-y-6">
                <p className="font-serif text-lg md:text-xl leading-relaxed text-gray-200 whitespace-pre-line drop-shadow-sm">
                  {LYRICS}
                </p>
                <div className="pt-4 flex justify-center opacity-50">
                  <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-vg-yellow to-transparent"></div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default LyricsOverlay;