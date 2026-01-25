"use client";
import { useState, useEffect } from 'react';
import { X, PlayCircle } from 'lucide-react';
import { Modulo } from '../types';

interface LessonModalProps {
  modulo: Modulo | null;
  isOpen: boolean;
  onClose: () => void;
}

export function LessonModal({ modulo, isOpen, onClose }: LessonModalProps) {
  const [aulaAtivaIdx, setAulaAtivaIdx] = useState(0);

  useEffect(() => {
    if (!isOpen) setAulaAtivaIdx(0);
  }, [isOpen]);

  if (!isOpen || !modulo) return null;

  const aulaAtual = modulo.aulas[aulaAtivaIdx];

  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    
    // YouTube
    const ytMatch = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/);
    if (ytMatch && ytMatch[2].length === 11) {
      return `https://www.youtube.com/embed/${ytMatch[2]}?autoplay=1&modestbranding=1&rel=0`;
    }

    // Vimeo
    const vimeoMatch = url.match(/(?:vimeo\.com\/|video\/)(\d+)/);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&badge=0&autopause=0`;
    }

    return url;
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 md:p-6 lg:p-12">
      <div className="absolute inset-0 bg-[#020617]/95 backdrop-blur-xl" onClick={onClose} />
      
      <div className="relative bg-[#0f172a] border border-blue-500/20 w-full max-w-[1400px] h-full md:h-[90vh] md:rounded-[40px] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="px-8 py-5 border-b border-white/5 flex justify-between items-center bg-[#0f172a]">
          <div className="flex items-center gap-4 text-left">
            <div className="p-2.5 bg-blue-600/20 rounded-xl border border-blue-500/30 text-blue-400">
                <PlayCircle size={22} />
            </div>
            <div>
                <p className="text-[10px] text-blue-400 font-black uppercase tracking-[0.2em] mb-0.5">Retenção Start</p>
                <h2 className="text-white font-black italic uppercase text-sm md:text-base tracking-tight">
                    {modulo.titulo} <span className="text-blue-500/50 mx-2">//</span> <span className="text-slate-400">Aula {aulaAtivaIdx + 1}</span>
                </h2>
            </div>
          </div>
          <button onClick={onClose} className="bg-white/5 p-3 rounded-full hover:bg-red-500/20 text-white transition-all">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* ÁREA DO VÍDEO */}
          <div className="flex-[3] overflow-y-auto p-4 md:p-8 space-y-6 bg-[#0f172a]">
            
            <div className="relative w-full aspect-video rounded-[32px] overflow-hidden bg-black border border-blue-500/30 shadow-[0_0_50px_rgba(37,99,235,0.2)]">
                {/* Iframe Puro - Sem Plyr para evitar conflitos de Client-Side Exception */}
                <iframe
                  key={aulaAtual?.id}
                  src={getEmbedUrl(aulaAtual?.videoUrl || '')}
                  className="absolute inset-0 w-full h-full"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                />
                
                {/* MARCA D'ÁGUA */}
                <div className="absolute top-6 right-8 z-[100] pointer-events-none select-none opacity-50">
                    <span className="text-white font-black italic text-sm tracking-tighter uppercase drop-shadow-md">
                        Retenção <span className="text-blue-500">Start</span>
                    </span>
                </div>
            </div>

            <div className="space-y-4 text-left">
                <h3 className="text-3xl font-black italic text-white uppercase tracking-tighter">
                    {aulaAtual?.titulo}
                </h3>
                <div className="bg-white/[0.02] p-6 rounded-[24px] border border-white/5">
                    <p className="text-slate-400 text-sm leading-relaxed">
                        {aulaAtual?.descricao}
                    </p>
                </div>
            </div>
          </div>

          {/* CRONOGRAMA */}
          <div className="flex-1 bg-[#0a0f1d]/50 border-l border-white/5 flex flex-col overflow-hidden text-left">
            <div className="p-6 border-b border-white/5">
                <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">Cronograma</h4>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {modulo.aulas.map((aula, idx) => (
                    <button
                        key={aula.id}
                        onClick={() => setAulaAtivaIdx(idx)}
                        className={`w-full flex items-center gap-4 p-4 rounded-[20px] border transition-all ${
                            aulaAtivaIdx === idx 
                            ? 'bg-blue-600 border-blue-400 shadow-lg scale-[1.02]' 
                            : 'bg-white/5 border-transparent hover:bg-white/10'
                        }`}
                    >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${
                            aulaAtivaIdx === idx ? 'bg-white text-blue-600' : 'bg-white/10 text-slate-500'
                        }`}>
                            {String(idx + 1).padStart(2, '0')}
                        </div>
                        <p className={`text-xs font-bold uppercase truncate ${aulaAtivaIdx === idx ? 'text-white' : 'text-slate-300'}`}>
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