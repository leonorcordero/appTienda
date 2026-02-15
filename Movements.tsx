
import React, { useState } from 'react';
import { Sale, ManualMovement, ManualMovementCategory, PaymentMethod } from './types';
import { ICONS } from './constants';
import { getLocalDateISO } from './dateUtils';

interface MovementsProps {
  sales: Sale[];
  manualMovements: ManualMovement[];
  onAddManual: (move: ManualMovement) => void;
  onDeleteManual: (id: string) => void;
}

const Movements: React.FC<MovementsProps> = ({ sales, manualMovements, onAddManual, onDeleteManual }) => {
  const [showAdd, setShowAdd] = useState<'income' | 'expense' | null>(null);
  const [formData, setFormData] = useState({
    category: '' as ManualMovementCategory,
    amount: 0,
    description: '',
    date: getLocalDateISO(),
    paymentMethod: PaymentMethod.CASH
  });

  const INCOME_CATEGORIES: ManualMovementCategory[] = ['Ingreso por error', 'Otros ingresos'];
  const EXPENSE_CATEGORIES: ManualMovementCategory[] = [
    'Retiro de caja (Resguardo)',
    'Compra', 'Pagos pendientes de compras', 'Compra de USD', 
    'Consignación sede central', 'Traspaso sede local', 'Pago consignación', 
    'Devolución', 'Pago trabajos', 'Otros egresos', 'Devolución caja'
  ];

  const totalSalesRevenue = sales.reduce((acc, s) => {
    const paid = s.payments.reduce((sum, p) => sum + p.amount, 0);
    return acc + paid;
  }, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.amount <= 0 || !showAdd || !formData.category) return;
    
    onAddManual({
      id: crypto.randomUUID(),
      type: showAdd,
      category: formData.category,
      amount: formData.amount,
      description: formData.description,
      date: formData.date,
      paymentMethod: formData.paymentMethod
    });
    
    setFormData({
      category: '' as ManualMovementCategory,
      amount: 0,
      description: '',
      date: getLocalDateISO(),
      paymentMethod: PaymentMethod.CASH
    });
    setShowAdd(null);
  };

  const openModal = (type: 'income' | 'expense') => {
    setShowAdd(type);
    setFormData(prev => ({
      ...prev,
      category: type === 'income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0],
      paymentMethod: PaymentMethod.CASH
    }));
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Caja y Arqueos</h2>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Gestión de flujo y retiros de mostrador</p>
      </div>

      <section className="bg-slate-900 rounded-[2.5rem] p-6 text-white shadow-xl shadow-slate-100 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-500 text-white rounded-2xl">
            {ICONS.Money}
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-0.5">Recaudado en Mostrador</span>
            <span className="text-2xl font-black tracking-tighter">${totalSalesRevenue.toLocaleString()}</span>
          </div>
        </div>
        <div className="text-[9px] font-black bg-white/10 px-2 py-1 rounded-lg uppercase">Histórico</div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button 
          onClick={() => openModal('income')}
          className="bg-white p-6 rounded-[2.5rem] border border-emerald-100 shadow-sm flex items-center gap-5 active:scale-95 transition-all group"
        >
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:bg-emerald-500 group-hover:text-white transition-colors">
            {ICONS.Plus}
          </div>
          <div className="text-left">
            <span className="text-sm font-black text-slate-800 uppercase block">Ingreso de Caja</span>
            <span className="text-[9px] font-bold text-slate-400 uppercase">Ajustes manuales positivos</span>
          </div>
        </button>

        <button 
          onClick={() => openModal('expense')}
          className="bg-white p-6 rounded-[2.5rem] border border-orange-100 shadow-sm flex items-center gap-5 active:scale-95 transition-all group"
        >
          <div className="p-4 bg-orange-50 text-orange-600 rounded-2xl group-hover:bg-orange-500 group-hover:text-white transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <div className="text-left">
            <span className="text-sm font-black text-slate-800 uppercase block">Retiro / Pago / Gasto</span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Sacar dinero de mostrador</span>
          </div>
        </button>
      </section>

      <section className="space-y-4">
        <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest pl-2">Cronología de Movimientos Manuales</h3>
        <div className="space-y-3">
          {manualMovements.length === 0 ? (
            <div className="py-12 bg-white rounded-[2.5rem] border border-slate-50 text-center text-slate-300 italic text-sm uppercase font-black">
              Caja limpia - Sin ajustes manuales
            </div>
          ) : (
            [...manualMovements].reverse().map((move) => (
              <div key={move.id} className={`bg-white p-5 rounded-[2rem] border shadow-sm flex justify-between items-center group transition-all ${move.category === 'Retiro de caja (Resguardo)' ? 'border-blue-100 bg-blue-50/10' : 'border-slate-50'}`}>
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${move.type === 'income' ? 'bg-emerald-50 text-emerald-600' : move.category === 'Retiro de caja (Resguardo)' ? 'bg-blue-100 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
                    {move.category === 'Retiro de caja (Resguardo)' ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> : move.type === 'income' ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m19 12-7 7-7-7M12 19V5"/></svg> : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m5 12 7-7 7 7M12 5v14"/></svg>}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{move.category}</span>
                    </div>
                    <span className="text-[13px] font-bold text-slate-700 leading-tight block">{move.description || 'Movimiento manual'}</span>
                    <span className="text-[9px] text-slate-300 font-bold block mt-1 uppercase">{move.date}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-lg font-black tracking-tighter ${move.type === 'income' ? 'text-emerald-600' : 'text-orange-600'}`}>
                    {move.type === 'income' ? '+' : '-'}${move.amount.toLocaleString()}
                  </span>
                  <button onClick={() => onDeleteManual(move.id)} className="text-slate-100 hover:text-red-400 transition-colors p-2">{ICONS.Delete}</button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {showAdd && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-end justify-center p-0 z-50">
          <div className="bg-white w-full max-w-lg rounded-t-[3rem] p-8 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className={`text-2xl font-black uppercase tracking-tight ${showAdd === 'income' ? 'text-emerald-600' : 'text-orange-600'}`}>
                    {showAdd === 'income' ? 'Registrar Ingreso' : 'Registrar Salida'}
                  </h2>
                </div>
                <button onClick={() => setShowAdd(null)} className="text-slate-300 p-2">✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2.5 ml-1">¿Qué tipo de movimiento es?</label>
                  <select 
                    required
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-sm font-black text-slate-700 outline-none appearance-none"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value as ManualMovementCategory})}
                  >
                    {(showAdd === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-5">
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2.5 ml-1">Monto ($)</label>
                        <input 
                            required 
                            type="number" 
                            className={`w-full p-4.5 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-2xl font-black outline-none ${showAdd === 'income' ? 'text-emerald-600' : 'text-orange-600'}`}
                            value={formData.amount || ''}
                            onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value) || 0})}
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2.5 ml-1">Método</label>
                        <select className="w-full p-4.5 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-sm font-black" value={formData.paymentMethod} onChange={(e) => setFormData({...formData, paymentMethod: e.target.value as PaymentMethod})}>
                          <option value={PaymentMethod.CASH}>Efectivo</option>
                          <option value={PaymentMethod.TRANSFER}>Transferencia</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2.5 ml-1">Descripción</label>
                    <input 
                        type="text" 
                        placeholder="Ej: Retiro para resguardo, Pago de luz..."
                        className="w-full p-4.5 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-sm font-bold text-slate-700 outline-none"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                </div>

                <button type="submit" className={`w-full py-5 text-white font-black rounded-[1.8rem] shadow-2xl transition-all uppercase tracking-widest ${showAdd === 'income' ? 'bg-emerald-500' : 'bg-slate-800'}`}>
                    Confirmar Movimiento
                </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Movements;
