
import React, { useState } from 'react';
import { UserRole } from '../types';
import { ICONS } from '../constants';

interface LoginProps {
  onLogin: (role: UserRole, name: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [step, setStep] = useState<'role' | 'credentials'>('role');
  const [selectedRole, setSelectedRole] = useState<UserRole>('seller');
  const [name, setName] = useState('');

  const handleRoleSelect = (role: UserRole) => {
    if (role === 'admin') {
      onLogin('admin', 'Administrador');
    } else {
      setSelectedRole(role);
      setStep('credentials');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onLogin('seller', name);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafcfb] flex flex-col items-center justify-center p-6 relative">
      <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-500 mb-12">
        
        {/* Logo y Encabezado */}
        <div className="text-center space-y-3">
          <div className="inline-block p-4 bg-emerald-500 text-white rounded-[2rem] shadow-xl shadow-emerald-100 mb-2">
            {ICONS.Logo}
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Se Libre</h1>
          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em]">Línea de Luz Interna</p>
        </div>

        {step === 'role' ? (
          <div className="space-y-4">
            <h2 className="text-center text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">¿Quién accede hoy?</h2>
            
            <button 
              onClick={() => handleRoleSelect('seller')}
              className="w-full bg-white p-6 rounded-[2.5rem] border border-emerald-50 shadow-sm hover:shadow-md hover:border-emerald-100 transition-all flex items-center gap-5 group"
            >
              <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                {ICONS.Sales}
              </div>
              <div className="text-left">
                <span className="block text-lg font-black text-slate-800">Vendedor</span>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Acceso al Mostrador</span>
              </div>
            </button>

            <button 
              onClick={() => handleRoleSelect('admin')}
              className="w-full bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all flex items-center gap-5 group"
            >
              <div className="p-4 bg-slate-50 text-slate-400 rounded-2xl group-hover:bg-slate-800 group-hover:text-white transition-colors">
                {ICONS.Reports}
              </div>
              <div className="text-left">
                <span className="block text-lg font-black text-slate-800">Administrador</span>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gestión total e informes</span>
              </div>
            </button>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-[3rem] shadow-xl shadow-emerald-50/50 border border-emerald-50 space-y-6">
            <button 
              onClick={() => setStep('role')}
              className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-1 hover:text-emerald-500 transition-colors"
            >
              ← Volver a selección
            </button>
            
            <div className="space-y-1">
              <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">
                Acceso Vendedor
              </h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Identifícate para entrar</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tu Nombre</label>
                <input 
                  required
                  autoFocus
                  type="text" 
                  placeholder="Ej: María Luz"
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-emerald-50 transition-all"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <button 
                type="submit"
                className="w-full py-5 bg-emerald-500 text-white font-black rounded-[1.8rem] shadow-xl shadow-emerald-100 active:scale-95 transition-all uppercase tracking-[0.2em] text-xs"
              >
                Entrar a la Tienda
              </button>
            </form>
          </div>
        )}

        <div className="text-center">
          <p className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.2em]">© 2024 Se Libre - Modo Desarrollo Activo</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
