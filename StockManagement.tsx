
import React, { useState } from 'react';
import { StockItem, StockMovement, UserRole } from '../types';
import { ICONS } from '../constants';

interface StockManagementProps {
  stock: StockItem[];
  onAdd: (item: StockItem) => void;
  onUpdate: (item: StockItem) => void;
  onDelete: (id: string) => void;
  role: UserRole;
}

const StockManagement: React.FC<StockManagementProps> = ({ stock, onAdd, onUpdate, onDelete, role }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [adjustItem, setAdjustItem] = useState<{item: StockItem, type: 'entry' | 'extraction'} | null>(null);
  const [search, setSearch] = useState('');
  const [qtyToChange, setQtyToChange] = useState<number>(0);
  const [newCostValue, setNewCostValue] = useState<number>(0);
  const [adjustmentReason, setAdjustmentReason] = useState('');
  const [expandedHistory, setExpandedHistory] = useState<string | null>(null);
  
  const isAdmin = role === 'admin';

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    category: '',
    quantity: 0,
    costValue: 0,
    salePrice: 0,
    consignee: '',
    purchaseDate: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const itemId = crypto.randomUUID();
    const initialMovement: StockMovement = {
      id: crypto.randomUUID(),
      date: formData.purchaseDate,
      type: 'entry',
      costValue: formData.costValue,
      quantityChange: formData.quantity,
      reason: 'Carga inicial'
    };
    
    const newItem: StockItem = {
      ...formData,
      id: itemId,
      movementHistory: [initialMovement]
    };
    onAdd(newItem);
    resetForm();
    setShowAdd(false);
  };

  const handleAdjustSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustItem) return;
    
    const { item, type } = adjustItem;
    const finalQtyChange = type === 'entry' ? qtyToChange : -qtyToChange;
    const today = new Date().toISOString().split('T')[0];
    
    const newMovement: StockMovement = {
      id: crypto.randomUUID(),
      date: today,
      type: type,
      costValue: type === 'entry' ? (newCostValue || item.costValue) : undefined,
      quantityChange: finalQtyChange,
      reason: adjustmentReason || (type === 'entry' ? 'Reposición de stock' : 'Extracción manual')
    };
    
    const updatedItem: StockItem = {
      ...item,
      quantity: Math.max(0, item.quantity + finalQtyChange),
      costValue: (type === 'entry' && newCostValue > 0) ? newCostValue : item.costValue,
      movementHistory: [
        ...(item.movementHistory || []),
        newMovement
      ]
    };
    
    onUpdate(updatedItem);
    setAdjustItem(null);
    setQtyToChange(0);
    setNewCostValue(0);
    setAdjustmentReason('');
  };

  const resetForm = () => {
    setFormData({
      code: '',
      name: '',
      category: '',
      quantity: 0,
      costValue: 0,
      salePrice: 0,
      consignee: '',
      purchaseDate: new Date().toISOString().split('T')[0]
    });
  };

  const filteredStock = stock.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase()) || 
    item.code.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">{ICONS.Search}</span>
          <input 
            type="text" 
            placeholder="Buscar por código, nombre o categoría..." 
            className="w-full pl-12 pr-6 py-4 bg-white border border-emerald-50 rounded-[2rem] text-sm shadow-sm outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {isAdmin && (
          <button onClick={() => setShowAdd(true)} className="w-full md:w-auto px-8 py-4 bg-emerald-500 text-white rounded-[2rem] shadow-lg shadow-emerald-100 hover:bg-emerald-600 transition-all font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2">
            {ICONS.Plus} Nuevo Producto
          </button>
        )}
      </div>

      {/* Listado de Productos - GRID RESPONSIBILE */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-10">
        {filteredStock.map(item => (
          <div key={item.id} className="bg-white p-7 rounded-[2.5rem] border border-emerald-50 shadow-sm hover:border-emerald-200 transition-all flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <div className="flex flex-col gap-1.5 max-w-[70%]">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg uppercase tracking-widest">
                    {item.code}
                  </span>
                  <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
                    {item.category}
                  </span>
                </div>
                <h4 className="font-black text-slate-800 text-lg leading-tight uppercase">{item.name}</h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase italic">Consignante: {item.consignee || 'Propio'}</p>
              </div>

              <div className="text-right">
                <span className="text-[9px] font-black text-slate-300 block uppercase mb-1">Stock</span>
                <span className={`text-3xl font-black leading-none ${item.quantity < 5 ? 'text-orange-500' : 'text-slate-800'}`}>
                  {item.quantity}
                </span>
              </div>
            </div>

            <div className="h-px bg-slate-50 w-full mb-6"></div>

            <div className="flex justify-between items-center mb-6">
              <div>
                <span className="text-[9px] font-black text-slate-300 block uppercase mb-1 tracking-widest">P. Venta</span>
                <span className="text-2xl font-black text-emerald-600 tracking-tighter">${item.salePrice.toLocaleString()}</span>
              </div>
              {isAdmin && (
                <div className="text-right">
                  <span className="text-[9px] font-black text-slate-300 block uppercase mb-1 tracking-widest">Costo</span>
                  <span className="text-lg font-black text-slate-400 tracking-tighter">${item.costValue.toLocaleString()}</span>
                </div>
              )}
            </div>

            <div className="mt-auto flex flex-col gap-3">
              <div className="flex gap-2">
                {isAdmin && (
                  <>
                    <button onClick={() => setAdjustItem({item, type: 'entry'})} className="flex-1 py-3 bg-emerald-50 text-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all">
                      Reponer
                    </button>
                    <button onClick={() => setAdjustItem({item, type: 'extraction'})} className="flex-1 py-3 bg-orange-50 text-orange-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all">
                      Extraer
                    </button>
                  </>
                )}
              </div>
              
              <div className="flex justify-between items-center">
                <button 
                  onClick={() => setExpandedHistory(expandedHistory === item.id ? null : item.id)}
                  className="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-emerald-500 transition-colors"
                >
                  Historial Movimientos {expandedHistory === item.id ? '▲' : '▼'}
                </button>
                {isAdmin && (
                  <button onClick={() => onDelete(item.id)} className="p-2 text-slate-200 hover:text-red-500 transition-colors">
                    {ICONS.Delete}
                  </button>
                )}
              </div>

              {expandedHistory === item.id && (
                <div className="mt-4 space-y-2 p-4 bg-slate-50 rounded-[1.5rem] border border-slate-100 max-h-48 overflow-y-auto">
                  {[...(item.movementHistory || [])].reverse().map(mov => (
                    <div key={mov.id} className="flex justify-between items-center text-[10px] border-b border-slate-200/50 pb-2 mb-2 last:border-0 last:mb-0">
                      <div>
                        <span className="font-black text-slate-400 uppercase block">{mov.date}</span>
                        <span className="font-bold text-slate-600">{mov.reason}</span>
                      </div>
                      <span className={`font-black ${mov.type === 'entry' ? 'text-emerald-600' : 'text-orange-600'}`}>
                        {mov.type === 'entry' ? '+' : ''}{mov.quantityChange}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modales (Ocultos por defecto) */}
      {showAdd && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
          <div className="bg-white w-full max-w-xl rounded-[2.5rem] p-10 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Nuevo Artículo</h2>
              <button onClick={() => setShowAdd(false)} className="text-slate-300 hover:text-slate-500 text-2xl">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
              <div className="col-span-1">
                <label className="text-[10px] font-black text-slate-400 block mb-2 uppercase tracking-widest">Código</label>
                <input required type="text" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-emerald-50" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} />
              </div>
              <div className="col-span-1">
                <label className="text-[10px] font-black text-slate-400 block mb-2 uppercase tracking-widest">Fecha Ingreso</label>
                <input required type="date" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-emerald-50" value={formData.purchaseDate} onChange={e => setFormData({...formData, purchaseDate: e.target.value})} />
              </div>
              <div className="col-span-2">
                <label className="text-[10px] font-black text-slate-400 block mb-2 uppercase tracking-widest">Nombre Completo</label>
                <input required type="text" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-emerald-50" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="col-span-1">
                <label className="text-[10px] font-black text-slate-400 block mb-2 uppercase tracking-widest">Categoría</label>
                <input required type="text" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-emerald-50" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
              </div>
              <div className="col-span-1">
                <label className="text-[10px] font-black text-slate-400 block mb-2 uppercase tracking-widest">Consignante</label>
                <input type="text" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-emerald-50" value={formData.consignee} onChange={e => setFormData({...formData, consignee: e.target.value})} />
              </div>
              <div className="col-span-1">
                <label className="text-[10px] font-black text-slate-400 block mb-2 uppercase tracking-widest">Cant. Inicial</label>
                <input required type="number" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-lg font-black text-center outline-none focus:ring-4 focus:ring-emerald-50" value={formData.quantity} onChange={e => setFormData({...formData, quantity: parseInt(e.target.value) || 0})} />
              </div>
              <div className="col-span-1">
                <label className="text-[10px] font-black text-slate-400 block mb-2 uppercase tracking-widest">Costo Unitario</label>
                <input required type="number" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-lg font-black text-center outline-none focus:ring-4 focus:ring-emerald-50" value={formData.costValue} onChange={e => setFormData({...formData, costValue: parseFloat(e.target.value) || 0})} />
              </div>
              <div className="col-span-2">
                <label className="text-[10px] font-black text-slate-400 block mb-2 uppercase tracking-widest">Precio Venta Sugerido</label>
                <input required type="number" className="w-full p-5 bg-emerald-50 border border-emerald-100 rounded-2xl text-2xl font-black text-center text-emerald-700 outline-none focus:ring-4 focus:ring-emerald-200" value={formData.salePrice} onChange={e => setFormData({...formData, salePrice: parseFloat(e.target.value) || 0})} />
              </div>
              <button type="submit" className="col-span-2 py-5 bg-emerald-500 text-white font-black rounded-3xl shadow-xl hover:bg-emerald-600 transition-all uppercase tracking-[0.3em] text-xs">Guardar Producto</button>
            </form>
          </div>
        </div>
      )}

      {adjustItem && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl">
            <h2 className={`text-2xl font-black mb-6 uppercase tracking-tight ${adjustItem.type === 'entry' ? 'text-emerald-600' : 'text-orange-600'}`}>
              {adjustItem.type === 'entry' ? 'Reponer Stock' : 'Extraer Stock'}
            </h2>
            <form onSubmit={handleAdjustSubmit} className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 block mb-2 uppercase tracking-widest">Cantidad</label>
                <input required type="number" className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl text-3xl font-black text-center outline-none" value={qtyToChange || ''} onChange={e => setQtyToChange(parseInt(e.target.value) || 0)} autoFocus />
              </div>
              {adjustItem.type === 'entry' && (
                <div>
                  <label className="text-[10px] font-black text-slate-400 block mb-2 uppercase tracking-widest">Ajustar Costo Unitario (Opcional)</label>
                  <input type="number" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-lg font-bold text-center outline-none" placeholder={`Actual: $${adjustItem.item.costValue}`} value={newCostValue || ''} onChange={e => setNewCostValue(parseFloat(e.target.value) || 0)} />
                </div>
              )}
              <input type="text" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none" placeholder="Motivo del ajuste..." value={adjustmentReason} onChange={e => setAdjustmentReason(e.target.value)} />
              <button type="submit" className={`w-full py-5 text-white font-black rounded-3xl shadow-xl transition-all uppercase tracking-widest ${adjustItem.type === 'entry' ? 'bg-emerald-500' : 'bg-orange-500'}`}>Confirmar</button>
              <button type="button" onClick={() => setAdjustItem(null)} className="w-full py-3 text-slate-400 font-bold uppercase text-[10px] tracking-widest">Cancelar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockManagement;
