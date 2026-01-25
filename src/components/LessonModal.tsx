"use client";
import { useState } from 'react';
import { X, PlayCircle, ChevronRight } from 'lucide-react';
import { Modulo } from '../types';

interface LessonModalProps {
  modulo: Modulo | null;
  isOpen: boolean;
  onClose: () => void;
}

export function LessonModal({ modulo, isOpen, onClose }: LessonModalProps) {
  const [aulaAtivaIdx, setAulaAtivaIdx] = useState(0);

  if (!isOpen || !modulo) return null;

  const aulaAtual = modulo.aulas[aulaAtivaIdx];

  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : null;

    if (videoId) {
      // Parâmetros agressivos de limpeza
      return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&iv_load_policy=3&showinfo=0&controls=1&autoplay=0`;
    }
    return url;
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 md:p-6 lg:p-12">
      <div className="absolute inset-0 bg-[#020617]/98 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative bg-[#0f172a] border border-white/10 w-full max-w-[1400px] h-full md:h-[85vh] md:rounded-[40px] overflow-hidden flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <div className="flex items-center gap-4">
            <div className="hidden sm:block p-2 bg-blue-600/20 rounded-lg">
                <PlayCircle className="text-blue-500" size={20} />
            </div>
            <div>
                <h2 className="text-white font-black italic uppercase text-sm md:text-base tracking-tight">
                    {modulo.titulo} <span className="text-blue-500 ml-2">— Aula {aulaAtivaIdx + 1}</span>
                </h2>
            </div>
          </div>
          <button onClick={onClose} className="bg-white/5 p-2 rounded-full hover:bg-red-500/20 hover:text-red-500 text-white transition-all">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          
          {/* PLAYER COM TÉCNICA DE CLIPPING (ESCONDE YOUTUBE) */}
          <div className="flex-[2.5] overflow-y-auto p-4 md:p-8 space-y-6 custom-scrollbar">
            
            <div className="relative aspect-video w-full rounded-[24px] md:rounded-[32px] overflow-hidden bg-black border border-blue-600/30 shadow-[0_0_45px_rgba(37,99,235,0.35)] transition-all">
                {aulaAtual?.videoUrl.endsWith('.mp4') ? (
                    <video src={aulaAtual.videoUrl} controls className="w-full h-full" />
                ) : (
                    /* O segredo está aqui: h-[115%] e -top-[7.5%] escondem a barra de cima e a logo */
                    <iframe 
                        src={getEmbedUrl(aulaAtual?.videoUrl || '')} 
                        className="absolute inset-0 w-full h-[115%] -top-[7.5%]" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen 
                    />
                )}
                
                {/* Overlay Invisível para bloquear cliques no título/logo */}
                <div className="absolute top-0 left-0 w-full h-20 z-10 bg-transparent" />
                <div className="absolute bottom-0 right-0 w-32 h-16 z-10 bg-transparent" />
            </div>
            
            <div className="space-y-4">
                <h3 className="text-2xl md:text-3xl font-black italic text-white uppercase tracking-tighter">
                    {aulaAtual?.titulo}
                </h3>
                {aulaAtual?.descricao && (
                    <div className="bg-white/[0.03] p-6 rounded-3xl border border-white/5">
                        <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                            {aulaAtual.descricao}
                        </p>
                    </div>
                )}
            </div>
          </div>

          {/* LISTA DE AULAS */}
          <div className="flex-1 bg-black/20 border-l border-white/5 flex flex-col overflow-hidden">
            <div className="p-6 border-b border-white/5 bg-white/[0.01]">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Conteúdo do Módulo</h4>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                {modulo.aulas.map((aula, idx) => (
                    <button
                        key={aula.id}
                        onClick={() => setAulaAtivaIdx(idx)}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all border ${
                            aulaAtivaIdx === idx 
                            ? 'bg-blue-600 border-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.3)]' 
                            : 'bg-white/5 border-transparent hover:bg-white/10'
                        }`}
                    >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black italic text-xs ${
                            aulaAtivaIdx === idx ? 'bg-white text-blue-600' : 'bg-white/10 text-slate-400'
                        }`}>
                            {idx + 1}
                        </div>
                        <div className="flex-1 text-left overflow-hidden">
                            <p className={`text-xs font-bold uppercase truncate ${
                                aulaAtivaIdx === idx ? 'text-white' : 'text-slate-300'
                            }`}>
                                {aula.titulo}
                            </p>
                        </div>
                        {aulaAtivaIdx === idx && <ChevronRight size={16} className="text-white" />}
                    </button>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}