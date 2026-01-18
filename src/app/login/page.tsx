"use client";
import { useState } from 'react';
import { Lock, Mail, ChevronRight, ShieldCheck } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Limpeza total de espaços e ajuste de letras (Tratamento de erro humano)
    const typedEmail = email.trim().toLowerCase();
    const typedPass = password.trim();

    // 2. Suas credenciais EXATAS (Cuidado com o @ maiúsculo na senha se houver)
    const ADMIN_EMAIL = "samuelcruzc1@gmail.com";
    const ADMIN_PASS = "Retencao@2026"; // Verifique se o R é maiúsculo mesmo
    
    const OPERADOR_EMAIL = "operador@cifra.com";
    const OPERADOR_PASS = "cifra123";

    console.log("Tentando login com:", typedEmail); // Para você ver no F12 se o e-mail está certo

    if (typedEmail === ADMIN_EMAIL && typedPass === ADMIN_PASS) {
      localStorage.setItem('@retencao-start:isLogged', 'true');
      localStorage.setItem('@retencao-start:role', 'admin');
      window.location.href = "/admin"; // Força o refresh para o layout ler o novo cargo
    } 
    else if (typedEmail === OPERADOR_EMAIL && typedPass === OPERADOR_PASS) {
      localStorage.setItem('@retencao-start:isLogged', 'true');
      localStorage.setItem('@retencao-start:role', 'operador');
      window.location.href = "/";
    } 
    else {
      setError(true);
      // Remove erros antigos caso existam
      localStorage.removeItem('@retencao-start:isLogged');
      localStorage.removeItem('@retencao-start:role');
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]" />

      <div className="w-full max-w-[450px] relative z-10">
        <div className="text-center mb-10 space-y-2">
           <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600/10 border border-blue-500/20 rounded-2xl mb-4 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
              <ShieldCheck size={32} className="text-blue-500" />
           </div>
           <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic leading-none">
              RETENÇÃO <span className="text-blue-600">START</span>
           </h1>
           <p className="text-slate-500 font-medium text-sm">Área de Acesso Restrito</p>
        </div>

        <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/5 p-10 rounded-[40px] shadow-2xl space-y-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">E-mail</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input 
                  type="email" 
                  autoComplete="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(false); }}
                  placeholder="Seu e-mail" 
                  className={`w-full bg-black/40 border ${error ? 'border-red-500/50 text-red-200' : 'border-white/5 text-white'} p-4 pl-12 rounded-2xl outline-none focus:border-blue-500 transition-all font-medium text-sm`}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Senha</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input 
                  type="password" 
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(false); }}
                  placeholder="••••••••" 
                  className={`w-full bg-black/40 border ${error ? 'border-red-500/50 text-red-200' : 'border-white/5 text-white'} p-4 pl-12 rounded-2xl outline-none focus:border-blue-500 transition-all font-medium text-sm`}
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 py-3 rounded-xl">
                <p className="text-red-400 text-[10px] font-bold uppercase text-center tracking-widest animate-pulse">
                  E-mail ou senha incorretos
                </p>
              </div>
            )}

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black uppercase text-[11px] tracking-widest py-5 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 active:scale-[0.98] group">
              Acessar Plataforma
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}