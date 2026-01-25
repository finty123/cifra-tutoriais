"use client";
import { useState, useEffect } from 'react';
import { X, PlayCircle, CheckCircle2, Volume2, Settings } from 'lucide-react';
import { Modulo } from '../types';

interface LessonModalProps {
  modulo: Modulo | null;
  isOpen: boolean;
  onClose: () => void;
}

export function LessonModal({ modulo, isOpen, onClose }: LessonModalProps) {
  const [aulaAtivaIdx, setAulaAtivaIdx] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsLoaded(true);
    }
    return () => setIsLoaded(false);
  }, [isOpen, aulaAtivaIdx]);

  if (!isOpen || !modulo) return null;

  const aulaAtual = modulo.aulas[aulaAtivaIdx];

  // Função que gera a URL com os parâmetros de cor azul e velocidade
  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    
    // Configuração para Vimeo (Cor Azul 2563eb + Velocidade 1.25)
    if (url.includes('vimeo.com')) {
      const id = url.split('/').pop();
      return `https://player.vimeo.com/video/${id}?autoplay=1&color=2563eb&title=0&byline=0&portrait=0&speed=1`;
    }
    
    // Configuração para YouTube (Modest Branding + 1.25x via API se possível)
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const id = url.includes('v=') ? url.split('v=')[1].split('&')[0] : url.split('/').pop();
      return `https://www.youtube.com/embed/${id}?autoplay=1&modestbranding=1&rel=0&showinfo=0`;
    }
    return url;
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
              <h2 className="text-white font-black italic uppercase text-sm">{modulo.titulo}</h2>
            </div>
          </div>
          <button onClick={onClose} className="hover:bg-red-500/20 p-2.5 rounded-full text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* PLAYER */}
          <div className="flex-[3] overflow-y-auto p-4 md:p-8 space-y-6 bg-[#0f172a] custom-scrollbar">
            <div className="relative w-full aspect-video rounded-[32px] overflow-hidden bg-black border border-blue-500/30 shadow-2xl">
              {isLoaded && (
                <iframe
                  key={aulaAtual?.id}
                  src={getEmbedUrl(aulaAtual?.videoUrl || '')}
                  className="absolute inset-0 w-full h-full border-0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              )}
              <div className="absolute top-6 right-8 z-[10] pointer-events-none opacity-40">
                <span className="text-white font-black italic text-sm uppercase">
                  Retenção <span className="text-blue-500">Start</span>
                </span>
              </div>
            </div>

            {/* INFO AULA */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white/[0.02] p-8 rounded-[32px] border border-white/5 text-left">
              <div>
                <p className="text-blue-400 font-bold text-[10px] uppercase tracking-widest mb-2">Aula {aulaAtivaIdx + 1} • 1.25x Ativado</p>
                <h3 className="text-3xl md:text-5xl font-black italic text-white uppercase tracking-tighter leading-none">
                  {aulaAtual?.titulo}
                </h3>
              </div>
              <button className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-5 rounded-2xl font-black italic uppercase text-xs shadow-lg transition-all">
                Concluir Aula
              </button>
            </div>
          </div>

          {/* CRONOGRAMA */}
          <div className="flex-1 bg-[#0a0f1d]/60 border-l border-white/5 flex flex-col overflow-hidden text-left">
            <div className="p-6 border-b border-white/5 text-[10px] font-black text-blue-500 uppercase tracking-widest">Lista de Aulas</div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {modulo.aulas.map((aula, idx) => (
                <button
                  key={aula.id}
                  onClick={() => setAulaAtivaIdx(idx)}
                  className={`w-full flex items-center gap-4 p-4 rounded-[24px] border transition-all ${
                    aulaAtivaIdx === idx ? 'bg-blue-600 border-blue-400' : 'bg-white/5 border-transparent hover:bg-white/10'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${
                    aulaAtivaIdx === idx ? 'bg-white text-blue-600' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                  <p className={`text-xs font-black uppercase truncate ${aulaAtivaIdx === idx ? 'text-white' : 'text-slate-300'}`}>
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