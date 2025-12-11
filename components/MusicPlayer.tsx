import React, { useState, useRef, useEffect } from 'react';
import { Volume2, Play, Pause, Music, Upload } from 'lucide-react';

interface MusicPlayerProps {
  shouldPlay?: boolean;
  src: string;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ shouldPlay, src }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioSrc, setAudioSrc] = useState(src);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const STORAGE_KEY = 'bg_music_file';

  // Carrega música salva no navegador ao iniciar
  useEffect(() => {
    const savedMusic = localStorage.getItem(STORAGE_KEY);
    if (savedMusic) {
      setAudioSrc(savedMusic);
    } else {
      setAudioSrc(src);
    }
  }, [src]);

  // Gerencia o autoplay
  useEffect(() => {
    if (shouldPlay && audioRef.current) {
      // Tenta tocar apenas se tiver uma fonte válida
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch(error => {
            console.log("Autoplay prevented or no source:", error);
            setIsPlaying(false);
          });
      }
    }
  }, [shouldPlay, audioSrc]);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.error("Playback failed", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        try {
          // Tenta salvar no navegador
          localStorage.setItem(STORAGE_KEY, result);
          setAudioSrc(result);
          // Reinicia e toca
          setTimeout(() => {
            if(audioRef.current) {
               audioRef.current.play().then(() => setIsPlaying(true));
            }
          }, 100);
        } catch (error) {
          alert("O arquivo de música é muito grande para salvar na memória do navegador. Tente um arquivo menor ou coloque 'musica.mp3' na pasta do site.");
          // Usa temporariamente mesmo se falhar o salvamento
          setAudioSrc(result);
          setTimeout(() => {
            if(audioRef.current) {
               audioRef.current.play().then(() => setIsPlaying(true));
            }
          }, 100);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      <audio ref={audioRef} src={audioSrc} loop onError={() => setIsPlaying(false)} />
      
      {/* Hidden Input for Upload */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="audio/*" 
        className="hidden" 
      />

      <div className="flex items-center gap-2">
        {/* Upload Button (Small) */}
        <button
          onClick={handleUploadClick}
          className="w-8 h-8 rounded-full bg-vg-blue-mid/80 border border-vg-yellow/30 text-vg-yellow/70 hover:text-vg-yellow hover:bg-white/10 flex items-center justify-center transition-all"
          title="Alterar Música"
        >
          <Upload className="w-4 h-4" />
        </button>

        {/* Controls Container */}
        <div className="flex items-center gap-2 bg-vg-blue-mid/80 backdrop-blur-md p-2 rounded-full border border-vg-yellow/30 shadow-[0_0_15px_rgba(244,211,94,0.3)] transition-all duration-300 hover:scale-105">
          
          {/* Play/Pause Button */}
          <button
            onClick={toggleMusic}
            className="w-12 h-12 rounded-full bg-vg-yellow hover:bg-vg-orange text-vg-blue-dark flex items-center justify-center shadow-lg transition-colors"
            aria-label="Toggle Music"
          >
            {isPlaying ? (
              <div className="relative">
                <Volume2 className="w-6 h-6 animate-pulse" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
              </div>
            ) : (
              <Play className="w-6 h-6 ml-1" />
            )}
          </button>
        </div>
      </div>
      
      {/* Hint if not playing */}
      {!isPlaying && shouldPlay && (
        <div className="text-right">
             <span className="text-xs text-vg-yellow/80 font-serif bg-black/40 px-2 py-1 rounded block mb-1">
              Toque no play
            </span>
             <span className="text-[10px] text-white/40 font-serif">
              Sem som? Clique no ícone de upload
            </span>
        </div>
       
      )}
    </div>
  );
};

export default MusicPlayer;