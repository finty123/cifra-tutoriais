"use client";
import { useState } from 'react';
import { X, PlayCircle } from 'lucide-react';
import Plyr from "plyr-react";
import "plyr/dist/plyr.css";
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

const getDirectVideoUrl = (url: string) => {
  if (!url) return '';
  if (url.includes('drive.google.com')) {
    const videoId = url.split('/d/')[1]?.split('/')[0] || url.split('id=')[1]?.split('&')[0];
    
    // FORMATO DE PREVIEW (Geralmente carrega mais rápido e sem bloqueio de download)
    return `https://www.google.com/get_video_info?docid=${videoId}&res=direct`;
  }
  return url;
};

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 md:p-6 lg:p-12">
      <div className="absolute inset-0 bg-[#020617]/95 backdrop-blur-xl" onClick={onClose} />
      
      <div className="relative bg-[#0f172a] border border-blue-500/20 w-full max-w-[1400px] h-full md:h-[90vh] md:rounded-[40px] overflow-hidden flex flex-col shadow-[0_0_100px_rgba(37,99,235,0.1)]">
        
        {/* Header */}
        <div className="px-8 py-5 border-b border-white/5 flex justify-between items-center bg-[#0f172a]">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-blue-600/20 rounded-xl border border-blue-500/30">
                <PlayCircle className="text-blue-400" size={22} />
            </div>
            <div>
                <p className="text-[10px] text-blue-400 font-black uppercase tracking-[0.2em] mb-0.5 text-left">Módulo em exibição</p>
                <h2 className="text-white font-black italic uppercase text-sm md:text-base tracking-tight text-left">
                    {modulo.titulo} <span className="text-blue-500/50 mx-2">//</span> <span className="text-slate-400">Aula {aulaAtivaIdx + 1}</span>
                </h2>
            </div>
          </div>
          <button onClick={onClose} className="bg-white/5 p-3 rounded-full hover:bg-red-500/20 text-white transition-all">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          
          {/* ÁREA DO VÍDEO EXPANDIDA */}
          <div className="flex-[3] overflow-y-auto p-4 md:p-8 space-y-6 custom-scrollbar bg-[#0f172a]">
            
            <div className="relative group w-full aspect-video rounded-[32px] overflow-hidden bg-black border border-blue-500/30 shadow-[0_0_50px_rgba(37,99,235,0.2)]">
                
                {/* MARCA D'ÁGUA */}
                <div className="absolute top-6 right-8 z-10 pointer-events-none select-none opacity-40 group-hover:opacity-100 transition-opacity">
                    <span className="text-white font-black italic text-sm tracking-tighter uppercase">
                        Retenção <span className="text-blue-500">Start</span>
                    </span>
                </div>

                <Plyr
                  key={aulaAtual?.id}
                  source={{
                    type: 'video',
                    sources: [{ src: getDirectVideoUrl(aulaAtual?.videoUrl || ''), type: 'video/mp4' }],
                  }}
                  options={{
                    controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'settings', 'fullscreen'],
                    settings: ['speed'],
                    speed: { selected: 1.25, options: [0.5, 1, 1.25, 1.5, 2] }
                  }}
                />
            </div>

            {/* TEXTOS - ABAIXO DO VÍDEO */}
            <div className="space-y-4 text-left">
                <div className="space-y-1">
                    <p className="text-blue-400 font-bold text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">
                        <span className="w-6 h-[1px] bg-blue-400" /> Conteúdo Exclusivo
                    </p>
                    <h3 className="text-3xl md:text-4xl font-black italic text-white uppercase tracking-tighter">
                        {aulaAtual?.titulo}
                    </h3>
                </div>

                <div className="bg-white/[0.02] p-6 rounded-[24px] border border-white/5">
                    <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                        {aulaAtual?.descricao}
                    </p>
                </div>
            </div>
          </div>

          {/* CRONOGRAMA LATERAL */}
          <div className="flex-1 bg-[#0a0f1d]/50 border-l border-white/5 flex flex-col overflow-hidden">
            <div className="p-6 border-b border-white/5">
                <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">Cronograma</h4>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
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
                        <p className={`text-xs font-bold uppercase truncate text-left ${aulaAtivaIdx === idx ? 'text-white' : 'text-slate-300'}`}>
                            {aula.titulo}
                        </p>
                    </button>
                ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        :root { --plyr-color-main: #2563eb; }
        
        .plyr--video { 
          height: 100%; 
          border-radius: 32px; 
          background: #000;
        }

        .plyr--video .plyr__controls {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 20px 15px 10px !important;
          background: linear-gradient(transparent, rgba(0,0,0,0.8)) !important;
          z-index: 5;
        }

        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
      `}</style>
    </div>
  );
}