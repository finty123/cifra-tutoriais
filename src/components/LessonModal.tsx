"use client";
import { useState, useEffect } from 'react';
import { X, PlayCircle, CheckCircle2, Volume2, Settings, Maximize } from 'lucide-react';
import dynamic from 'next/dynamic';
import { Modulo } from '../types';

// Carregamento dinâmico para evitar o erro de Client-side Exception
const ReactPlayer = dynamic(() => import('react-player/lazy'), { ssr: false });

interface LessonModalProps {
  modulo: Modulo | null;
  isOpen: boolean;
  onClose: () => void;
}

export function LessonModal({ modulo, isOpen, onClose }: LessonModalProps) {
  const [aulaAtivaIdx, setAulaAtivaIdx] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isOpen || !modulo || !isMounted) return null;

  const aulaAtual = modulo.aulas[aulaAtivaIdx];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 md:p-6 lg:p-12">
      <div className="absolute inset-0 bg-[#020617]/98 backdrop-blur-2xl" onClick={onClose} />
      
      <div className="relative bg-[#0f172a] border border-blue-500/20 w-full max-w-[1400px] h-full md:h-[90vh] md:rounded-[40px] overflow-hidden flex flex-col shadow-[0_0_100px_rgba(37,99,235,0.15)]">
        
        {/* HEADER START */}
        <div className="px-8 py-5 border-b border-white/5 flex justify-between items-center bg-[#0f172a]">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-blue-600/20 rounded-lg border border-blue-500/30 text-blue-400">
              <PlayCircle size={20} />
            </div>
            <div className="text-left">
              <p className="text-[10px] text-blue-500 font-black uppercase tracking-[0.2em] mb-0.5">Retenção Start Academy</p>
              <h2 className="text-white font-black italic uppercase text-sm tracking-tight">
                {modulo.titulo} <span className="text-slate-500 not-italic ml-2">Aula {aulaAtivaIdx + 1}</span>
              </h2>
            </div>
          </div>
          <button onClick={onClose} className="hover:bg-red-500/20 p-2.5 rounded-full transition-all text-slate-400 hover:text-white border border-transparent hover:border-red-500/30">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* ÁREA DO VÍDEO CUSTOMIZADA */}
          <div className="flex-[3] overflow-y-auto p-4 md:p-8 space-y-6 bg-[#0f172a] custom-scrollbar">
            
            <div className="relative w-full aspect-video rounded-[32px] overflow-hidden bg-black border border-blue-500/30 shadow-[0_0_50px_rgba(37,99,235,0.1)] group">
                
                {/* O Player com configuração que esconde a UI original */}
                <ReactPlayer
                  key={aulaAtual?.id}
                  url={aulaAtual?.videoUrl}
                  width="100%"
                  height="100%"
                  controls={true}
                  playing={true}
                  // @ts-ignore
                  config={{
                    vimeo: { 
                        playerOptions: { 
                            color: "2563eb",
                            title: 0, 
                            byline: 0, 
                            portrait: 0,
                            badge: 0
                        } 
                    },
                    youtube: { playerVars: { modestbranding: 1, rel: 0, color: 'white' } }
                  }}
                  style={{ position: 'absolute', top: 0, left: 0 }}
                />
                
                {/* MARCA D'ÁGUA EM OVERLAY */}
                <div className="absolute top-6 right-8 z-[10] pointer-events-none select-none opacity-40 group-hover:opacity-100 transition-opacity">
                    <span className="text-white font-black italic text-sm tracking-tighter uppercase drop-shadow-lg">
                        Retenção <span className="text-blue-500">Start</span>
                    </span>
                </div>
            </div>

            {/* CONTROLES E INFO (UI INFERIOR) */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white/[0.02] p-8 rounded-[32px] border border-white/5 backdrop-blur-sm">
              <div className="text-left space-y-2">
                <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded text-[9px] font-bold text-blue-400 uppercase tracking-widest">Original Content</span>
                </div>
                <h3 className="text-3xl md:text-5xl font-black italic text-white uppercase tracking-tighter leading-none">
                  {aulaAtual?.titulo}
                </h3>
              </div>
              
              <div className="flex items-center gap-4">
                  <div className="hidden md:flex items-center gap-3 mr-4 text-slate-500">
                      <Volume2 size={20} className="hover:text-blue-400 cursor-pointer transition-colors" />
                      <Settings size={20} className="hover:text-blue-400 cursor-pointer transition-colors" />
                  </div>
                  <button className="flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white px-10 py-5 rounded-2xl font-black italic uppercase text-xs transition-all shadow-[0_10px_30px_rgba(37,99,235,0.3)] hover:-translate-y-1 active:scale-95">
                    <CheckCircle2 size={18} />
                    Concluir Aula
                  </button>
              </div>
            </div>

            <div className="text-left px-4 max-w-4xl">
              <p className="text-slate-400 text-lg leading-relaxed font-medium italic opacity-80">
                {aulaAtual?.descricao}
              </p>
            </div>
          </div>

          {/* CRONOGRAMA LATERAL */}
          <div className="flex-1 bg-[#0a0f1d]/60 border-l border-white/5 flex flex-col overflow-hidden">
            <div className="p-6 border-b border-white/5 text-left flex justify-between items-center">
              <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">Cronograma</h4>
              <span className="text-[10px] text-slate-600 font-bold">{modulo.aulas.length} AULAS</span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {modulo.aulas.map((aula, idx) => (
                <button
                  key={aula.id}
                  onClick={() => setAulaAtivaIdx(idx)}
                  className={`w-full flex items-center gap-4 p-4 rounded-[24px] border transition-all duration-300 ${
                    aulaAtivaIdx === idx 
                    ? 'bg-blue-600 border-blue-400 shadow-[0_10px_20px_rgba(37,99,235,0.2)] scale-[1.02]' 
                    : 'bg-white/5 border-transparent hover:bg-white/10 hover:translate-x-1'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shadow-inner ${
                    aulaAtivaIdx === idx ? 'bg-white text-blue-600' : 'bg-[#0f172a] text-slate-500 border border-white/5'
                  }`}>
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                  <div className="flex-1 text-left overflow-hidden">
                    <p className={`text-[11px] font-black uppercase truncate ${aulaAtivaIdx === idx ? 'text-white' : 'text-slate-300'}`}>
                      {aula.titulo}
                    </p>
                    <p className={`text-[9px] font-bold uppercase tracking-tighter ${aulaAtivaIdx === idx ? 'text-blue-100/60' : 'text-slate-600'}`}>
                        {aulaAtivaIdx === idx ? 'Reproduzindo' : 'Disponível'}
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
        /* Forçar a cor azul nos controles do Vimeo/YouTube quando possível */
        :root { --plyr-color-main: #2563eb; }
      `}</style>
    </div>
  );
}