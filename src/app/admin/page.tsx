"use client";
import { useState, useRef, useEffect } from 'react';
import { Plus, Trash2, Upload, ChevronLeft, Edit3, Save } from 'lucide-react';
import { Modulo, Aula } from '../types/index';

export default function AdminPanel() {
  const [view, setView] = useState<'lista' | 'edit'>('lista');
  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [moduloAtivo, setModuloAtivo] = useState<Modulo | null>(null);
  const [capaPreview, setCapaPreview] = useState<string | null>(null);
  const [novaAula, setNovaAula] = useState({ titulo: '', descricao: '', videoUrl: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const STORAGE_KEY = '@retencao-start:modulos';

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setModulos(JSON.parse(saved));
  }, []);

  const persistirDados = (novosModulos: Modulo[]) => {
    setModulos(novosModulos);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(novosModulos));
  };

  const handleNovoModulo = () => {
    setModuloAtivo({ id: Math.random().toString(36).substr(2, 9), titulo: '', descricao: '', capaUrl: '', aulas: [] });
    setCapaPreview(null);
    setView('edit');
  };

  const handleEditarModulo = (m: Modulo) => {
    setModuloAtivo(m);
    setCapaPreview(m.capaUrl);
    setView('edit');
  };

  const handleSalvarTudo = () => {
    if (!moduloAtivo || !moduloAtivo.titulo) {
      alert("O título do módulo é obrigatório!");
      return;
    }
    const index = modulos.findIndex(m => m.id === moduloAtivo.id);
    const novosModulos = index >= 0 
      ? modulos.map(m => m.id === moduloAtivo.id ? moduloAtivo : m)
      : [...modulos, moduloAtivo];

    persistirDados(novosModulos);
    setView('lista');
  };

  const adicionarAula = () => {
    if (!novaAula.titulo || !moduloAtivo) return;
    const aula: Aula = { 
      id: Math.random().toString(36).substr(2, 9), 
      ...novaAula 
    };
    setModuloAtivo({ ...moduloAtivo, aulas: [...moduloAtivo.aulas, aula] });
    setNovaAula({ titulo: '', descricao: '', videoUrl: '' });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setCapaPreview(result);
        setModuloAtivo(prev => prev ? { ...prev, capaUrl: result } : null);
      };
      reader.readAsDataURL(file);
    }
  };

  if (view === 'lista') {
    return (
      <div className="min-h-screen bg-[#020617] p-4 sm:p-8 lg:p-20">
        <div className="max-w-6xl mx-auto space-y-8 md:space-y-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-8">
            <h1 className="text-2xl md:text-4xl font-black italic text-white uppercase">
              MEUS <span className="text-blue-500">MÓDULOS</span>
            </h1>
            <button onClick={handleNovoModulo} className="w-full sm:w-auto bg-blue-600 text-white font-black text-[10px] tracking-widest px-8 py-4 rounded-2xl flex items-center justify-center gap-2">
              <Plus size={16} /> NOVO MÓDULO
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {modulos.map(m => (
              <div key={m.id} className="bg-slate-900/40 border border-white/5 rounded-[24px] md:rounded-[32px] overflow-hidden group">
                <div className="aspect-[2/3] relative bg-black/20">
                  <img src={m.capaUrl || ''} className="w-full h-full object-cover opacity-60" alt="" />
                  <div className="absolute inset-0 flex items-center justify-center sm:opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 gap-2 md:gap-4">
                    <button onClick={() => handleEditarModulo(m)} className="bg-blue-600 p-2 md:p-3 rounded-xl"><Edit3 size={16} /></button>
                    <button onClick={() => { if(confirm("Excluir?")) persistirDados(modulos.filter(x => x.id !== m.id)) }} className="bg-red-600 p-2 md:p-3 rounded-xl"><Trash2 size={16} /></button>
                  </div>
                </div>
                <div className="p-3 md:p-5 text-center">
                  <h4 className="text-white font-bold uppercase italic text-[10px] md:text-sm truncate">{m.titulo}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] p-4 sm:p-8 lg:p-20 pb-32">
      <div className="max-w-6xl mx-auto space-y-8 md:space-y-12">
        <div className="flex justify-between items-center border-b border-white/5 pb-8">
          <button onClick={() => setView('lista')} className="text-slate-500 font-black text-[10px] md:text-xs uppercase flex items-center gap-2">
            <ChevronLeft size={16} /> Voltar
          </button>
          <button onClick={handleSalvarTudo} className="bg-blue-600 text-white font-black uppercase text-[10px] px-6 md:px-10 py-3 md:py-4 rounded-xl md:rounded-2xl">
            Salvar
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
          {/* COLUNA ESQUERDA: CAPA E TÍTULO */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900/40 border border-white/5 p-6 md:p-8 rounded-[30px] md:rounded-[40px] space-y-6">
              <div className="space-y-3">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Capa (2:3)</label>
                <div onClick={() => fileInputRef.current?.click()} className="relative aspect-[2/3] rounded-2xl border-2 border-dashed border-white/10 overflow-hidden flex items-center justify-center bg-black/20 cursor-pointer">
                  {capaPreview ? <img src={capaPreview} className="absolute inset-0 w-full h-full object-cover" alt="" /> : <Upload size={24} className="text-slate-600" />}
                </div>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
              </div>
              <input value={moduloAtivo?.titulo} onChange={(e) => setModuloAtivo({...moduloAtivo!, titulo: e.target.value})} type="text" placeholder="Título do Módulo" className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-white text-sm outline-none focus:border-blue-500" />
            </div>
          </div>

          {/* COLUNA DIREITA: AULAS */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-blue-600/5 border border-blue-500/20 p-6 md:p-8 rounded-[30px] md:rounded-[40px] space-y-4">
              <h4 className="text-white font-bold text-[10px] uppercase tracking-widest">Nova Aula</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input value={novaAula.titulo} onChange={(e) => setNovaAula({...novaAula, titulo: e.target.value})} type="text" placeholder="Título da Aula" className="bg-black/40 border border-white/5 p-4 rounded-xl text-white outline-none focus:border-blue-500 text-sm" />
                <input value={novaAula.videoUrl} onChange={(e) => setNovaAula({...novaAula, videoUrl: e.target.value})} type="text" placeholder="Link YouTube" className="bg-black/40 border border-white/5 p-4 rounded-xl text-white outline-none focus:border-blue-500 text-sm" />
              </div>

              {/* CAMPO DE LEGENDA (DESCRIÇÃO) */}
              <textarea 
                value={novaAula.descricao} 
                onChange={(e) => setNovaAula({...novaAula, descricao: e.target.value})} 
                placeholder="Legenda da Aula (Opcional)"
                className="w-full bg-black/40 border border-white/5 p-4 rounded-xl text-white outline-none focus:border-blue-500 text-sm h-24 resize-none"
              />

              <button onClick={adicionarAula} className="w-full bg-blue-600 text-white font-black uppercase text-[10px] py-4 rounded-xl flex items-center justify-center gap-2">
                <Plus size={16} /> Adicionar Aula
              </button>
            </div>

            {/* LISTA DE AULAS ADICIONADAS */}
            <div className="space-y-3">
              {moduloAtivo?.aulas.map((aula, idx) => (
                <div key={aula.id} className="bg-slate-900/40 border border-white/5 p-4 rounded-2xl flex items-center justify-between group">
                  <div className="flex flex-col">
                    <span className="text-white text-sm font-bold">{idx + 1}. {aula.titulo}</span>
                    <span className="text-slate-500 text-[10px] truncate max-w-[200px] md:max-w-md">{aula.descricao}</span>
                  </div>
                  <button onClick={() => setModuloAtivo({...moduloAtivo!, aulas: moduloAtivo!.aulas.filter(a => a.id !== aula.id)})} className="text-red-500/50 hover:text-red-500 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}