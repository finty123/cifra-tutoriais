"use client";
import { useState, useEffect } from 'react';
import { LogOut, ShieldCheck } from 'lucide-react';
import { ModuleCard } from '../components/ModuleCard';
import { LessonModal } from '../components/LessonModal';
import { Modulo } from '../types';

export default function Home() {
  const [selectedModulo, setSelectedModulo] = useState<Modulo | null>(null);
  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [isClient, setIsClient] = useState(false); // Adicionado para segurança de hidratação

  const STORAGE_KEY = '@retencao-start:modulos';

  useEffect(() => {
    // Avisa que já estamos no navegador
    setIsClient(true);

    const carregarModulos = () => {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          try {
            setModulos(JSON.parse(saved));
          } catch (e) {
            console.error("Erro ao ler módulos", e);
          }
        }
      }
    };

    carregarModulos();
    window.addEventListener('storage', carregarModulos);
    return () => window.removeEventListener('storage', carregarModulos);
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem('@retencao-start:isLogged');
      localStorage.removeItem('@retencao-start:role');
      window.location.href = "/login";
    }
  };

  // Se ainda estiver no servidor, renderiza um fundo escuro básico para evitar erros de "document"
  if (!isClient) {
    return <div className="min-h-screen bg-[#020617]" />;
  }

  return (
    <div className="min-h-screen bg-[#020617] pb-20 overflow-x-hidden">
      
      {/* HEADER RESPONSIVO */}
      <header className="fixed top-0 left-0 right-0 z-[100] bg-[#020617]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-20 h-20 md:h-24 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
             <ShieldCheck size={20} className="text-blue-500 md:w-6 md:h-6" />
             <h1 className="text-base md:text-xl font-black italic uppercase text-white tracking-tighter">
                RETENÇÃO <span className="text-blue-600">START</span>
             </h1>
          </div>
          <button 
            onClick={handleLogout} 
            className="bg-white/5 hover:bg-red-500/20 text-white border border-white/10 px-4 py-2 md:px-6 md:py-3 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2"
          >
            <LogOut size={14} /> <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </header>

      {/* HERO SECTION RESPONSIVA */}
      <section className="relative min-h-[60vh] md:h-[70vh] flex items-center px-4 sm:px-8 lg:px-20 pt-32 md:pt-24">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative z-20 max-w-4xl space-y-4 md:space-y-6">
          <h1 className="text-5xl sm:text-7xl lg:text-9xl font-black tracking-tighter text-white italic leading-[0.9]">
            RETENÇÃO <br /> <span className="text-blue-600 drop-shadow-[0_0_15px_rgba(37,99,235,0.4)]">START</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-lg max-w-md md:max-w-2xl font-medium leading-relaxed">
            Acesse o conteúdo exclusivo para dominar as ferramentas de retenção e escalar seus resultados.
          </p>
        </div>
      </section>

      {/* GRID DE MÓDULOS */}
      <div className="px-4 sm:px-8 lg:px-20 space-y-8 md:space-y-12">
        <div className="flex items-center gap-4">
            <h3 className="text-lg md:text-2xl font-black italic text-white uppercase border-b-2 border-blue-600 pb-2 md:pb-4 inline-block">
                Módulos <span className="text-blue-500">disponíveis</span>
            </h3>
            <div className="flex-1 h-[1px] bg-white/5" />
        </div>

        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8">
          {modulos.length > 0 ? (
            modulos.map((modulo) => (
              <ModuleCard 
                key={modulo.id}
                titulo={modulo.titulo}
                aulasCount={modulo.aulas.length}
                capaUrl={modulo.capaUrl}
                onClick={() => setSelectedModulo(modulo)}
              />
            ))
          ) : (
            <div className="col-span-full py-16 md:py-20 text-center border border-dashed border-white/10 rounded-[30px] md:rounded-[40px] text-slate-500 font-medium italic bg-white/[0.02]">
              Nenhum módulo publicado no momento.
            </div>
          )}
        </div>
      </div>

      <LessonModal 
        modulo={selectedModulo} 
        isOpen={!!selectedModulo} 
        onClose={() => setSelectedModulo(null)} 
      />
    </div>
  );
}