"use client";
import { X, PlayCircle } from 'lucide-react';
import { Modulo, Aula } from '../types';

interface LessonModalProps {
  modulo: Modulo | null;
  isOpen: boolean;
  onClose: () => void;
}

export function LessonModal({ modulo, isOpen, onClose }: LessonModalProps) {
  if (!isOpen || !modulo) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10">
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#020617]/95 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative bg-slate-900 border border-white/10 w-full max-w-5xl max-h-[90vh] rounded-[32px] overflow-hidden flex flex-col shadow-2xl">
        
        {/* Header do Modal */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <div>
            <h2 className="text-white font-black italic uppercase text-xl">{modulo.titulo}</h2>
            <p className="text-blue-500 text-xs font-bold uppercase tracking-widest">{modulo.aulas.length} Aulas disponíveis</p>
          </div>
          <button onClick={onClose} className="bg-white/5 p-2 rounded-full hover:bg-white/10 text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {modulo.aulas.map((aula, idx) => (
            <div key={aula.id} className="space-y-4 border-b border-white/5 pb-8 last:border-0">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 text-white text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-lg italic">
                  {idx + 1}
                </div>
                <h3 className="text-white font-bold text-lg">{aula.titulo}</h3>
              </div>

              {/* Video Player Inteligente */}
<div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-white/5 shadow-inner">
  {aula.videoUrl.includes('youtube.com') || aula.videoUrl.includes('youtu.be') ? (
    <iframe
      src={aula.videoUrl.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")}
      className="w-full h-full"
      allowFullScreen
    />
  ) : aula.videoUrl.endsWith('.mp4') ? (
    <video 
      src={aula.videoUrl} 
      controls 
      className="w-full h-full"
    />
  ) : (
    /* Caso seja Vimeo ou outro Embed direto */
    <iframe
      src={aula.videoUrl}
      className="w-full h-full"
      allowFullScreen
    />
  )}
</div>

              {/* LEGENDA DA AULA (Aparece aqui) */}
              {aula.descricao && (
                <div className="bg-white/[0.03] p-4 rounded-xl border border-white/5">
                   <p className="text-slate-400 text-sm leading-relaxed">
                     {aula.descricao}
                   </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}