"use client";
import { useState, useEffect } from 'react';
import { X, PlayCircle, CheckCircle2 } from 'lucide-react';
import ReactPlayer from 'react-player/lazy';
import { Modulo } from '../types';

interface LessonModalProps {
  modulo: Modulo | null;
  isOpen: boolean;
  onClose: () => void;
}

export function LessonModal({ modulo, isOpen, onClose }: LessonModalProps) {
  const [aulaAtivaIdx, setAulaAtivaIdx] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [loadingVideo, setLoadingVideo] = useState(false);

  // Garante que o código só rode no navegador
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Reseta o estado ao fechar ou trocar de módulo
  useEffect(() => {
    if (!isOpen) {
      setAulaAtivaIdx(0);
      setLoadingVideo(false);
    }
  }, [isOpen]);

  if (!isOpen || !modulo || !isClient) return null;

  const aulaAtual = modulo.aulas[aulaAtivaIdx];

  const handleAulaChange = (idx: number) => {
    if (idx === aulaAtivaIdx) return;
    setLoadingVideo(true);
    setAulaAtivaIdx(idx);
    // Delay de 300ms para "limpar" a memória do navegador antes do próximo vídeo
    setTimeout(() => setLoadingVideo(false), 300);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 md:p-6 lg:p-12">
      <div className="absolute inset-0 bg-[#020617]/95 backdrop-blur-xl" onClick={onClose} />
      
      <div className="relative bg-[#0f172a] border border-blue-500/20 w-full max-w-[1400px] h-full md:h-[90vh] md:rounded-[40px] overflow-hidden flex flex-col shadow-[0_0_100px_rgba(37,99,235,0.1)]">
        
        {/* Header Retenção Start */}
        <div className="px-8 py-5 border-b border-white/5 flex justify-between items-center bg-[#0f172a]">
          <div className="flex items-center gap-4 text-left">
            <div className="p-2.5 bg-blue-600/20 rounded-xl border border-blue-500/30">
                <PlayCircle className="text-blue-400" size={22} />
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
            
            {/* CONTAINER DO PLAYER - ESTILO RETENÇÃO START */}
            <div className="relative w-full aspect-video rounded-[32px] overflow-hidden bg-black border border-blue-500/30 shadow-[0_0_50px_rgba(37,99,235,0.2)]">
                
                {!loadingVideo && aulaAtual ? (
                  <ReactPlayer
                    url={aulaAtual.videoUrl}
                    width="100%"
                    height="100%"
                    controls={true}
                    playing={true}
                    config={{
                      youtube: { playerVars: { showinfo: 0, modestbranding: 1 } },
                      vimeo: { playerOptions: { title: 0, byline: 0, portrait: 0 } }
                    }}
                    style={{ position: 'absolute', top: 0, left: 0 }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-900">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}

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
                
                <button className="flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-black italic uppercase text-sm transition-all shadow-[0_0_30px_rgba(37,99,235,0.3)] group">
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

          {/* CRONOGRAMA LATERAL */}
          <div className="flex-1 bg-[#0a0f1d]/50 border-l border-white/5 flex flex-col overflow-hidden text-left">
            <div className="p-6 border-b border-white/5">
                <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">Lista de Aulas</h4>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {modulo.aulas.map((aula, idx) => (
                    <button
                        key={aula.id}
                        onClick={() => handleAulaChange(idx)}
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

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
      `}</style>
    </div>
  );
}