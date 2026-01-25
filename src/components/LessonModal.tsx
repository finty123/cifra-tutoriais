"use client";
import { useState, useEffect } from 'react';
import { X, PlayCircle, ShieldCheck, Zap } from 'lucide-react';
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
    const ytMatch = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/);
    if (ytMatch && ytMatch[2].length === 11) {
      return `https://www.youtube.com/embed/${ytMatch[2]}?autoplay=1&modestbranding=1&rel=0&showinfo=0&controls=1`;
    }
    const vimeoMatch = url.match(/(?:vimeo\.com\/|video\/)(\d+)/);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&badge=0&autopause=0&title=0&byline=0&portrait=0`;
    }
    return url;
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 md:p-6 lg:p-12">
      <div className="absolute inset-0 bg-[#020617]/98 backdrop-blur-2xl" onClick={onClose} />
      
      <div className="relative bg-[#0f172a] border border-blue-500/30 w-full max-w-[1400px] h-full md:h-[90vh] md:rounded-[40px] overflow-hidden flex flex-col shadow-[0_0_100px_rgba(37,99,235,0.15)]">
        
        {/* HEADER CUSTOMIZADO */}
        <div className="px-8 py-5 border-b border-white/5 flex justify-between items-center bg-[#0f172a]/80 backdrop-blur-md">
          <div className="flex items-center gap-4 text-left">
            <div className="p-2.5 bg-blue-600/20 rounded-xl border border-blue-500/40 shadow-[0_0_15px_rgba(37,99,235,0.2)]">
                <PlayCircle className="text-blue-400" size={22} />
            </div>
            <div>
                <p className="text-[10px] text-blue-500 font-black uppercase tracking-[0.3em] mb-0.5">Área do Aluno</p>
                <h2 className="text-white font-black italic uppercase text-sm md:text-base tracking-tight flex items-center gap-2">
                    {modulo.titulo} <span className="text-blue-500/30 font-light">//</span> <span className="text-slate-400">Aula {aulaAtivaIdx + 1}</span>
                </h2>
            </div>
          </div>
          <button onClick={onClose} className="group bg-white/5 p-3 rounded-full hover:bg-red-500/20 text-white transition-all border border-white/10">
            <X size={20} className="group-hover:rotate-90 transition-transform" />
          </button>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          
          {/* ÁREA DO VÍDEO COM MOLDURA START */}
          <div className="flex-[3] overflow-y-auto p-4 md:p-8 space-y-6 custom-scrollbar bg-[#0f172a]">
            
            <div className="relative w-full aspect-video rounded-[32px] overflow-hidden bg-black border border-blue-500/40 shadow-[0_0_60px_rgba(37,99,235,0.1)] group">
                
                {/* O IFRAME (O MOTOR) */}
                <iframe
                  key={aulaAtual?.id}
                  src={getEmbedUrl(aulaAtual?.videoUrl || '')}
                  className="absolute inset-0 w-full h-full z-10"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                />

                {/* OVERLAY DE MARCA D'ÁGUA (ESTÉTICA) */}
                <div className="absolute top-6 right-8 z-20 pointer-events-none select-none opacity-40 group-hover:opacity-100 transition-opacity">
                    <div className="flex flex-col items-end">
                        <span className="text-white font-black italic text-sm tracking-tighter uppercase drop-shadow-lg">
                            Retenção <span className="text-blue-500">Start</span>
                        </span>
                        <div className="w-12 h-1 bg-blue-600 mt-1 rounded-full shadow-[0_0_10px_rgba(37,99,235,1)]"></div>
                    </div>
                </div>

                {/* DETALHE TECH NAS BORDAS */}
                <div className="absolute inset-0 border-[20px] border-black/10 pointer-events-none z-20 rounded-[32px]"></div>
            </div>

            {/* INFO DA AULA */}
            <div className="space-y-4 text-left">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
                        <Zap size={12} className="text-blue-400" />
                        <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Premium Content</span>
                    </div>
                </div>
                <h3 className="text-3xl md:text-5xl font-black italic text-white uppercase tracking-tighter leading-none">
                    {aulaAtual?.titulo}
                </h3>
                <div className="bg-gradient-to-r from-white/[0.03] to-transparent p-6 rounded-[24px] border-l-4 border-blue-600">
                    <p className="text-slate-400 text-sm md:text-lg leading-relaxed max-w-3xl">
                        {aulaAtual?.descricao}
                    </p>
                </div>
            </div>
          </div>

          {/* CRONOGRAMA LATERAL RESTAURADO */}
          <div className="flex-1 bg-[#0a0f1d]/80 border-l border-white/5 flex flex-col overflow-hidden text-left">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
                <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">Cronograma</h4>
                <ShieldCheck size={14} className="text-blue-500/50" />
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {modulo.aulas.map((aula, idx) => (
                    <button
                        key={aula.id}
                        onClick={() => setAulaAtivaIdx(idx)}
                        className={`w-full flex items-center gap-4 p-4 rounded-[24px] border transition-all duration-300 ${
                            aulaAtivaIdx === idx 
                            ? 'bg-blue-600 border-blue-400 shadow-[0_10px_30px_rgba(37,99,235,0.3)] scale-[1.02]' 
                            : 'bg-white/5 border-transparent hover:bg-white/10 hover:translate-x-1'
                        }`}
                    >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shadow-inner ${
                            aulaAtivaIdx === idx ? 'bg-white text-blue-600' : 'bg-[#0f172a] text-slate-500'
                        }`}>
                            {String(idx + 1).padStart(2, '0')}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className={`text-xs font-black uppercase truncate ${aulaAtivaIdx === idx ? 'text-white' : 'text-slate-300'}`}>
                                {aula.titulo}
                            </p>
                            <p className={`text-[9px] font-medium uppercase tracking-tighter ${aulaAtivaIdx === idx ? 'text-blue-100' : 'text-slate-500'}`}>
                                {aulaAtivaIdx === idx ? 'Reproduzindo agora' : 'Disponível'}
                            </p>
                        </div>
                    </button>
                ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 20px; border: 1px solid rgba(255,255,255,0.05); }
      `}</style>
    </div>
  );
}