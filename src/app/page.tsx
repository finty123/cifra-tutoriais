"use client";
import { useState, useEffect } from 'react';
import { LogOut, ShieldCheck } from 'lucide-react';
import { ModuleCard } from '../components/ModuleCard';
import { LessonModal } from '../components/LessonModal';
import { Modulo } from '../types';

export default function Home() {
  const [selectedModulo, setSelectedModulo] = useState<Modulo | null>(null);
  const [modulos, setModulos] = useState<Modulo[]>([]);

  // MESMA CHAVE DO ADMIN
  const STORAGE_KEY = '@retencao-start:modulos';

  useEffect(() => {
    const carregarModulos = () => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setModulos(JSON.parse(saved));
      }
    };

    carregarModulos();
    // Escuta se o Admin salvou algo novo em outra aba
    window.addEventListener('storage', carregarModulos);
    return () => window.removeEventListener('storage', carregarModulos);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('@retencao-start:isLogged');
    localStorage.removeItem('@retencao-start:role');
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-[#020617] pb-20 overflow-x-hidden">
      
      <header className="fixed top-0 left-0 right-0 z-[100] bg-[#020617]/60 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-[1600px] mx-auto px-8 lg:px-20 h-24 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <ShieldCheck size={24} className="text-blue-500" />
             <h1 className="text-xl font-black italic uppercase text-white">RETENÇÃO <span className="text-blue-600">START</span></h1>
          </div>
          <button onClick={handleLogout} className="bg-white/5 hover:bg-red-500/10 text-white border border-white/10 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
            <LogOut size={14} className="inline mr-2" /> Sair
          </button>
        </div>
      </header>

      <section className="relative h-[70vh] flex items-center px-8 lg:px-20 pt-24">
        <div className="relative z-20 max-w-4xl space-y-6">
          <h1 className="text-7xl lg:text-9xl font-black tracking-tighter text-white italic">
            RETENÇÃO <br /> <span className="text-blue-600">START</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl font-medium">Acesse o conteúdo para entender sobre as ferramentas da retanção.</p>
        </div>
      </section>

      <div className="px-8 lg:px-20 space-y-12">
        <h3 className="text-2xl font-black italic text-white uppercase border-b border-white/5 pb-6">Módulos  <span className="text-blue-500"> disponíveis</span></h3>

        {/* GRID AJUSTADO PARA CAPAS VERTICAIS (MAIS COLUNAS) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
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
            <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-[40px] text-slate-500 font-medium italic">
              Nenhum módulo publicado.
            </div>
          )}
        </div>
      </div>

      <LessonModal modulo={selectedModulo} isOpen={!!selectedModulo} onClose={() => setSelectedModulo(null)} />
    </div>
  );
}