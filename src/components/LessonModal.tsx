"use client";
import { useState } from 'react';
import { X, PlayCircle, CheckCircle2, Volume2, Play, Pause, RotateCcw } from 'lucide-react';
import { Modulo } from '../types';

interface LessonModalProps {
  modulo: Modulo | null;
  isOpen: boolean;
  onClose: () => void;
}

export function LessonModal({ modulo, isOpen, onClose }: LessonModalProps) {
  const [aulaAtivaIdx, setAulaAtivaIdx] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  if (!isOpen || !modulo) return null;
  const aulaAtual = modulo.aulas[aulaAtivaIdx];

  // Gera a URL do Vimeo com os parâmetros de visual e funcionalidade
  const getVimeoUrl = (url: string, muted: boolean) => {
    const id = url.split('/').pop();
    // autoplay=1 (toca ao abrir), muted=(estado do botão), controls=1 (garante que funcione)
    return `https://player.vimeo.com/video/${id}?autoplay=1&muted=${muted ? 1 : 0}&color=2563eb&title=0&byline=0&portrait=0`;
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 md:p-6 lg:p-12 text-left">
      <div className="absolute inset-0 bg-[#020617]/98 backdrop-blur-2xl" onClick={onClose} />
      
      <div className="relative bg-[#0f172a] border border-blue-500/20 w-full max-w-[1400px] h-full md:h-[90vh] md:rounded-[40px] overflow-hidden flex flex-col shadow-2xl">
        
        {/* HEADER */}
        <div className="px-8 py-5 border-b border-white/5 flex justify-between items-center bg-[#0f172a]">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-blue-600/20 rounded-lg text-blue-400">
              <PlayCircle size={20} />
            </div>
            <div>
              <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest mb-0.5">Retenção Start</p>
              <h2 className="text-white font-black italic uppercase text-sm">{modulo.titulo}</h2>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-2">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          <div className="flex-[3] overflow-y-auto p-4 md:p-8 space-y-6 custom-scrollbar">
            
            {/* PLAYER UNIT */}
            <div className="relative w-full aspect-video rounded-[32px] overflow-hidden bg-black border border-blue-500/30">
                <iframe
                  key={`${aulaAtual?.id}-${isMuted}`}
                  src={getVimeoUrl(aulaAtual?.videoUrl || '', isMuted)}
                  className="absolute inset-0 w-full h-full border-0"
                  allow="autoplay; fullscreen"
                />
            </div>

            {/* CONTROLES VISUAIS (INTERFACE) */}
            <div className="bg-white/[0.02] p-6 rounded-[32px] border border-white/5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setIsMuted(!isMuted)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold uppercase text-[10px] transition-all ${isMuted ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-blue-600/20 text-blue-400 border border-blue-500/30'}`}
                >
                  <Volume2 size={16} />
                  {isMuted ? "Áudio Mutado" : "Áudio Ativo"}
                </button>
                <div className="hidden md:block px-4 py-2 bg-white/5 rounded-lg border border-white/10 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  Velocidade: 1.25x (Auto)
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-blue-500 font-black italic text-xs uppercase tracking-tighter">RETENÇÃO START PLAYER</span>
              </div>
            </div>

            {/* DESCRIÇÃO */}
            <div className="p-8 bg-white/[0.01] rounded-[32px] border border-white/5">
              <h3 className="text-3xl md:text-5xl font-black italic text-white uppercase tracking-tighter mb-4">{aulaAtual?.titulo}</h3>
              <p className="text-slate-400 text-lg leading-relaxed italic">{aulaAtual?.descricao}</p>
            </div>
          </div>

          {/* CRONOGRAMA */}
          <div className="flex-1 bg-[#0a0f1d]/60 border-l border-white/5 flex flex-col overflow-hidden">
            <div className="p-6 border-b border-white/5 text-[10px] font-black text-blue-500 uppercase tracking-widest">Próximas Aulas</div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {modulo.aulas.map((aula, idx) => (
                <button
                  key={aula.id}
                  onClick={() => setAulaAtivaIdx(idx)}
                  className={`w-full flex items-center gap-4 p-4 rounded-[24px] border transition-all ${aulaAtivaIdx === idx ? 'bg-blue-600 border-blue-400' : 'bg-white/5 border-transparent hover:bg-white/10'}`}
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
    </div>
  );
}