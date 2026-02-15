
import React, { useState, useEffect } from 'react';
import { Sale, StockItem, PaymentMethod, DebtStatus, SalePayment } from './types';
import { ICONS } from './constants';
import { getLocalDateISO } from './dateUtils';
import { getAvailableStockForSale, validateSaleDraft } from './salesValidation';

interface SalesManagementProps {
  sales: Sale[];
  stock: StockItem[];
  onAdd: (sale: Sale) => void;
  onUpdate: (sale: Sale) => void;
  onDelete: (id: string) => void;
}

const SalesManagement: React.FC<SalesManagementProps> = ({ sales, stock, onAdd, onUpdate, onDelete }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [editingSaleId, setEditingSaleId] = useState<string | null>(null);
  const [codeSearch, setCodeSearch] = useState('');
  const [foundItem, setFoundItem] = useState<StockItem | null>(null);
  const [isSplitPayment, setIsSplitPayment] = useState(false);
  
  const [formData, setFormData] = useState({
    sellerName: '',
    buyerName: '',
    productCode: '',
    unitPrice: 0,
    quantity: 1,
    payments: [{ method: PaymentMethod.CASH, amount: 0 }] as SalePayment[],
    debtStatus: DebtStatus.NONE,
    debtAmount: 0,
    date: getLocalDateISO(),
    observations: ''
  });

  useEffect(() => {
    const item = stock.find(i => i.code.toLowerCase() === codeSearch.toLowerCase());
    if (item) {
      setFoundItem(item);
      setFormData(prev => ({ 
        ...prev, 
        productCode: item.code,
        unitPrice: prev.unitPrice === 0 ? item.salePrice : prev.unitPrice 
      }));
    } else {
      setFoundItem(null);
    }
  }, [codeSearch, stock]);

  // Sincronizar montos de pago: Total Venta - Deuda = Pago Real
  useEffect(() => {
    if (!isSplitPayment) {
      const total = formData.unitPrice * formData.quantity;
      const actualPayment = Math.max(0, total - formData.debtAmount);
      setFormData(prev => ({
        ...prev,
        payments: [{ ...prev.payments[0], amount: actualPayment }]
      }));
    }
  }, [formData.unitPrice, formData.quantity, formData.debtAmount, isSplitPayment]);


  const getAvailableStock = (productCode: string) => (
    getAvailableStockForSale(stock, sales, editingSaleId, productCode)
  );

  const validateSale = () => {
    const availableStock = getAvailableStock(formData.productCode);
    const validationError = validateSaleDraft(formData, availableStock);

    if (validationError) {
      alert(validationError);
      return false;
    }

    return true;
  };

  const handleEdit = (sale: Sale) => {
    setEditingSaleId(sale.id);
    setCodeSearch(sale.productCode);
    setIsSplitPayment(sale.payments.length > 1);
    setFormData({
      sellerName: sale.sellerName,
      buyerName: sale.buyerName,
      productCode: sale.productCode,
      unitPrice: sale.unitPrice,
      quantity: sale.quantity,
      payments: sale.payments,
      debtStatus: sale.debtStatus,
      debtAmount: sale.debtAmount,
      date: sale.date,
      observations: sale.observations || ''
    });
    setShowAdd(true);
  };

  const handleCloseModal = () => {
    setShowAdd(false);
    setEditingSaleId(null);
    setCodeSearch('');
    setIsSplitPayment(false);
    setFormData({
      sellerName: '',
      buyerName: '',
      productCode: '',
      unitPrice: 0,
      quantity: 1,
      payments: [{ method: PaymentMethod.CASH, amount: 0 }],
      debtStatus: DebtStatus.NONE,
      debtAmount: 0,
      date: getLocalDateISO(),
      observations: ''
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSale()) return;

    const saleData: Sale = {
      ...formData,
      id: editingSaleId || crypto.randomUUID(),
      totalPrice: formData.unitPrice * formData.quantity
    };

    if (editingSaleId) onUpdate(saleData); else onAdd(saleData);
    handleCloseModal();
  };

  const toggleSplitPayment = () => {
    if (isSplitPayment) {
      setFormData(prev => ({
        ...prev,
        payments: [prev.payments[0]]
      }));
    } else {
      const total = formData.unitPrice * formData.quantity;
      const remaining = Math.max(0, total - formData.debtAmount);
      setFormData(prev => ({
        ...prev,
        payments: [
          { method: PaymentMethod.CASH, amount: remaining },
          { method: PaymentMethod.TRANSFER, amount: 0 }
        ]
      }));
    }
    setIsSplitPayment(!isSplitPayment);
  };

  const updatePaymentMethod = (index: number, method: PaymentMethod) => {
    const newPayments = [...formData.payments];
    newPayments[index].method = method;
    setFormData({ ...formData, payments: newPayments });
  };

  const updatePaymentAmount = (index: number, amount: number) => {
    const newPayments = [...formData.payments];
    newPayments[index].amount = amount;
    setFormData({ ...formData, payments: newPayments });
  };

  const getDebtBadgeColor = (status: DebtStatus) => {
    switch (status) {
      case DebtStatus.CUSTOMER_OWES: return 'bg-red-50 text-red-600 border-red-100';
      case DebtStatus.STORE_OWES: return 'bg-amber-50 text-amber-600 border-amber-100';
      default: return 'bg-slate-50 text-slate-400 border-slate-100';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold text-slate-800">Historial</h2>
        <button 
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-5 py-3 bg-emerald-500 text-white rounded-2xl shadow-lg shadow-emerald-50 font-bold text-sm active:scale-95 transition-transform"
        >
          {ICONS.Plus} Nueva Venta
        </button>
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
          <div className="bg-white w-full max-w-lg rounded-t-[2.5rem] sm:rounded-[2rem] p-7 shadow-2xl animate-in slide-in-from-bottom max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-slate-800 tracking-tight">
                {editingSaleId ? 'Editar Venta' : 'Cargar Venta'}
              </h2>
              <button onClick={handleCloseModal} className="text-slate-300 hover:text-slate-500 p-2">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <div className="col-span-1">
                <label className="text-[10px] font-bold text-slate-400 block mb-1.5 uppercase tracking-widest">Vendedor</label>
                <input required type="text" className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none" value={formData.sellerName} onChange={e => setFormData({...formData, sellerName: e.target.value})} />
              </div>
              <div className="col-span-1">
                <label className="text-[10px] font-bold text-slate-400 block mb-1.5 uppercase tracking-widest">Fecha</label>
                <input required type="date" className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
              </div>
              <div className="col-span-2">
                <label className="text-[10px] font-bold text-slate-400 block mb-1.5 uppercase tracking-widest">Comprador</label>
                <input required type="text" className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none" value={formData.buyerName} onChange={e => setFormData({...formData, buyerName: e.target.value})} />
              </div>
              
              <div className="col-span-2">
                <label className="text-[10px] font-bold text-slate-400 block mb-1.5 uppercase tracking-widest">Producto (Código)</label>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Ingrese código..."
                    className={`w-full p-4 bg-slate-50 border rounded-2xl text-sm transition-all outline-none font-bold ${foundItem ? 'border-emerald-200 ring-4 ring-emerald-50' : 'border-slate-100 focus:ring-4 focus:ring-emerald-50'}`}
                    value={codeSearch}
                    onChange={e => setCodeSearch(e.target.value)}
                  />
                  {foundItem && (
                    <div className="mt-2 px-4 py-3 bg-emerald-50 text-emerald-700 text-[11px] font-bold rounded-xl border border-emerald-100 flex flex-col gap-1 animate-in fade-in zoom-in duration-200">
                      <div className="flex justify-between border-b border-emerald-100/50 pb-1 mb-1">
                        <span>✓ {foundItem.name}</span>
                        <span>Disp: {getAvailableStock(foundItem.code)}</span>
                      </div>
                      <div className="text-[9px] uppercase tracking-wider text-emerald-600/70">
                        Consignante: <span className="text-emerald-800">{foundItem.consignee || 'Propio'}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="col-span-1">
                <label className="text-[10px] font-bold text-slate-400 block mb-1.5 uppercase tracking-widest">Cant.</label>
                <input required type="number" min="1" className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none" value={formData.quantity} onChange={e => setFormData({...formData, quantity: parseInt(e.target.value) || 1})} />
              </div>
              <div className="col-span-1">
                <label className="text-[10px] font-bold text-slate-400 block mb-1.5 uppercase tracking-widest">Unitario</label>
                <input required type="number" className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none" value={formData.unitPrice} onChange={e => setFormData({...formData, unitPrice: parseFloat(e.target.value) || 0})} />
              </div>
              
              {/* Sección de Deuda (IMPORTANTE: Ahora afecta al pago) */}
              <div className="col-span-2 pt-2 border-t border-slate-50 mt-2">
                <label className="text-[10px] font-bold text-slate-400 block mb-2 uppercase tracking-widest">Deudas / Saldos</label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.values(DebtStatus).map(status => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setFormData({...formData, debtStatus: status, debtAmount: status === DebtStatus.NONE ? 0 : formData.debtAmount})}
                      className={`py-2.5 text-[9px] font-black rounded-xl border transition-all ${formData.debtStatus === status ? 'bg-slate-800 text-white border-slate-800 shadow-md' : 'bg-white text-slate-400 border-slate-100'}`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
                {formData.debtStatus !== DebtStatus.NONE && (
                  <div className="mt-3 flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-100">
                    <span className="text-[10px] font-black text-red-700 uppercase">Monto de Deuda</span>
                    <div className="flex items-center gap-2">
                      <span className="text-red-400 text-xs">-</span>
                      <input 
                        type="number" 
                        className="w-24 bg-transparent border-b border-red-200 text-right text-sm font-black text-red-800 outline-none"
                        value={formData.debtAmount || ''}
                        onChange={(e) => setFormData({...formData, debtAmount: parseFloat(e.target.value) || 0})}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Sección de Pago */}
              <div className="col-span-2 pt-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Dinero que ENTRA hoy</label>
                  <button type="button" onClick={toggleSplitPayment} className={`text-[10px] font-black px-3 py-1 rounded-lg border transition-all ${isSplitPayment ? 'bg-orange-500 text-white border-orange-500' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                    {isSplitPayment ? '✓ Pago Dividido' : '+ Dividir Pago'}
                  </button>
                </div>
                
                <div className="space-y-3">
                  {formData.payments.map((p, idx) => (
                    <div key={idx} className="flex gap-2">
                      <select 
                        className="flex-1 p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold"
                        value={p.method}
                        onChange={(e) => updatePaymentMethod(idx, e.target.value as PaymentMethod)}
                      >
                        {Object.values(PaymentMethod).map(m => m !== PaymentMethod.PENDING && <option key={m} value={m}>{m}</option>)}
                      </select>
                      <input 
                        type="number" 
                        readOnly={!isSplitPayment}
                        placeholder="Monto"
                        className={`w-28 p-3 rounded-xl text-xs font-bold text-right outline-none ${!isSplitPayment ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-50 border-slate-100'}`}
                        value={p.amount}
                        onChange={(e) => updatePaymentAmount(idx, parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  ))}
                </div>
                {!isSplitPayment && formData.debtAmount > 0 && (
                  <p className="text-[8px] text-slate-400 mt-2 italic">* Se resta la deuda automáticamente del monto total.</p>
                )}
              </div>

              <div className="col-span-2">
                <label className="text-[10px] font-bold text-slate-400 block mb-1.5 uppercase tracking-widest">Observaciones</label>
                <textarea className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm h-16 outline-none" value={formData.observations} onChange={e => setFormData({...formData, observations: e.target.value})} />
              </div>

              <div className="col-span-2 py-4 border-t border-slate-50 flex justify-between items-center mt-2">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Venta Total</span>
                  <span className="text-lg font-black text-slate-400 line-through decoration-slate-300 decoration-2">${(formData.unitPrice * formData.quantity).toLocaleString()}</span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-black text-emerald-600 uppercase tracking-[0.2em]">Neto a Recaudar</span>
                  <span className="text-3xl font-black text-emerald-600 tracking-tighter block">${formData.payments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}</span>
                </div>
              </div>
              
              <button 
                type="submit" 
                disabled={!foundItem}
                className={`col-span-2 text-white font-bold py-4.5 rounded-[1.5rem] shadow-xl active:scale-95 transition-all ${foundItem ? 'bg-emerald-500 shadow-emerald-50' : 'bg-slate-200 grayscale opacity-50'}`}
              >
                {editingSaleId ? 'Actualizar Registro' : 'Confirmar Registro'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Sales List */}
      <div className="space-y-4">
        {sales.length === 0 ? (
          <div className="py-20 text-center text-slate-300 font-medium italic">Sin movimientos</div>
        ) : (
          [...sales].reverse().map(sale => {
            const product = stock.find(i => i.code === sale.productCode);
            const totalCollected = sale.payments.reduce((s, p) => s + p.amount, 0);
            return (
              <div key={sale.id} className="bg-white p-6 rounded-[2.2rem] border border-emerald-50/50 shadow-sm hover:border-emerald-100 transition-all group">
                
                {/* Cabecera Principal */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex flex-col gap-1 max-w-[65%]">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{sale.date}</span>
                      <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                      <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">{sale.sellerName}</span>
                    </div>
                    <h4 className="font-bold text-slate-800 text-[15px] leading-tight group-hover:text-emerald-700 transition-colors">
                      {product?.name || sale.productCode}
                    </h4>
                    <div className="text-[10px] text-slate-400 font-bold mt-1">
                      CLIENTE: <span className="text-slate-700 font-black uppercase ml-1">{sale.buyerName}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end text-right">
                    <span className="text-[10px] font-bold text-emerald-600 block uppercase mb-1 tracking-tighter">RECAUDADO</span>
                    <span className="text-2xl font-black text-emerald-600 leading-none tracking-tighter">
                      ${totalCollected.toLocaleString()}
                    </span>
                    
                    {sale.debtStatus !== DebtStatus.NONE && (
                      <div className={`mt-3 px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border ${getDebtBadgeColor(sale.debtStatus)}`}>
                        {sale.debtStatus}: ${sale.debtAmount.toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>

                {/* Resumen de Pagos y Consignante */}
                <div className="flex justify-between items-center bg-slate-50/50 p-4 rounded-2xl mb-4 border border-slate-100/30">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Venta Total:</span>
                      <span className="text-[10px] font-black text-slate-400 line-through">${sale.totalPrice.toLocaleString()}</span>
                    </div>
                    <div className="text-[10px] font-medium text-slate-400 italic">
                      {sale.quantity} uds. x ${sale.unitPrice.toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-1">
                    {sale.payments.map((p, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{p.method}</span>
                        <span className="text-[11px] font-black text-slate-700">${p.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {sale.observations && (
                  <div className="mb-4 p-3.5 bg-orange-50/30 rounded-2xl text-[11px] text-slate-600 border-l-4 border-orange-200/50 italic leading-relaxed">
                    {sale.observations}
                  </div>
                )}

                <div className="flex justify-end items-center gap-2 pt-3 border-t border-slate-50">
                  <button onClick={() => handleEdit(sale)} className="text-slate-300 hover:text-emerald-500 active:scale-90 transition-all p-2 rounded-xl hover:bg-emerald-50">
                    {ICONS.Edit}
                  </button>
                  <button onClick={() => onDelete(sale.id)} className="text-slate-300 hover:text-red-400 active:scale-90 transition-all p-2 rounded-xl hover:bg-red-50">
                    {ICONS.Delete}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SalesManagement;
