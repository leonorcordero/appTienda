
import React, { useState, useMemo, useEffect } from 'react';
import { Sale, StockItem, PaymentMethod, ManualMovement } from './types';
import { ICONS } from './constants';
import { getLocalDateISO } from './dateUtils';

interface DailyBalanceProps {
  sales: Sale[];
  stock: StockItem[];
  manualMovements: ManualMovement[];
}

const DailyBalance: React.FC<DailyBalanceProps> = ({ sales, stock, manualMovements }) => {
  const [actualCash, setActualCash] = useState<number>(0);
  const [actualTransfer, setActualTransfer] = useState<number>(0);
  const [cashComment, setCashComment] = useState<string>('');
  const [transferComment, setTransferComment] = useState<string>('');
  const [showSummary, setShowSummary] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  
  const todayStr = getLocalDateISO();
  
  useEffect(() => {
    const closedDays = JSON.parse(localStorage.getItem('selibre_closed_days') || '{}');
    if (closedDays[todayStr]) {
      const data = closedDays[todayStr];
      setActualCash(data.actualCash);
      setActualTransfer(data.actualTransfer);
      setCashComment(data.cashComment);
      setTransferComment(data.transferComment);
      setIsClosed(true);
    }
  }, [todayStr]);

  const todaySales = useMemo(() => sales.filter(s => s.date === todayStr), [sales, todayStr]);
  const todayManual = useMemo(() => manualMovements.filter(m => m.date === todayStr), [manualMovements, todayStr]);

  const totals = useMemo(() => {
    // Calcular ingresos por ventas
    const salesCash = todaySales.reduce((acc, sale) => {
      return acc + (sale.payments.find(p => p.method === PaymentMethod.CASH)?.amount || 0);
    }, 0);
    const salesTransfer = todaySales.reduce((acc, sale) => {
      return acc + (sale.payments.find(p => p.method === PaymentMethod.TRANSFER)?.amount || 0);
    }, 0);

    // Calcular ajustes manuales (In/Out)
    const manualCash = todayManual.reduce((acc, m) => {
      if (m.paymentMethod !== PaymentMethod.CASH) return acc;
      return m.type === 'income' ? acc + m.amount : acc - m.amount;
    }, 0);
    const manualTransfer = todayManual.reduce((acc, m) => {
      if (m.paymentMethod !== PaymentMethod.TRANSFER) return acc;
      return m.type === 'income' ? acc + m.amount : acc - m.amount;
    }, 0);

    return { cash: salesCash + manualCash, transfer: salesTransfer + manualTransfer };
  }, [todaySales, todayManual]);

  const diffCash = actualCash - totals.cash;
  const diffTransfer = actualTransfer - totals.transfer;
  const totalDiff = diffCash + diffTransfer;

  const handleCloseDay = () => {
    if (actualCash === 0 && !confirm("¿Seguro que el efectivo en caja es $0?")) return;
    
    const closedDays = JSON.parse(localStorage.getItem('selibre_closed_days') || '{}');
    closedDays[todayStr] = {
      actualCash,
      actualTransfer,
      cashComment,
      transferComment,
      timestamp: new Date().toISOString(),
      diff: totalDiff
    };
    localStorage.setItem('selibre_closed_days', JSON.stringify(closedDays));
    setIsClosed(true);
    setShowSummary(true);
  };

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl md:text-3xl font-black text-slate-800 uppercase tracking-tight">Caja Registradora</h2>
          <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">Control de mostrador - {todayStr}</p>
        </div>
        {isClosed ? (
          <span className="bg-emerald-500 text-white text-[10px] md:text-xs font-black px-4 py-2 rounded-full uppercase tracking-widest border border-emerald-600 shadow-lg shadow-emerald-100">
            ✓ Cuadre Finalizado
          </span>
        ) : (
          <span className="bg-orange-100 text-orange-600 text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest border border-orange-200 animate-pulse">
            Pendiente de Cuadre
          </span>
        )}
      </div>

      {/* Resumen de Ventas y Ajustes */}
      <section className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white shadow-xl shadow-slate-200 flex justify-between items-center relative overflow-hidden">
        <div className="relative z-10">
          <span className="text-[10px] md:text-sm font-black uppercase text-slate-400 tracking-widest block mb-2">Flujo Neto en Mostrador Hoy</span>
          <span className="text-4xl md:text-6xl font-black tracking-tighter">${(totals.cash + totals.transfer).toLocaleString()}</span>
          <p className="text-[9px] text-slate-500 mt-2 uppercase font-bold tracking-widest italic">* Incluye ventas y retiros/ingresos manuales</p>
        </div>
        <div className="p-4 md:p-6 bg-white/10 rounded-[2rem] relative z-10 hidden sm:block">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M7 15h0M12 15h0M17 15h0M7 11h0M12 11h0M17 11h0"/></svg>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
      </section>

      {/* Cuadre de Caja */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* EFECTIVO EN CAJA */}
        <section className={`bg-white rounded-[2.5rem] p-7 md:p-10 border shadow-sm space-y-6 transition-all ${isClosed ? 'opacity-80 ring-1 ring-slate-100' : 'border-slate-100'}`}>
          <div className="flex items-center justify-between">
             <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-4 bg-emerald-500 rounded-full"></span>
                Efectivo Físico (Billetes)
             </h3>
             {actualCash > 0 && (
                <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-lg ${diffCash === 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600 animate-bounce'}`}>
                  Diferencia: ${diffCash.toLocaleString()}
                </span>
             )}
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase ml-1 text-center block">¿Cuánto dinero hay en el cajón ahora?</span>
              <input 
                disabled={isClosed}
                type="number"
                className={`w-full p-8 rounded-[2rem] font-black text-4xl text-center outline-none transition-all ${isClosed ? 'bg-slate-50 text-slate-500' : 'bg-emerald-50 border-2 border-emerald-100 text-emerald-700 focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500'}`}
                value={actualCash || ''}
                onChange={(e) => setActualCash(parseFloat(e.target.value) || 0)}
                placeholder="$ 0.00"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] px-2">
            <span className="text-slate-400 font-bold uppercase">Debería haber (Sistema):</span>
            <span className="text-slate-800 font-black">${totals.cash.toLocaleString()}</span>
          </div>

          <textarea 
            disabled={isClosed}
            className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-sm font-medium outline-none h-24 resize-none transition-all focus:ring-4 focus:ring-slate-100"
            placeholder="Si hay faltante o sobrante, explica aquí..."
            value={cashComment}
            onChange={(e) => setCashComment(e.target.value)}
          />
        </section>

        {/* VALIDACIÓN DE BANCO */}
        <section className={`bg-white rounded-[2.5rem] p-7 md:p-10 border shadow-sm space-y-6 transition-all ${isClosed ? 'opacity-80' : 'border-slate-100'}`}>
          <div className="flex items-center justify-between">
             <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-4 bg-blue-500 rounded-full"></span>
                Transferencias Bancarias
             </h3>
          </div>
          
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase ml-1 block text-center">Confirmar monto en App del Banco</span>
            <input 
              disabled={isClosed}
              type="number"
              className={`w-full p-8 rounded-[2rem] font-black text-4xl text-center outline-none transition-all ${isClosed ? 'bg-slate-50 text-slate-500' : 'bg-blue-50 border-2 border-blue-100 text-blue-700 focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500'}`}
              value={actualTransfer || ''}
              onChange={(e) => setActualTransfer(parseFloat(e.target.value) || 0)}
              placeholder="$ 0.00"
            />
          </div>

          <div className="flex items-center justify-between text-[11px] px-2">
            <span className="text-slate-400 font-bold uppercase">Monto en Sistema:</span>
            <span className="text-slate-800 font-black">${totals.transfer.toLocaleString()}</span>
          </div>

          <textarea 
            disabled={isClosed}
            className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-sm font-medium outline-none h-24 resize-none transition-all focus:ring-4 focus:ring-slate-100"
            placeholder="Notas sobre transferencias..."
            value={transferComment}
            onChange={(e) => setTransferComment(e.target.value)}
          />
        </section>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        {!isClosed ? (
          <button 
            onClick={handleCloseDay}
            className="flex-1 py-6 bg-emerald-500 text-white font-black rounded-[2.5rem] shadow-xl hover:bg-emerald-600 transition-all uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3 active:scale-95"
          >
            {ICONS.Logo} Realizar Cuadre de Caja
          </button>
        ) : (
          <button 
            onClick={() => setShowSummary(!showSummary)}
            className="flex-1 py-6 bg-slate-800 text-white font-black rounded-[2.5rem] shadow-sm hover:bg-slate-900 transition-all uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3"
          >
            {ICONS.Reports} {showSummary ? 'Ocultar Resumen' : 'Ver Resumen del Cuadre'}
          </button>
        )}
      </div>

      {showSummary && (
         <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 space-y-6 animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-start">
               <div>
                  <h4 className="text-lg font-black uppercase">Resumen de Cierre</h4>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest">{todayStr}</p>
               </div>
               <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase ${totalDiff === 0 ? 'bg-emerald-500' : 'bg-red-500'}`}>
                  {totalDiff === 0 ? 'Caja Cuadrada' : 'Caja con Diferencia'}
               </div>
            </div>
            
            <div className="grid grid-cols-2 gap-8 py-4 border-y border-white/10">
               <div>
                  <span className="text-[10px] font-black text-slate-500 uppercase block mb-1">Diferencia Efectivo</span>
                  <span className={`text-2xl font-black ${diffCash >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>${diffCash.toLocaleString()}</span>
               </div>
               <div>
                  <span className="text-[10px] font-black text-slate-500 uppercase block mb-1">Diferencia Banco</span>
                  <span className={`text-2xl font-black ${diffTransfer >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>${diffTransfer.toLocaleString()}</span>
               </div>
            </div>

            <button 
              onClick={() => {
                const report = `📊 *CUADRE DE CAJA - SE LIBRE*\n📅 Fecha: ${todayStr}\n\n💵 *EFECTIVO EN MOSTRADOR*\n- Sistema: $${totals.cash.toLocaleString()}\n- Físico: $${actualCash.toLocaleString()}\n- Dif: $${diffCash.toLocaleString()}\n\n🏦 *TRANSFERENCIAS*\n- Sistema: $${totals.transfer.toLocaleString()}\n- App: $${actualTransfer.toLocaleString()}\n- Dif: $${diffTransfer.toLocaleString()}\n\n📝 *NOTAS*\n${cashComment || 'Sin comentarios'}`;
                navigator.clipboard.writeText(report);
                alert("Reporte copiado al portapapeles");
              }}
              className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
            >
              Copiar Reporte para WhatsApp
            </button>
         </div>
      )}

      {/* Actividad de hoy */}
      <section className="space-y-4">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Actividad de hoy en mostrador</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...todaySales, ...todayManual].length === 0 ? (
            <div className="md:col-span-3 py-16 bg-white border border-slate-50 rounded-[2.5rem] text-center text-slate-300 italic">No se han registrado movimientos hoy</div>
          ) : (
            [...todaySales, ...todayManual].sort((a,b) => b.id.localeCompare(a.id)).map((item, idx) => (
              <div key={idx} className="bg-white p-6 rounded-[2rem] border border-slate-50 shadow-sm flex justify-between items-center hover:border-emerald-100 transition-all">
                <div>
                  <span className="text-[10px] font-black text-slate-300 uppercase block mb-1">
                    {'sellerName' in item ? item.sellerName : item.category}
                  </span>
                  <span className="text-sm font-bold text-slate-800 block truncate max-w-[120px]">
                    {'productCode' in item ? (stock.find(p => p.code === item.productCode)?.name || item.productCode) : item.description}
                  </span>
                </div>
                <div className="text-right">
                  <span className={`text-xl font-black tracking-tighter block ${'type' in item && item.type === 'expense' ? 'text-orange-500' : 'text-emerald-600'}`}>
                    {'type' in item && item.type === 'expense' ? '-' : '+'}${(item as any).totalPrice || (item as any).amount}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default DailyBalance;
