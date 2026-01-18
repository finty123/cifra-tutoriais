"use client";
import { PlayCircle, BookOpen } from 'lucide-react';

interface ModuleCardProps {
  titulo: string;
  aulasCount: number;
  capaUrl: string;
  progresso?: number;
  onClick: () => void;
}

export function ModuleCard({ titulo, aulasCount, capaUrl, onClick }: ModuleCardProps) {
  return (
    <div 
      onClick={onClick}
      className="group relative bg-slate-900/40 border border-white/5 rounded-[32px] overflow-hidden cursor-pointer hover:border-blue-500/50 transition-all duration-500 hover:translate-y-[-8px] shadow-2xl"
    >
      {/* Container da Imagem Vertical */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <img 
          src={capaUrl} 
          alt={titulo}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Overlay Gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-80" />

        {/* Badge de Aulas */}
        <div className="absolute top-4 right-4 bg-blue-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
          {aulasCount} Aulas
        </div>

        {/* Ícone de Play centralizado no hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.5)]">
            <PlayCircle size={32} className="text-white" />
          </div>
        </div>
      </div>

      {/* Informações do Módulo */}
      <div className="p-6 space-y-2">
        <div className="flex items-center gap-2 text-blue-500 mb-1">
          <BookOpen size={14} />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Módulo</span>
        </div>
        <h3 className="text-xl font-bold text-white uppercase italic leading-tight group-hover:text-blue-400 transition-colors">
          {titulo}
        </h3>
      </div>
    </div>
  );
}