"use client";
import { useState, useEffect, useRef } from 'react';
import { X, PlayCircle, CheckCircle2, Volume2, VolumeX, Play, Pause, Settings } from 'lucide-react';
import { Modulo } from '../types';

interface LessonModalProps {
  modulo: Modulo | null;
  isOpen: boolean;
  onClose: () => void;
}

export function LessonModal({ modulo, isOpen, onClose }: LessonModalProps) {
  const [aulaAtivaIdx, setAulaAtivaIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0); // 0 a 100
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    if (!isOpen || !iframeRef.current) return;

    const script = document.createElement('script');
    script.src = "https://player.vimeo.com/api/player.js";
    script.onload = () => {
      // @ts-ignore
      const player = new window.Vimeo.Player(iframeRef.current);
      playerRef.current = player;

      // Configurações Iniciais
      player.setMuted(false);
      player.setPlaybackRate(1.25);
      
      // Listeners de Eventos
      player.on('play', () => setIsPlaying(true));
      player.on('pause', () => setIsPlaying(false));
      
      player.on('timeupdate', (data: { percent: number }) => {
        setProgress(data.percent * 100);
      });

      // Garantir que comece desmutado
      player.setVolume(1);
    };
    document.body.appendChild(script);

    return () => {
      if (playerRef.current) {
        playerRef.current.off('play');
        playerRef.current.off('pause');
        playerRef.current.off('timeupdate');
      }
    };
  }, [isOpen, aulaAtivaIdx]);

  if (!isOpen || !modulo) return null;
  const aulaAtual = modulo.aulas[aulaAtivaIdx];

  const handlePlayPause = () => {
    if (!playerRef.current) return;
    isPlaying ? playerRef.current.pause() : playerRef.current.play();
  };

  const handleMute = () => {
    if (!playerRef.current) return;
    playerRef.current.getMuted().then((muted: boolean) => {
      playerRef.current.setMuted(!muted);
      setIsMuted(!muted);
    });
  };

  // Função para avançar/retroceder clicando na barra
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!playerRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    playerRef.current.getDuration().then((duration: number) => {
      playerRef.current.setCurrentTime(duration * percentage);
    });
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 md:p-6 lg:p-12 text-left">
      <div className="absolute inset-0 bg-[#020617]/98 backdrop-blur-2xl" onClick={onClose} />
      
      <div className="relative bg-[#0f172a] border border-blue-500/20 w-full max-w-[1400px] h-full md:h-[90vh] md:rounded-[40px] overflow-hidden flex flex-col shadow-2xl">
        
        {/* HEADER */}
        <div className="px-8 py-5 border-b border-white/5 flex justify-between items-center bg-[#0f172a]">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-blue-600/20 rounded-lg text-blue-400">
              <PlayCircle size={20} />
            </div>
            <div>
              <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest mb-0.5">Retenção Start</p>
              <h2 className="text-white font-black italic uppercase text-sm">{modulo.titulo}</h2>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          <div className="flex-[3] overflow-y-auto p-4 md:p-8 space-y-6 bg-[#0f172a] custom-scrollbar">
            
            {/* CONTAINER DO PLAYER */}
            <div className="relative w-full aspect-video rounded-[32px] overflow-hidden bg-black border border-blue-500/30 group">
                <iframe
                  ref={iframeRef}
                  key={aulaAtual?.id}
                  // Mudamos background=1 para background=0 e controls=0 para permitir áudio e API
                  src={`https://player.vimeo.com/video/${aulaAtual?.videoUrl.split('/').pop()}?autoplay=1&controls=0&background=0&muted=0`}
                  className="absolute inset-0 w-full h-full border-0 pointer-events-none"
                  allow="autoplay; fullscreen"
                />
                
                {/* OVERLAY DE CONTROLES */}
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6">
                    
                    {/* BARRA DE PROGRESSO */}
                    <div 
                      className="w-full h-1.5 bg-white/20 rounded-full mb-6 cursor-pointer relative group/progress overflow-hidden"
                      onClick={handleProgressClick}
                    >
                        <div 
                          className="absolute top-0 left-0 h-full bg-blue-600 transition-all duration-150"
                          style={{ width: `${progress}%` }}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <button onClick={handlePlayPause} className="bg-blue-600 p-4 rounded-full text-white shadow-2xl hover:scale-110 transition-transform">
                            {isPlaying ? <Pause size={24} fill="white" /> : <Play size={24} fill="white" />}
                        </button>

                        <div className="flex items-center gap-4">
                            <button onClick={handleMute} className="text-white hover:text-blue-400 transition-colors">
                                {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                            </button>
                            <div className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded text-[10px] text-blue-400 font-bold uppercase">
                                1.25x
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* BARRA DE INFO E RESOLUÇÃO */}
            <div className="bg-white/[0.02] p-6 rounded-[32px] border border-white/5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex gap-4">
                <button onClick={handlePlayPause} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-black italic uppercase text-[10px] flex items-center gap-2">
                  {isPlaying ? <Pause size={14} /> : <Play size={14} />} {isPlaying ? "Pausar" : "Retomar"}
                </button>
                <div className="px-6 py-3 bg-white/5 rounded-xl border border-white/10 text-[10px] text-slate-400 font-bold uppercase flex items-center gap-2">
                  <Settings size={14} /> Auto Resolução
                </div>
              </div>
              <span className="text-blue-500 font-black italic text-xs uppercase tracking-tighter">RETENÇÃO START PLAYER V2</span>
            </div>

            <div className="p-8 bg-white/[0.01] rounded-[32px] border border-white/5">
              <h3 className="text-3xl md:text-5xl font-black italic text-white uppercase tracking-tighter mb-4">{aulaAtual?.titulo}</h3>
              <p className="text-slate-400 text-lg leading-relaxed italic">{aulaAtual?.descricao}</p>
            </div>
          </div>

          {/* LISTA LATERAL */}
          <div className="flex-1 bg-[#0a0f1d]/60 border-l border-white/5 flex flex-col overflow-hidden">
            <div className="p-6 border-b border-white/5 text-[10px] font-black text-blue-500 uppercase tracking-widest">Aulas</div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {modulo.aulas.map((aula, idx) => (
                <button
                  key={aula.id}
                  onClick={() => setAulaAtivaIdx(idx)}
                  className={`w-full flex items-center gap-4 p-4 rounded-[24px] border transition-all ${aulaAtivaIdx === idx ? 'bg-blue-600 border-blue-400 shadow-lg' : 'bg-white/5 border-transparent hover:bg-white/10'}`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${aulaAtivaIdx === idx ? 'bg-white text-blue-600' : 'bg-slate-800 text-slate-500'}`}>
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                  <p className={`text-xs font-black uppercase truncate flex-1 ${aulaAtivaIdx === idx ? 'text-white' : 'text-slate-300'}`}>{aula.titulo}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}