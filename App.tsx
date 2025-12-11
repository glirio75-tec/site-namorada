import React, { useEffect, useState, useMemo } from 'react';
import StarryBackground from './components/StarryBackground';
import MusicPlayer from './components/MusicPlayer';
import MemoryCard from './components/MemoryCard';
import LyricsOverlay from './components/LyricsOverlay';
import { generateRomanticPoems } from './services/geminiService';
import { Memory } from './types';
import { Palette, BookHeart, Castle, Heart, Play } from 'lucide-react';

// --- ÁREA DE CONFIGURAÇÃO DE MÍDIA ---
// OPÇÃO A (Recomendada): Salve os arquivos na pasta do projeto com estes nomes.
// OPÇÃO B: Cole links diretos da internet.

const FOTOS = {
  arte: "./foto1.jpg",      // Foto 1: Selfie de perto
  livraria: "./foto2.jpg",  // Foto 2: Beijo na livraria
  luz: "./foto3.jpg",       // Foto 3: Corredor branco
  espelho: "./foto4.jpg"    // Foto 4: Selfie no espelho
};

const MUSICA = "./musica.mp3"; // Nome do arquivo de música esperado na pasta
// --------------------------------------

const App: React.FC = () => {
  const [hasStarted, setHasStarted] = useState(false);
  const [poems, setPoems] = useState<string[]>([
    "Carregando versos de estrelas...",
    "Buscando romance nas páginas...",
    "Acendendo lanternas...",
    "Escrevendo nosso amor..."
  ]);
  const [isLoading, setIsLoading] = useState(true);

  // Inicia a geração de poemas apenas após entrar, ou em background
  useEffect(() => {
    const fetchPoems = async () => {
      try {
        const generated = await generateRomanticPoems();
        setPoems(generated);
      } catch (e) {
        console.error("Failed to load poems");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPoems();
  }, []);

  const memories: Memory[] = useMemo(() => [
    {
      id: 1,
      title: "Nossa Arte (Selfie de Perto)",
      theme: 'art',
      imagePlaceholder: FOTOS.arte, 
      defaultPoem: poems[0],
    },
    {
      id: 2,
      title: "Nosso Romance (Livraria)",
      theme: 'books',
      imagePlaceholder: FOTOS.livraria, 
      defaultPoem: poems[1],
    },
    {
      id: 3,
      title: "Minha Luz (Corredor Branco)",
      theme: 'movie',
      imagePlaceholder: FOTOS.luz, 
      defaultPoem: poems[2],
    },
    {
      id: 4,
      title: "Nossa Vida (Espelho)",
      theme: 'love',
      imagePlaceholder: FOTOS.espelho, 
      defaultPoem: poems[3],
    }
  ], [poems]);

  const getIcon = (theme: string) => {
    switch (theme) {
      case 'art': return <Palette className="w-5 h-5" />;
      case 'books': return <BookHeart className="w-5 h-5" />;
      case 'movie': return <Castle className="w-5 h-5" />;
      default: return <Heart className="w-5 h-5" />;
    }
  };

  const handleStart = () => {
    setHasStarted(true);
  };

  if (!hasStarted) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-vg-blue-dark overflow-hidden font-serif">
        <StarryBackground />
        <div className="z-10 text-center p-8 animate-in fade-in zoom-in duration-1000">
          <h1 className="font-script text-5xl md:text-7xl text-vg-yellow mb-8 drop-shadow-[0_0_15px_rgba(244,211,94,0.6)]">
            Para o Amor da Minha Vida
          </h1>
          <button 
            onClick={handleStart}
            className="group relative px-8 py-4 bg-transparent border-2 border-vg-yellow/50 rounded-full text-vg-yellow text-xl tracking-widest hover:bg-vg-yellow hover:text-vg-blue-dark transition-all duration-500 shadow-[0_0_20px_rgba(244,211,94,0.2)] hover:shadow-[0_0_40px_rgba(244,211,94,0.6)]"
          >
            <span className="flex items-center gap-3">
              <Heart className="w-6 h-6 fill-current animate-pulse" />
              ENTRAR
            </span>
          </button>
          <p className="mt-6 text-white/40 text-sm font-light italic">
            Coloque fones de ouvido para a melhor experiência
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen font-serif text-white selection:bg-vg-yellow selection:text-vg-blue-dark pb-20 animate-in fade-in duration-1000">
      <StarryBackground />
      <LyricsOverlay />
      
      {/* O MusicPlayer agora recebe o caminho da música configurado acima */}
      <MusicPlayer shouldPlay={hasStarted} src={MUSICA} />

      <header className="pt-20 pb-10 text-center px-4">
        <h1 className="font-script text-6xl md:text-8xl text-vg-yellow mb-4 drop-shadow-[0_0_10px_rgba(244,211,94,0.5)] animate-float">
          Sob o Céu Estrelado
        </h1>
        <p className="text-xl md:text-2xl opacity-90 font-light tracking-wide max-w-2xl mx-auto">
          Para a minha arte, meu romance favorito e minha luz.
        </p>
      </header>

      <main className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start max-w-5xl">
        {memories.map((memory, index) => (
          <MemoryCard
            key={memory.id}
            id={memory.id}
            title={memory.title}
            photoUrl={memory.imagePlaceholder}
            poem={isLoading ? "Escrevendo..." : poems[index] || memory.defaultPoem}
            icon={getIcon(memory.theme)}
            delay={index * 300}
          />
        ))}
      </main>

      <footer className="text-center py-10 opacity-60 text-sm">
        <p>Feito com amor seu namorado Arthur Matheus</p>
      </footer>
    </div>
  );
};

export default App;