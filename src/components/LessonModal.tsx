"use client";
import { useState, useEffect, useRef } from 'react';
import { X, PlayCircle, CheckCircle2, Volume2, VolumeX, Settings, Play, Pause, Maximize } from 'lucide-react';
import { Modulo } from '../types';

interface LessonModalProps {
  modulo: Modulo | null;
  isOpen: boolean;
  onClose: () => void;
}

export function LessonModal({ modulo, isOpen, onClose }: LessonModalProps) {
  const [aulaAtivaIdx, setAulaAtivaIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<any>(null);

  // 1. Carrega a API do Vimeo e controla o Player
  useEffect(() => {
    if (!isOpen || !iframeRef.current) return;

    const loadVimeoAPI = () => {
      const script = document.createElement('script');
      script.src = "https://player.vimeo.com/api/player.js";
      script.onload = () => {
        // @ts-ignore
        const player = new window.Vimeo.Player(iframeRef.current);
        playerRef.current = player;

        player.on('timeupdate', (data: any) => {
          setProgress(data.percent * 100);
        });

        player.on('play', () => setIsPlaying(true));
        player.on('pause', () => setIsPlaying(false));
        
        // Forçar 1.25x no início
        player.setPlaybackRate(1.25);
      };
      document.body.appendChild(script);
    };

    loadVimeoAPI();
  }, [isOpen, aulaAtivaIdx]);

  if (!isOpen || !modulo) return null;
  const aulaAtual = modulo.aulas[aulaAtivaIdx];

  // FUNÇÕES DE CONTROLE
  const togglePlay = () => {
    if (!playerRef.current) return;
    isPlaying ? playerRef.current.pause() : playerRef.current.play();
  };

  const toggleMute = () => {
    if (!playerRef.current) return;
    playerRef.current.setMuted(!isMuted);
    setIsMuted(!isMuted);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!playerRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    playerRef.current.getDuration().then((duration: number) => {
      playerRef.current.setCurrentTime(duration * percentage);
    });
  };

  const toggleFullscreen = () => {
    if (!playerRef.current) return;
    playerRef.current.requestFullscreen();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 md:p-6 lg:p-12">
      <div className="absolute inset-0 bg-[#020617]/98 backdrop-blur-2xl" onClick={onClose} />
      
      <div className="relative bg-[#0f172a] border border-blue-500/20 w-full max-w-[1400px] h-full md:h-[90vh] md:rounded-[40px] overflow-hidden flex flex-col shadow-[0_0_100px_rgba(37,99,235,0.15)]">
        
        {/* HEADER */}
        <div className="px-8 py-5 border-b border-white/5 flex justify-between items-center bg-[#0f172a]">
          <div className="flex items-center gap-4 text-left">
            <div className="p-2 bg-blue-600/20 rounded-lg border border-blue-500/30 text-blue-400">
              <PlayCircle size={20} />
            </div>
            <div>
              <p className="text-[10px] text-blue-500 font-black uppercase tracking-[0.2em] mb-0.5">Retenção Start // Academy</p>
              <h2 className="text-white font-black italic uppercase text-sm tracking-tight">{modulo.titulo}</h2>
            </div>
          </div>
          <button onClick={onClose} className="hover:bg-red-500/20 p-2 text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          <div className="flex-[3] overflow-y-auto p-4 md:p-8 space-y-6 bg-[#0f172a] custom-scrollbar">
            
            <div className="relative w-full aspect-video rounded-[32px] overflow-hidden bg-black border border-blue-500/30 shadow-2xl group">
                <iframe
                  ref={iframeRef}
                  key={aulaAtual?.id}
                  src={`https://player.vimeo.com/video/${aulaAtual?.videoUrl.split('/').pop()}?autoplay=1&controls=0&background=0`}
                  className="absolute inset-0 w-full h-full border-0 pointer-events-none"
                  allow="autoplay; fullscreen"
                />

                {/* OVERLAY FUNCIONAL RETENÇÃO START */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/90 via-transparent to-transparent">
                    
                    {/* BARRA DE PROGRESSO CLICÁVEL */}
                    <div 
                      className="w-full h-2 bg-white/10 rounded-full mb-6 cursor-pointer group/progress relative"
                      onClick={handleSeek}
                    >
                        <div 
                          className="h-full bg-blue-600 rounded-full shadow-[0_0_15px_#2563eb] transition-all duration-150"
                          style={{ width: `${progress}%` }}
                        />
                        <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full scale-0 group-hover/progress:scale-100 transition-transform shadow-xl" style={{ left: `${progress}%` }} />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <button onClick={togglePlay} className="text-white hover:text-blue-400 transition-all transform active:scale-90">
                                {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" />}
                            </button>
                            
                            <button onClick={toggleMute} className="text-white hover:text-blue-400 transition-colors">
                                {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                            </button>

                            <div className="hidden sm:block">
                                <span className="text-[10px] font-black italic uppercase text-blue-500 tracking-widest">Retenção Start Player v1.0</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="px-3 py-1 bg-blue-600/20 border border-blue-500/30 rounded text-[10px] text-blue-400 font-black">1.25x</div>
                            <Settings size={22} className="text-white hover:text-blue-400 cursor-pointer" />
                            <Maximize onClick={toggleFullscreen} size={22} className="text-white hover:text-blue-400 cursor-pointer" />
                            <span className="text-blue-500 font-black italic text-sm tracking-tighter uppercase ml-4 hidden md:block">
                                RETENÇÃO <span className="text-white">START</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* INFO DA AULA */}
            <div className="text-left space-y-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white/[0.02] p-8 rounded-[32px] border border-white/5">
                <div className="flex-1">
                  <h3 className="text-3xl md:text-5xl font-black italic text-white uppercase tracking-tighter leading-none mb-4">
                    {aulaAtual?.titulo}
                  </h3>
                  <p className="text-slate-400 text-lg leading-relaxed italic opacity-80 max-w-2xl">
                    {aulaAtual?.descricao}
                  </p>
                </div>
                <button className="flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white px-10 py-5 rounded-2xl font-black italic uppercase text-xs transition-all shadow-[0_10px_30px_rgba(37,99,235,0.3)] shrink-0">
                  <CheckCircle2 size={18} />
                  Concluir Aula
                </button>
              </div>
            </div>
          </div>

          {/* CRONOGRAMA */}
          <div className="flex-1 bg-[#0a0f1d]/60 border-l border-white/5 flex flex-col overflow-hidden">
            <div className="p-6 border-b border-white/5 text-left">
              <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">Próximas Aulas</h4>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {modulo.aulas.map((aula, idx) => (
                <button
                  key={aula.id}
                  onClick={() => setAulaAtivaIdx(idx)}
                  className={`w-full flex items-center gap-4 p-4 rounded-[24px] border transition-all ${
                    aulaAtivaIdx === idx 
                    ? 'bg-blue-600 border-blue-400 shadow-lg' 
                    : 'bg-white/5 border-transparent hover:bg-white/10'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${
                    aulaAtivaIdx === idx ? 'bg-white text-blue-600' : 'bg-[#0f172a] text-slate-500'
                  }`}>
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                  <p className={`text-xs font-black uppercase truncate text-left flex-1 ${aulaAtivaIdx === idx ? 'text-white' : 'text-slate-300'}`}>
                    {aula.titulo}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}