"use client";
import { useState, useEffect } from 'react';
import { X, PlayCircle, CheckCircle2, Volume2, VolumeX, Play, Pause } from 'lucide-react';
import dynamic from 'next/dynamic';
import { Modulo } from '../types';

// Importação dinâmica para evitar "Module not found" e erros de SSR
const ReactPlayer = dynamic(() => import('react-player'), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-[#0f172a] animate-pulse flex items-center justify-center">
    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
  </div>
});

interface LessonModalProps {
  modulo: Modulo | null;
  isOpen: boolean;
  onClose: () => void;
}

export function LessonModal({ modulo, isOpen, onClose }: LessonModalProps) {
  const [aulaAtivaIdx, setAulaAtivaIdx] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);

  // Reseta estados ao trocar de aula
  useEffect(() => {
    setPlayed(0);
    setPlaying(true);
  }, [aulaAtivaIdx]);

  if (!isOpen || !modulo) return null;
  const aulaAtual = modulo.aulas[aulaAtivaIdx];

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
              <h2 className="text-white font-black italic uppercase text-sm tracking-tight">
                {modulo.titulo} <span className="text-slate-500 not-italic ml-2">Aula {aulaAtivaIdx + 1}</span>
              </h2>
            </div>
          </div>
          <button onClick={onClose} className="hover:bg-red-500/20 p-2 text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          <div className="flex-[3] overflow-y-auto p-4 md:p-8 space-y-6 bg-[#0f172a] custom-scrollbar">
            
            {/* CONTAINER DO PLAYER */}
            <div className="relative w-full aspect-video rounded-[32px] overflow-hidden bg-black border border-blue-500/30 shadow-2xl group">
                <ReactPlayer
  key={aulaAtual?.id}
  {...({
    url: aulaAtual?.videoUrl || '',
    width: "100%",
    height: "100%",
    playing: playing,
    muted: muted,
    playbackRate: 1.25,
    onProgress: (state: any) => setPlayed(state.played),
    config: { 
      vimeo: { playerOptions: { background: 0, title: 0, byline: 0, portrait: 0 } } as any,
      youtube: { playerVars: { modestbranding: 1, rel: 0 } } as any
    }
  } as any)} 
/>

                {/* OVERLAY DE CONTROLES */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-full h-1.5 bg-white/20 rounded-full mb-4 overflow-hidden">
                        <div className="h-full bg-blue-600 shadow-[0_0_15px_#2563eb]" style={{ width: `${played * 100}%` }} />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <button onClick={() => setPlaying(!playing)} className="text-white hover:text-blue-400 transition-transform active:scale-90">
                                {playing ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" />}
                            </button>
                            <button onClick={() => setMuted(!muted)} className="text-white hover:text-blue-400 transition-colors">
                                {muted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                            </button>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="bg-blue-600/20 border border-blue-500/30 px-3 py-1 rounded text-[10px] text-blue-400 font-black">1.25X SPEED</span>
                            <span className="text-blue-500 font-black italic text-sm tracking-tighter uppercase hidden sm:block">
                              RETENÇÃO <span className="text-white">START</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* INFO E DESCRIÇÃO */}
            <div className="text-left space-y-4">
              <div className="bg-white/[0.02] p-8 rounded-[32px] border border-white/5 flex flex-col md:flex-row justify-between items-start gap-6">
                <div className="flex-1">
                  <h3 className="text-3xl md:text-5xl font-black italic text-white uppercase tracking-tighter leading-none mb-4">
                    {aulaAtual?.titulo}
                  </h3>
                  <p className="text-slate-400 text-lg leading-relaxed italic opacity-80">
                    {aulaAtual?.descricao}
                  </p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-5 rounded-2xl font-black italic uppercase text-xs shadow-lg transition-all shrink-0">
                  <CheckCircle2 size={18} className="inline mr-2" /> Concluir Aula
                </button>
              </div>
            </div>
          </div>

          {/* CRONOGRAMA LATERAL */}
          <div className="flex-1 bg-[#0a0f1d]/60 border-l border-white/5 flex flex-col overflow-hidden text-left">
            <div className="p-6 border-b border-white/5 text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">Lista de Aulas</div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {modulo.aulas.map((aula, idx) => (
                <button
                  key={aula.id}
                  onClick={() => setAulaAtivaIdx(idx)}
                  className={`w-full flex items-center gap-4 p-4 rounded-[24px] border transition-all ${
                    aulaAtivaIdx === idx ? 'bg-blue-600 border-blue-400 shadow-lg' : 'bg-white/5 border-transparent hover:bg-white/10'
                  }`}
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

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
      `}</style>
    </div>
  );
}