import React, { memo, useState, useRef, useEffect } from 'react';
import { ImagePlus, Upload, Heart } from 'lucide-react';

interface MemoryCardProps {
  id: number;
  photoUrl: string;
  title: string;
  poem: string;
  icon: React.ReactNode;
  delay: number;
}

const MemoryCard: React.FC<MemoryCardProps> = ({ id, photoUrl, title, poem, icon, delay }) => {
  const [imgSrc, setImgSrc] = useState(photoUrl);
  const [imageError, setImageError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Chave única para salvar esta foto específica no navegador
  const storageKey = `memory_photo_${id}`;

  useEffect(() => {
    // 1. Tenta carregar do LocalStorage (memória do navegador)
    const savedImage = localStorage.getItem(storageKey);
    
    if (savedImage) {
      setImgSrc(savedImage);
      setImageError(false);
    } else {
      // 2. Se não tiver salvo, usa o padrão (arquivo local)
      setImgSrc(photoUrl);
    }
  }, [photoUrl, storageKey]);

  const fileName = photoUrl.split('/').pop();

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      
      reader.onloadend = () => {
        const base64String = reader.result as string;
        try {
          // Tenta salvar permanentemente no navegador
          localStorage.setItem(storageKey, base64String);
          setImgSrc(base64String);
          setImageError(false);
        } catch (error) {
          console.error("Imagem muito grande para salvar no cache", error);
          alert("Esta imagem é muito pesada para salvar na memória do navegador. Ela será exibida agora, mas pode sumir se recarregar. Tente uma imagem menor ou salve o arquivo na pasta do projeto.");
          // Fallback: mostra a imagem mesmo se não der para salvar permanentemente
          setImgSrc(URL.createObjectURL(file));
          setImageError(false);
        }
      };
      
      reader.readAsDataURL(file);
    }
  };

  return (
    <div 
      className="relative group w-full max-w-md mx-auto my-12 opacity-0"
      style={{ 
        animationFillMode: 'forwards',
        animationName: 'fadeInUp',
        animationDuration: '1s',
        animationDelay: `${delay}ms`,
      }}
    >
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Frame Border */}
      <div className="absolute -inset-1 bg-gradient-to-r from-vg-yellow to-vg-orange rounded-2xl blur opacity-30 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
      
      {/* Card Content */}
      <div className="relative bg-vg-blue-mid border border-white/10 rounded-2xl p-6 shadow-2xl overflow-hidden transform transition-all duration-500 hover:-translate-y-2">
        
        {/* Decorative Header Icon */}
        <div className="flex items-center gap-2 mb-4 text-vg-yellow">
          {icon}
          <span className="font-serif text-sm tracking-widest uppercase opacity-80">{title}</span>
        </div>

        {/* Photo Area */}
        <div 
          onClick={handleClick}
          className="relative aspect-[4/5] w-full overflow-hidden rounded-lg mb-6 border-4 border-white/5 shadow-inner bg-vg-blue-dark flex items-center justify-center cursor-pointer group/image hover:border-vg-yellow/30 transition-colors"
          title="Clique para adicionar a foto permanentemente neste dispositivo"
        >
          {!imageError ? (
            <>
              <img 
                src={imgSrc} 
                alt={title} 
                loading="lazy"
                onError={() => setImageError(true)}
                className="w-full h-full object-cover object-center filter sepia-[0.1] contrast-105 transition-transform duration-700 group-hover/image:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-vg-blue-dark/50 to-transparent opacity-60 pointer-events-none"></div>
            </>
          ) : (
            <div className="text-center p-6 text-vg-yellow/70 flex flex-col items-center justify-center gap-3 h-full w-full bg-white/5 group-hover/image:bg-white/10 transition-colors">
              <div className="relative">
                <div className="absolute inset-0 bg-vg-yellow blur-md opacity-20 rounded-full animate-pulse"></div>
                <ImagePlus className="w-10 h-10 relative z-10" />
              </div>
              
              <div className="space-y-1">
                <p className="font-serif font-bold text-lg text-white">Adicionar Foto</p>
                <p className="text-xs text-white/50 px-4">Clique para escolher</p>
              </div>

              <div className="mt-4 pt-4 border-t border-white/10 w-full">
                <p className="text-[10px] text-white/30 font-mono">
                  Arquivo esperado: <br/>
                  <span className="text-vg-yellow">{fileName}</span>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Poem Area */}
        <div className="text-center">
          <p className="font-script text-2xl md:text-3xl leading-relaxed text-gray-100 drop-shadow-md min-h-[4rem]">
            {poem}
          </p>
        </div>

        {/* Decorative footer */}
        <div className="mt-6 flex justify-center opacity-50">
          <div className="w-16 h-1 bg-gradient-to-r from-transparent via-vg-yellow to-transparent rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default memo(MemoryCard);