"use client";
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, ShieldCheck, Loader2 } from 'lucide-react';
import { Modulo } from '../types';
import { supabase } from '@/lib/supabase';

const ModuleCard = dynamic(() => import('../components/ModuleCard').then(mod => mod.ModuleCard), { 
  ssr: false,
  loading: () => <div className="h-48 md:h-64 bg-white/5 animate-pulse rounded-[20px] md:rounded-[30px]" />
});

const LessonModal = dynamic(() => import('../components/LessonModal').then(mod => mod.LessonModal), { 
  ssr: false 
});

export default function Home() {
  const router = useRouter();
  const [selectedModulo, setSelectedModulo] = useState<Modulo | null>(null);
  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);
    const isLogged = localStorage.getItem("@retencao-start:isLogged");
    if (!isLogged) {
      router.push("/login");
      return;
    }

    const buscarDados = async () => {
      try {
        const { data, error } = await supabase
          .from('modulos')
          .select(`*, aulas (*)`)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const formatados = data.map((m: any) => ({
          ...m,
          capaUrl: m.capa_url,
          aulas: m.aulas.map((a: any) => ({
            ...a,
            videoUrl: a.video_url
          })).sort((a: any, b: any) => a.ordem - b.ordem)
        }));

        setModulos(formatados);
      } catch (err) {
        console.error("Erro ao carregar banco de dados:", err);
      } finally {
        setLoading(false);
      }
    };

    buscarDados();
  }, [router]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem('@retencao-start:isLogged');
      localStorage.removeItem('@retencao-start:role');
      window.location.href = "/login";
    }
  };

  if (!isClient) return <div className="min-h-screen bg-[#020617]" />;

  return (
    <div className="min-h-screen bg-[#020617] pb-20 overflow-x-hidden">
      
      {/* HEADER AJUSTADO (Mais slim no mobile) */}
      <header className="fixed top-0 left-0 right-0 z-[100] bg-[#020617]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-[1600px] mx-auto px-4 md:px-20 h-16 md:h-24 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
             <ShieldCheck size={20} className="text-blue-500" />
             <h1 className="text-sm md:text-xl font-black italic uppercase text-white tracking-tighter">
                RETENÇÃO <span className="text-blue-600">START</span>
             </h1>
          </div>
          <button 
            onClick={handleLogout} 
            className="bg-white/5 hover:bg-red-500/20 text-white border border-white/10 px-3 py-2 md:px-6 md:py-3 rounded-lg md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2"
          >
            <LogOut size={12} /> <span>Sair</span>
          </button>
        </div>
      </header>

      {/* HERO SECTION AJUSTADA */}
      <section className="relative min-h-[40vh] md:min-h-[60vh] flex items-center px-6 lg:px-20 pt-24 md:pt-32">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-48 md:w-72 h-48 md:h-72 bg-blue-600/10 blur-[80px] md:blur-[120px] rounded-full pointer-events-none" />
        <div className="relative z-20 max-w-4xl space-y-4 md:space-y-6">
          <h1 className="text-4xl sm:text-7xl lg:text-9xl font-black tracking-tighter text-white italic leading-[0.9]">
            RETENÇÃO <br /> <span className="text-blue-600 drop-shadow-[0_0_20px_rgba(37,99,235,0.3)]">START</span>
          </h1>
          <p className="text-slate-400 text-xs md:text-lg max-w-[280px] md:max-w-2xl font-medium leading-relaxed">
            Domine as ferramentas de retenção com o treinamento mais completo do mercado.
          </p>
        </div>
      </section>

      {/* ÁREA DE CONTEÚDO */}
      <div className="px-4 md:px-20 space-y-8 md:space-y-14">
        <div className="flex items-center gap-4">
            <h3 className="text-base md:text-2xl font-black italic text-white uppercase border-b-2 border-blue-600 pb-2 inline-block">
                Módulos <span className="text-blue-500">disponíveis</span>
            </h3>
            <div className="flex-1 h-[1px] bg-white/5" />
        </div>

        {loading ? (
          <div className="flex flex-col items-center py-20 gap-4">
            <Loader2 className="animate-spin text-blue-500" size={32} />
            <p className="text-slate-500 font-bold italic uppercase text-[10px] tracking-widest">Sincronizando...</p>
          </div>
        ) : (
          /* GRID RESPONSIVO: 2 colunas no mobile, 5 no desktop */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-10">
            {modulos.length > 0 ? (
              modulos.map((modulo) => (
                <div key={modulo.id} className="transform transition-transform active:scale-95">
                   <ModuleCard 
                    titulo={modulo.titulo}
                    aulasCount={modulo.aulas.length}
                    capaUrl={modulo.capaUrl}
                    onClick={() => setSelectedModulo(modulo)}
                  />
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center border border-dashed border-white/10 rounded-[20px] text-slate-500 text-xs italic bg-white/[0.01]">
                Nenhum conteúdo publicado.
              </div>
            )}
          </div>
        )}
      </div>

      <LessonModal 
        modulo={selectedModulo} 
        isOpen={!!selectedModulo} 
        onClose={() => setSelectedModulo(null)} 
      />
    </div>
  );
}