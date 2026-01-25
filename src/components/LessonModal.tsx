"use client";
import { useState, useEffect } from 'react';
import { X, PlayCircle, CheckCircle2, Volume2, Settings } from 'lucide-react';
import { Modulo } from '../types';

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

  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    
    // VIMEO: Customizando cor azul (#2563eb), removendo títulos e forçando interface limpa
    if (url.includes('vimeo.com')) {
      const id = url.split('/').pop();
      // speed=1.25 via parâmetro de URL (disponível em planos Plus/Pro)
      return `https://player.vimeo.com/video/${id}?autoplay=1&color=2563eb&title=0&byline=0&portrait=0&badge=0&autopause=0&speed=1`;
    }
    
    // YOUTUBE: Visual limpo
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const id = url.includes('v=') ? url.split('v=')[1].split('&')[0] : url.split('/').pop();
      return `https://www.youtube.com/embed/${id}?autoplay=1&modestbranding=1&rel=0&showinfo=0&controls=1`;
    }
    return url;
  };

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
          <button onClick={onClose} className="hover:bg-red-500/20 p-2.5 rounded-full transition-all text-slate-400 hover:text-white border border-transparent hover:border-red-500/30">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          <div className="flex-[3] overflow-y-auto p-4 md:p-8 space-y-6 bg-[#0f172a] custom-scrollbar">
            
            {/* CONTAINER DO VÍDEO - COM PLAYER KEY PARA RESETAR AO TROCAR AULA */}
            <div className="relative w-full aspect-video rounded-[32px] overflow-hidden bg-black border border-blue-500/30 shadow-2xl group">
                <iframe
                  key={aulaAtual?.id}
                  src={getEmbedUrl(aulaAtual?.videoUrl || '')}
                  className="absolute inset-0 w-full h-full border-0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                />
                
                {/* MARCA D'ÁGUA START */}
                <div className="absolute top-6 right-8 z-[10] pointer-events-none opacity-40">
                    <span className="text-white font-black italic text-sm tracking-tighter uppercase">
                        Retenção <span className="text-blue-500">Start</span>
                    </span>
                </div>
            </div>

            {/* UI INFERIOR: INFO E DESCRIÇÃO */}
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white/[0.02] p-8 rounded-[32px] border border-white/5">
                <div className="text-left">
                  <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded text-[9px] font-bold text-blue-400 uppercase tracking-widest">Premium</span>
                      <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[9px] font-bold text-slate-400 uppercase tracking-widest">1.25x Speed</span>
                  </div>
                  <h3 className="text-3xl md:text-5xl font-black italic text-white uppercase tracking-tighter leading-none">
                    {aulaAtual?.titulo}
                  </h3>
                </div>
                
                <button className="flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white px-10 py-5 rounded-2xl font-black italic uppercase text-xs transition-all shadow-[0_10px_30px_rgba(37,99,235,0.3)]">
                  <CheckCircle2 size={18} />
                  Concluir Aula
                </button>
              </div>

              {/* DESCRIÇÃO DA AULA (RESTAURADA) */}
              <div className="bg-white/[0.01] border border-white/5 p-8 rounded-[32px] text-left">
                <h4 className="text-blue-500 font-black uppercase text-[10px] tracking-[0.3em] mb-4">Sobre este conteúdo</h4>
                <p className="text-slate-400 text-lg leading-relaxed italic">
                  {aulaAtual?.descricao || "Nenhuma descrição disponível para esta aula."}
                </p>
              </div>
            </div>
          </div>

          {/* CRONOGRAMA LATERAL */}
          <div className="flex-1 bg-[#0a0f1d]/60 border-l border-white/5 flex flex-col overflow-hidden">
            <div className="p-6 border-b border-white/5 text-left">
              <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">Próximas Aulas</h4>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {modulo.aulas.map((aula, idx) => (
                <button
                  key={aula.id}
                  onClick={() => setAulaAtivaIdx(idx)}
                  className={`w-full flex items-center gap-4 p-4 rounded-[24px] border transition-all duration-300 ${
                    aulaAtivaIdx === idx 
                    ? 'bg-blue-600 border-blue-400 shadow-lg scale-[1.02]' 
                    : 'bg-white/5 border-transparent hover:bg-white/10'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${
                    aulaAtivaIdx === idx ? 'bg-white text-blue-600' : 'bg-[#0f172a] text-slate-500'
                  }`}>
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                  <p className={`text-xs font-black uppercase truncate text-left flex-1 ${aulaAtivaIdx === idx ? 'text-white' : 'text-slate-300'}`}>
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