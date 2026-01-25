"use client";
import { useState, useEffect } from 'react';
import { X, PlayCircle, CheckCircle2, Volume2, Settings } from 'lucide-react'; // Corrigido Volume2
import { Modulo } from '../types';

// ... resto do componente ...

interface LessonModalProps {
  modulo: Modulo | null;
  isOpen: boolean;
  onClose: () => void;
}

export function LessonModal({ modulo, isOpen, onClose }: LessonModalProps) {
  const [aulaAtivaIdx, setAulaAtivaIdx] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Efeito para resetar o loading e a aula ao abrir
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      const timer = setTimeout(() => setIsLoading(false), 500);
      return () => clearTimeout(timer);
    }
  }, [aulaAtivaIdx, isOpen]);

  if (!isOpen || !modulo) return null;

  const aulaAtual = modulo.aulas[aulaAtivaIdx];

  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    // YouTube
    const ytMatch = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/);
    if (ytMatch && ytMatch[2].length === 11) {
      return `https://www.youtube.com/embed/${ytMatch[2]}?autoplay=1&modestbranding=1&rel=0&controls=1&showinfo=0`;
    }
    // Vimeo
    const vimeoMatch = url.match(/(?:vimeo\.com\/|video\/)(\d+)/);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&badge=0&autopause=0&title=0&byline=0&portrait=0`;
    }
    return url;
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 md:p-6 lg:p-12">
      <div className="absolute inset-0 bg-[#020617]/98 backdrop-blur-2xl" onClick={onClose} />
      
      <div className="relative bg-[#0f172a] border border-blue-500/20 w-full max-w-[1400px] h-full md:h-[90vh] md:rounded-[40px] overflow-hidden flex flex-col shadow-[0_0_100px_rgba(37,99,235,0.15)]">
        
        {/* HEADER START */}
        <div className="px-8 py-5 border-b border-white/5 flex justify-between items-center bg-[#0f172a]">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-blue-600/20 rounded-lg border border-blue-500/30">
              <PlayCircle className="text-blue-400" size={20} />
            </div>
            <div className="text-left">
              <p className="text-[10px] text-blue-500 font-black uppercase tracking-[0.2em]">Retenção Start Academy</p>
              <h2 className="text-white font-bold italic uppercase text-sm">{modulo.titulo}</h2>
            </div>
          </div>
          <button onClick={onClose} className="hover:bg-red-500/20 p-2 rounded-full transition-colors text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* ÁREA DO VÍDEO */}
          <div className="flex-[3] overflow-y-auto p-4 md:p-8 space-y-6 bg-[#0f172a] custom-scrollbar">
            
            <div className="relative w-full aspect-video rounded-[32px] overflow-hidden bg-black border border-blue-500/30 shadow-2xl">
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900 z-50">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <span className="text-blue-500 font-black italic text-xs uppercase animate-pulse">Sincronizando...</span>
                  </div>
                </div>
              ) : (
                <iframe
                  key={aulaAtual?.id}
                  src={getEmbedUrl(aulaAtual?.videoUrl || '')}
                  className="w-full h-full border-0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              )}
              
              {/* BRANDING OVERLAY */}
              <div className="absolute top-6 right-8 z-[40] pointer-events-none opacity-30 group-hover:opacity-100 transition-opacity">
                <span className="text-white font-black italic text-sm tracking-tighter uppercase">
                  Retenção <span className="text-blue-500">Start</span>
                </span>
              </div>
            </div>

            {/* CONTROLES PERSONALIZADOS (UI INFERIOR) */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white/[0.02] p-6 rounded-[32px] border border-white/5">
              <div className="text-left">
                <h3 className="text-3xl md:text-4xl font-black italic text-white uppercase tracking-tighter leading-none mb-2">
                  {aulaAtual?.titulo}
                </h3>
                <div className="flex gap-4">
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest flex items-center gap-1">
                    <CheckCircle2 size={12} /> Aula Liberada
                  </span>
                </div>
              </div>
              
              <button className="flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-black italic uppercase text-sm transition-all shadow-[0_10px_20px_rgba(37,99,235,0.2)]">
                Concluir Aula
              </button>
            </div>

            <div className="text-left px-4">
              <p className="text-slate-400 text-lg leading-relaxed italic">
                {aulaAtual?.descricao}
              </p>
            </div>
          </div>

          {/* CRONOGRAMA LATERAL */}
          <div className="flex-1 bg-[#0a0f1d]/80 border-l border-white/5 flex flex-col overflow-hidden">
            <div className="p-6 border-b border-white/5 text-left">
              <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">Próximas Aulas</h4>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {modulo.aulas.map((aula, idx) => (
                <button
                  key={aula.id}
                  onClick={() => setAulaAtivaIdx(idx)}
                  className={`w-full flex items-center gap-4 p-4 rounded-[24px] border transition-all duration-300 ${
                    aulaAtivaIdx === idx 
                    ? 'bg-blue-600 border-blue-400 shadow-lg scale-[1.02]' 
                    : 'bg-white/5 border-transparent hover:bg-white/10'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm ${
                    aulaAtivaIdx === idx ? 'bg-white text-blue-600' : 'bg-[#0f172a] text-slate-500'
                  }`}>
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                  <div className="flex-1 text-left overflow-hidden">
                    <p className={`text-xs font-black uppercase truncate ${aulaAtivaIdx === idx ? 'text-white' : 'text-slate-300'}`}>
                      {aula.titulo}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
      `}</style>
    </div>
  );
}