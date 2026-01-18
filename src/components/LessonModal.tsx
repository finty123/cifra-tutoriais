"use client";
import { useState, useEffect } from 'react';
import { X, Play, Clock, ChevronRight } from 'lucide-react';
// Importação corrigida para evitar erros de exportação no Webpack
import Plyr from 'plyr-react'; 
import "plyr/dist/plyr.css"; 

export function LessonModal({ modulo, isOpen, onClose }: any) {
  const [aulaAtiva, setAulaAtiva] = useState<any>(null);

  useEffect(() => {
    if (modulo?.aulas?.length > 0) {
      setAulaAtiva(modulo.aulas[0]);
    }
  }, [modulo, isOpen]);

  if (!isOpen || !modulo) return null;

  // Função para pegar o ID do vídeo (YouTube/Vimeo)
  const getVideoId = (url: string) => {
    if (!url) return null;
    if (url.includes('youtube.com')) return url.split('v=')[1]?.split('&')[0];
    if (url.includes('youtu.be')) return url.split('/').pop();
    if (url.includes('vimeo.com')) return url.split('/').pop();
    return url;
  };

  const videoId = getVideoId(aulaAtiva?.videoUrl);
  const provider = aulaAtiva?.videoUrl?.includes('vimeo') ? 'vimeo' : 'youtube';

  const plyrProps = {
    source: {
      type: 'video',
      sources: [{ src: videoId, provider: provider }],
    } as any,
    options: {
      controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'settings', 'fullscreen'],
      hideControls: false,
      resetOnEnd: true,
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-10">
      <div className="absolute inset-0 bg-[#020617]/95 backdrop-blur-xl" onClick={onClose} />
      
      <div className="relative bg-[#020617] w-full max-w-7xl max-h-[90vh] rounded-[48px] border border-white/10 overflow-hidden flex flex-col lg:flex-row shadow-2xl">
        
        {/* PLAYER E DESCRIÇÃO */}
        <div className="w-full lg:w-[70%] bg-black flex flex-col border-r border-white/5">
          <div className="aspect-video bg-black plyr-blue-theme">
            {videoId ? (
              <div className="w-full h-full">
                <Plyr {...plyrProps} />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-600 font-bold uppercase text-[10px] tracking-widest">
                Selecione uma aula na lista ao lado
              </div>
            )}
          </div>
          
          <div className="p-12 space-y-4 overflow-y-auto">
             <div className="flex items-center gap-3">
                <span className="bg-blue-600/10 text-blue-500 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Aula Ativa</span>
                <span className="h-px w-12 bg-white/10"></span>
             </div>
             <h2 className="text-4xl font-black italic uppercase text-white tracking-tighter">
                {aulaAtiva?.titulo || modulo.titulo}
             </h2>
             <p className="text-slate-400 font-medium leading-relaxed max-w-2xl text-lg">
                {aulaAtiva?.descricao || modulo.descricao}
             </p>
          </div>
        </div>

        {/* LISTA DE AULAS */}
        <div className="w-full lg:w-[30%] p-8 overflow-y-auto bg-[#050505]/40">
          <h3 className="text-xs font-black text-blue-500 uppercase tracking-[0.4em] mb-8">Conteúdo</h3>
          <div className="space-y-4">
            {modulo.aulas?.map((aula: any, index: number) => (
              <button 
                key={aula.id} 
                onClick={() => setAulaAtiva(aula)}
                className={`w-full group flex items-center gap-5 p-5 rounded-[32px] border transition-all text-left
                  ${aulaAtiva?.id === aula.id ? 'bg-blue-600 border-blue-500 shadow-xl' : 'bg-white/[0.03] border-transparent hover:border-white/10'}`}
              >
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs
                  ${aulaAtiva?.id === aula.id ? 'bg-white text-blue-600' : 'bg-white/5 text-slate-500'}`}>
                  {(index + 1).toString().padStart(2, '0')}
                </div>
                <div className="flex-1">
                  <h4 className={`font-bold text-sm ${aulaAtiva?.id === aula.id ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>
                    {aula.titulo}
                  </h4>
                </div>
                {aulaAtiva?.id === aula.id && <div className="w-2 h-2 bg-white rounded-full animate-ping" />}
              </button>
            ))}
          </div>
        </div>

        <button onClick={onClose} className="absolute top-8 right-8 z-50 bg-white/5 p-3 rounded-full hover:bg-red-500 transition-all border border-white/10">
          <X size={20} className="text-white" />
        </button>
      </div>
    </div>
  );
}