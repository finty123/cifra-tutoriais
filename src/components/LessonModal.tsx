"use client";
import { useState } from 'react';
import { X, PlayCircle, ChevronRight, CheckCircle2 } from 'lucide-react';
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

  // Converte link do Drive para link direto de stream
  const getDirectVideoUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('drive.google.com')) {
      const videoId = url.split('/d/')[1]?.split('/')[0] || url.split('id=')[1]?.split('&')[0];
      return `https://drive.google.com/uc?export=download&id=${videoId}`;
    }
    return url;
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 md:p-6 lg:p-12">
      <div className="absolute inset-0 bg-[#020617]/95 backdrop-blur-xl" onClick={onClose} />
      
      <div className="relative bg-[#0f172a] border border-blue-500/20 w-full max-w-[1400px] h-full md:h-[90vh] md:rounded-[40px] overflow-hidden flex flex-col shadow-[0_0_100px_rgba(37,99,235,0.1)]">
        
        {/* Header Tecnológico */}
        <div className="px-8 py-5 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-blue-900/20 to-transparent">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-blue-600/20 rounded-xl border border-blue-500/30">
                <PlayCircle className="text-blue-400" size={22} />
            </div>
            <div>
                <p className="text-[10px] text-blue-400 font-black uppercase tracking-[0.2em] mb-0.5">Módulo em exibição</p>
                <h2 className="text-white font-black italic uppercase text-base md:text-lg tracking-tight">
                    {modulo.titulo} <span className="text-blue-500/50 mx-2">//</span> <span className="text-slate-400">Aula {aulaAtivaIdx + 1}</span>
                </h2>
            </div>
          </div>
          <button onClick={onClose} className="bg-white/5 p-3 rounded-full hover:bg-red-500/20 text-white transition-all border border-white/10">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          
          <div className="flex-[2.5] overflow-y-auto p-4 md:p-10 space-y-8 custom-scrollbar">
            
            {/* CONTAINER DO PLAYER COM MARCA D'ÁGUA */}
            <div className="relative group aspect-video w-full rounded-[32px] overflow-hidden bg-black border border-blue-500/30 shadow-[0_0_50px_rgba(37,99,235,0.2)]">
                
                {/* MARCA D'ÁGUA TECNOLÓGICA */}
                <div className="absolute top-6 right-8 z-20 pointer-events-none select-none">
                    <div className="flex flex-col items-end opacity-40 group-hover:opacity-80 transition-opacity">
                        <span className="text-white font-black italic text-sm tracking-tighter uppercase">Retenção <span className="text-blue-500">Start</span></span>
                        <div className="h-[2px] w-full bg-blue-500 mt-1 shadow-[0_0_10px_#2563eb]" />
                    </div>
                </div>

                <Plyr
                  key={aulaAtual?.videoUrl}
                  source={{
                    type: 'video',
                    sources: [{ src: getDirectVideoUrl(aulaAtual?.videoUrl || ''), type: 'video/mp4' }],
                  }}
                  options={{
                    controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'settings', 'fullscreen'],
                    settings: ['speed'],
                    speed: { selected: 1, options: [0.5, 1, 1.25, 1.5, 2] }
                  }}
                />
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <h3 className="text-3xl md:text-4xl font-black italic text-white uppercase tracking-tighter">{aulaAtual?.titulo}</h3>
                    <p className="text-blue-400 font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                        <span className="w-8 h-[1px] bg-blue-400" /> Conteúdo Exclusivo
                    </p>
                </div>
                
                {/* BOTÃO DE CONCLUSÃO */}
                <button className="flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white font-black italic uppercase px-8 py-4 rounded-2xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:scale-105 active:scale-95">
                    <CheckCircle2 size={20} />
                    Marcar como concluída
                </button>
            </div>

            <div className="bg-white/[0.02] p-8 rounded-[32px] border border-white/5 backdrop-blur-sm">
                <p className="text-slate-400 text-base md:text-lg leading-relaxed">
                    {aulaAtual?.descricao}
                </p>
            </div>
          </div>

          {/* PLAYLIST LATERAL */}
          <div className="flex-1 bg-[#0a0f1d]/50 border-l border-white/5 flex flex-col overflow-hidden">
            <div className="p-8 border-b border-white/5">
                <h4 className="text-xs font-black text-blue-500 uppercase tracking-[0.3em]">Cronograma</h4>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {modulo.aulas.map((aula, idx) => (
                    <button
                        key={aula.id}
                        onClick={() => setAulaAtivaIdx(idx)}
                        className={`w-full flex items-center gap-4 p-5 rounded-[24px] border transition-all ${
                            aulaAtivaIdx === idx 
                            ? 'bg-blue-600 border-blue-400 shadow-[0_0_30px_rgba(37,99,235,0.2)] scale-[1.02]' 
                            : 'bg-white/[0.03] border-transparent hover:bg-white/[0.06]'
                        }`}
                    >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm ${
                            aulaAtivaIdx === idx ? 'bg-white text-blue-600' : 'bg-white/5 text-slate-500 border border-white/10'
                        }`}>
                            {String(idx + 1).padStart(2, '0')}
                        </div>
                        <div className="flex-1 text-left overflow-hidden">
                            <p className={`text-[11px] font-black uppercase tracking-widest mb-0.5 ${aulaAtivaIdx === idx ? 'text-blue-200' : 'text-slate-500'}`}>Aula</p>
                            <p className={`text-sm font-bold truncate ${aulaAtivaIdx === idx ? 'text-white' : 'text-slate-300'}`}>
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
        :root { --plyr-color-main: #2563eb; }
        .plyr--video { border-radius: 32px; background: transparent; }
        .plyr__control--overlaid { background: rgba(37, 99, 235, 0.8) !important; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
      `}</style>
    </div>
  );
}