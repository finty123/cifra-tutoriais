"use client";
import { useState, useEffect } from 'react';
import { X, PlayCircle, CheckCircle2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import { Modulo } from '../types';

// Importação dinâmica com tipagem flexível para evitar erros de build
const ReactPlayer = dynamic(() => import('react-player').then(mod => mod.default), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-900 animate-pulse flex items-center justify-center">
      <div className="text-blue-500 font-black italic uppercase tracking-tighter">Carregando Player...</div>
    </div>
  )
});

interface LessonModalProps {
  modulo: Modulo | null;
  isOpen: boolean;
  onClose: () => void;
}

export function LessonModal({ modulo, isOpen, onClose }: LessonModalProps) {
  const [aulaAtivaIdx, setAulaAtivaIdx] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !modulo || !mounted) return null;

  const aulaAtual = modulo.aulas[aulaAtivaIdx];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 md:p-6 lg:p-12">
      <div className="absolute inset-0 bg-[#020617]/95 backdrop-blur-xl" onClick={onClose} />
      
      <div className="relative bg-[#0f172a] border border-blue-500/20 w-full max-w-[1400px] h-full md:h-[90vh] md:rounded-[40px] overflow-hidden flex flex-col shadow-[0_0_100px_rgba(37,99,235,0.1)]">
        
        {/* Header */}
        <div className="px-8 py-5 border-b border-white/5 flex justify-between items-center bg-[#0f172a]">
          <div className="flex items-center gap-4 text-left">
            <div className="p-2.5 bg-blue-600/20 rounded-xl border border-blue-500/30 text-blue-400">
              <PlayCircle size={22} />
            </div>
            <div>
              <p className="text-[10px] text-blue-400 font-black uppercase tracking-[0.2em] mb-0.5">Retenção Start // Academy</p>
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
          <div className="flex-[3] overflow-y-auto p-4 md:p-8 space-y-6 custom-scrollbar bg-[#0f172a]">
            
            {/* CONTAINER DO PLAYER - ONDE ESTAVAM OS ERROS */}
            <div className="relative w-full aspect-video rounded-[32px] overflow-hidden bg-black border border-blue-500/30 shadow-[0_0_50px_rgba(37,99,235,0.2)]">
                <ReactPlayer
                  key={aulaAtual?.id}
                  url={aulaAtual?.videoUrl}
                  width="100%"
                  height="100%"
                  controls={true}
                  playing={true}
                  // @ts-ignore - Essa linha ignora o erro de tipagem apenas aqui
                  config={{
                    youtube: { playerVars: { modestbranding: 1, rel: 0, showinfo: 0 } },
                    vimeo: { playerOptions: { title: 0, byline: 0, portrait: 0 } }
                  }}
                />
                
                <div className="absolute top-6 right-8 z-[50] pointer-events-none select-none opacity-40">
                  <span className="text-white font-black italic text-sm tracking-tighter uppercase">
                    Retenção <span className="text-blue-500">Start</span>
                  </span>
                </div>
            </div>

            {/* INFO DA AULA */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 text-left">
              <div className="space-y-1">
                <h3 className="text-3xl md:text-5xl font-black italic text-white uppercase tracking-tighter">
                  {aulaAtual?.titulo}
                </h3>
                <p className="text-blue-400 font-bold text-[10px] uppercase tracking-[0.2em]">Conteúdo Original</p>
              </div>
              
              <button className="flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-black italic uppercase text-sm transition-all shadow-[0_0_30px_rgba(37,99,235,0.3)]">
                <CheckCircle2 size={20} />
                Concluir Aula
              </button>
            </div>

            <div className="bg-white/[0.02] p-8 rounded-[32px] border border-white/5 text-left">
              <p className="text-slate-400 text-lg leading-relaxed">
                 {aulaAtual?.descricao}
              </p>
            </div>
          </div>

          {/* CRONOGRAMA */}
          <div className="flex-1 bg-[#0a0f1d]/50 border-l border-white/5 flex flex-col overflow-hidden text-left">
            <div className="p-6 border-b border-white/5 uppercase tracking-[0.3em] font-black text-blue-500 text-[10px]">Lista de Aulas</div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {modulo.aulas.map((aula, idx) => (
                <button
                  key={aula.id}
                  onClick={() => setAulaAtivaIdx(idx)}
                  className={`w-full flex items-center gap-4 p-4 rounded-[20px] border transition-all ${
                    aulaAtivaIdx === idx ? 'bg-blue-600 border-blue-400' : 'bg-white/5 border-transparent hover:bg-white/10'
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