
import React, { useMemo, useRef } from 'react';
import { StockItem, Sale, DebtStatus, ManualMovement, ManualMovementCategory, PaymentMethod } from '../types';
import { ICONS } from '../constants';
import { storageService } from '../services/storageService';

interface InitialBalances {
  bank: number;
  cash: number;
  usd: number;
}

interface AdministrativeReportProps {
  stock: StockItem[];
  sales: Sale[];
  manualMovements: ManualMovement[];
  initialBalances: InitialBalances;
  onUpdateInitialBalances: (balances: InitialBalances) => void;
}

const AdministrativeReport: React.FC<AdministrativeReportProps> = ({ 
  stock, sales, manualMovements, initialBalances, onUpdateInitialBalances 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- INGRESOS ---
  const salesMetrics = sales.reduce((acc, sale) => {
    sale.payments.forEach(p => {
      if (p.method === PaymentMethod.TRANSFER) acc.bank += p.amount;
      if (p.method === PaymentMethod.CASH) acc.cash += p.amount;
    });
    return acc;
  }, { bank: 0, cash: 0 });

  const manualIncomes = manualMovements
    .filter(m => m.type === 'income')
    .reduce((acc, m) => {
      if (m.paymentMethod === PaymentMethod.TRANSFER) acc.bank += m.amount;
      if (m.paymentMethod === PaymentMethod.CASH) acc.cash += m.amount;
      return acc;
    }, { bank: 0, cash: 0 });

  // --- EGRESOS ---
  const manualExpenses = manualMovements
    .filter(m => m.type === 'expense')
    .reduce((acc, m) => {
      if (m.paymentMethod === PaymentMethod.TRANSFER) acc.bank += m.amount;
      if (m.paymentMethod === PaymentMethod.CASH) acc.cash += m.amount;
      if (m.category === 'Retiro de caja (Resguardo)') acc.resguardo += m.amount;
      else acc.operativos += m.amount;
      return acc;
    }, { bank: 0, cash: 0, resguardo: 0, operativos: 0 });

  // --- CÁLCULO FINAL CAJA VS TOTAL ---
  const registerCash = initialBalances.cash + salesMetrics.cash + manualIncomes.cash - manualExpenses.cash;
  const storedCash = manualExpenses.resguardo;
  const storeTotalCash = registerCash + storedCash;

  const storeFundBank = initialBalances.bank + salesMetrics.bank + manualIncomes.bank - manualExpenses.bank;

  const handleExport = () => {
    storageService.exportDatabase();
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (window.confirm("¿Estás seguro? Esto reemplazará TODOS los datos actuales con los del archivo de respaldo.")) {
        const success = await storageService.importDatabase(file);
        if (success) {
          alert("¡Base de datos restaurada! La aplicación se recargará.");
          window.location.reload();
        } else {
          alert("Error al importar el archivo. Verifica el formato.");
        }
      }
    }
  };

  const clearDatabase = () => {
    if (window.confirm("⚠️ ATENCIÓN: Se borrarán todas las ventas y el stock. ¿Continuar?")) {
      if (window.confirm("❌ ESTA ACCIÓN NO SE PUEDE DESHACER. ¿Estás TOTALMENTE seguro?")) {
        localStorage.clear();
        window.location.reload();
      }
    }
  };

  return (
    <div className="space-y-6 pb-12 overflow-x-hidden">
      <div className="flex flex-col gap-1 px-1">
        <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Estado de Fondos</h2>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Resumen Financiero Profesional</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mx-1">
        <div className="bg-blue-600 rounded-[2rem] p-6 text-white shadow-lg shadow-blue-100">
           <span className="text-[10px] font-black uppercase tracking-widest opacity-60 block mb-1">Fondo en Banco</span>
           <span className="text-3xl font-black tracking-tighter">${storeFundBank.toLocaleString()}</span>
           <div className="h-px bg-white/10 w-full my-4"></div>
           <div className="flex justify-between items-center text-[10px] font-bold opacity-80 uppercase">
              <span>Fondo Inicial:</span>
              <span>${initialBalances.bank.toLocaleString()}</span>
           </div>
        </div>

        <div className="bg-emerald-600 rounded-[2rem] p-6 text-white shadow-lg shadow-emerald-100">
           <span className="text-[10px] font-black uppercase tracking-widest opacity-60 block mb-1">Efectivo Total Tienda</span>
           <span className="text-3xl font-black tracking-tighter">${storeTotalCash.toLocaleString()}</span>
           <div className="h-px bg-white/10 w-full my-4"></div>
           <div className="flex justify-between items-center text-[10px] font-bold opacity-80 uppercase">
              <span>Ingresos Hoy:</span>
              <span>+${(salesMetrics.cash + manualIncomes.cash).toLocaleString()}</span>
           </div>
        </div>
      </div>

      <section className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden mx-1">
        <div className="p-6 bg-slate-50/50 border-b border-slate-50">
           <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Desglose de Efectivo</h3>
        </div>
        <div className="p-8 space-y-6">
           <div className="flex justify-between items-center">
              <div>
                 <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest block">En Caja Registradora</span>
                 <p className="text-[9px] text-slate-400 font-bold">Dinero activo en mostrador</p>
              </div>
              <span className="text-3xl font-black text-emerald-600 tracking-tighter">${registerCash.toLocaleString()}</span>
           </div>
           <div className="h-px bg-slate-50 w-full"></div>
           <div className="flex justify-between items-center">
              <div>
                 <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block">Efectivo Resguardado</span>
                 <p className="text-[9px] text-slate-400 font-bold">Retirado de caja / Guardado</p>
              </div>
              <span className="text-2xl font-black text-slate-800 tracking-tighter">${storedCash.toLocaleString()}</span>
           </div>
           <div className="h-px bg-slate-50 w-full"></div>
           <div className="flex justify-between items-center bg-slate-900 rounded-2xl p-4 text-white">
              <span className="text-[10px] font-black uppercase tracking-widest">Total Líquido</span>
              <span className="text-xl font-black">${storeTotalCash.toLocaleString()}</span>
           </div>
        </div>
      </section>

      {/* GESTIÓN DE BASE DE DATOS (EL BACKEND MANUAL) */}
      <section className="bg-slate-900 rounded-[2.5rem] p-8 mx-1 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-emerald-500 rounded-lg">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-tight">Gestión de Base de Datos</h3>
            <p className="text-[9px] text-slate-400 font-bold uppercase">Respaldo y Seguridad de Información</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <button 
            onClick={handleExport}
            className="flex flex-col items-center justify-center p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all"
          >
            <span className="text-[10px] font-black uppercase mb-1">Exportar</span>
            <span className="text-[8px] text-emerald-400 font-bold uppercase tracking-widest">Respaldo .JSON</span>
          </button>
          
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all"
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".json"
              onChange={handleImport}
            />
            <span className="text-[10px] font-black uppercase mb-1">Importar</span>
            <span className="text-[8px] text-blue-400 font-bold uppercase tracking-widest">Cargar Respaldo</span>
          </button>
        </div>

        <button 
          onClick={clearDatabase}
          className="w-full py-3 text-[9px] font-black text-red-400 uppercase tracking-[0.2em] border border-red-900/30 rounded-xl hover:bg-red-900/20 transition-all"
        >
          Borrar Toda la Base de Datos
        </button>
      </section>

      <section className="bg-slate-50 rounded-[2.5rem] p-8 mx-1 border border-slate-200/50">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 text-center">Balances Iniciales</h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white p-3 rounded-2xl border border-slate-200">
            <label className="text-[8px] font-black text-slate-400 uppercase block mb-1">Banco</label>
            <input type="number" className="w-full bg-transparent font-black text-[12px] outline-none" value={initialBalances.bank} onChange={(e) => onUpdateInitialBalances({...initialBalances, bank: parseFloat(e.target.value) || 0})} />
          </div>
          <div className="bg-white p-3 rounded-2xl border border-slate-200">
            <label className="text-[8px] font-black text-slate-400 uppercase block mb-1">Caja</label>
            <input type="number" className="w-full bg-transparent font-black text-[12px] outline-none" value={initialBalances.cash} onChange={(e) => onUpdateInitialBalances({...initialBalances, cash: parseFloat(e.target.value) || 0})} />
          </div>
          <div className="bg-white p-3 rounded-2xl border border-slate-200">
            <label className="text-[8px] font-black text-slate-400 uppercase block mb-1">USD</label>
            <input type="number" className="w-full bg-transparent font-black text-[12px] outline-none" value={initialBalances.usd} onChange={(e) => onUpdateInitialBalances({...initialBalances, usd: parseFloat(e.target.value) || 0})} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdministrativeReport;
