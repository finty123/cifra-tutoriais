"use client";
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, ShieldCheck } from 'lucide-react';
import { Modulo } from '../types';

// Importação dinâmica para evitar erro de "document is not defined" no build
const ModuleCard = dynamic(() => import('../components/ModuleCard').then(mod => mod.ModuleCard), { 
  ssr: false,
  loading: () => <div className="h-64 bg-white/5 animate-pulse rounded-[30px]" />
});

const LessonModal = dynamic(() => import('../components/LessonModal').then(mod => mod.LessonModal), { 
  ssr: false 
});

export default function Home() {
  const router = useRouter();
  const [selectedModulo, setSelectedModulo] = useState<Modulo | null>(null);
  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [isClient, setIsClient] = useState(false);

  const STORAGE_KEY = '@retencao-start:modulos';

  useEffect(() => {
    setIsClient(true);

    // VERIFICAÇÃO DE LOGIN (Proteção de Rota)
    const isLogged = localStorage.getItem("@retencao-start:isLogged");
    if (!isLogged) {
      router.push("/login");
      return;
    }

    const carregarModulos = () => {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          try {
            setModulos(JSON.parse(saved));
          } catch (e) {
            console.error("Erro ao carregar módulos:", e);
          }
        }
      }
    };

    carregarModulos();
    window.addEventListener('storage', carregarModulos);
    return () => window.removeEventListener('storage', carregarModulos);
  }, [router]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem('@retencao-start:isLogged');
      localStorage.removeItem('@retencao-start:role');
      window.location.href = "/login";
    }
  };

  // Enquanto verifica o login ou monta o cliente, renderiza um fundo neutro
  if (!isClient) {
    return <div className="min-h-screen bg-[#020617]" />;
  }

  return (
    <div className="min-h-screen bg-[#020617] pb-20 overflow-x-hidden">
      
      {/* HEADER TECH RESPONSIVO */}
      <header className="fixed top-0 left-0 right-0 z-[100] bg-[#020617]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-20 h-20 md:h-24 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
             <ShieldCheck size={22} className="text-blue-500" />
             <h1 className="text-lg md:text-xl font-black italic uppercase text-white tracking-tighter">
                RETENÇÃO <span className="text-blue-600">START</span>
             </h1>
          </div>
          <button 
            onClick={handleLogout} 
            className="bg-white/5 hover:bg-red-500/20 text-white border border-white/10 px-4 py-2 md:px-6 md:py-3 rounded-xl md:rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2"
          >
            <LogOut size={14} /> <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </header>

      {/* HERO SECTION TECH */}
      <section className="relative min-h-[60vh] md:h-[70vh] flex items-center px-6 lg:px-20 pt-32 md:pt-24">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-72 h-72 bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative z-20 max-w-4xl space-y-6">
          <h1 className="text-5xl sm:text-7xl lg:text-9xl font-black tracking-tighter text-white italic leading-[0.9]">
            RETENÇÃO <br /> <span className="text-blue-600 drop-shadow-[0_0_20px_rgba(37,99,235,0.3)]">START</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-lg max-w-md md:max-w-2xl font-medium leading-relaxed">
            Domine as ferramentas de retenção com o treinamento mais completo do mercado.
          </p>
        </div>
      </section>

      {/* ÁREA DE CONTEÚDO */}
      <div className="px-6 lg:px-20 space-y-10 md:space-y-14">
        <div className="flex items-center gap-4">
            <h3 className="text-xl md:text-2xl font-black italic text-white uppercase border-b-2 border-blue-600 pb-3 inline-block">
                Módulos <span className="text-blue-500">disponíveis</span>
            </h3>
            <div className="flex-1 h-[1px] bg-white/5" />
        </div>

        {/* Grid Adaptável: 1 col no mobile, 2 no tablet, até 5 no desktop */}
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-10">
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
            <div className="col-span-full py-20 text-center border border-dashed border-white/10 rounded-[40px] text-slate-500 font-medium italic bg-white/[0.01]">
              Aguardando publicação de conteúdos...
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