
import React, { useState, useEffect } from 'react';
import { AppView, StockItem, Sale, ManualMovement } from './types';
import { ICONS } from './constants';
import DailyBalance from './DailyBalance';
import StockManagement from './StockManagement';
import SalesManagement from './SalesManagement';
import AdministrativeReport from './AdministrativeReport';
import Movements from './Movements';
import Statistics from './Statistics';
import Login from './Login';
import { storageService } from './storageService';
import { getLocalDateISO } from './dateUtils';
import { useSession } from './useSession';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<AppView>('home');
  const { isAuthenticated, role, userName, login, logout } = useSession();
  
  const [stock, setStock] = useState<StockItem[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [manualMovements, setManualMovements] = useState<ManualMovement[]>([]);
  const [initialBalances, setInitialBalances] = useState({ bank: 0, cash: 0, usd: 0 });

  useEffect(() => {
    const loadData = async () => {
      const data = await storageService.getAll();
      setStock(data.stock);
      setSales(data.sales);
      setManualMovements(data.movements);
      setInitialBalances(data.balances);

    };
    loadData();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      storageService.saveAll({ stock, sales, movements: manualMovements });
    }
  }, [stock, sales, manualMovements, isAuthenticated]);

  const handleLogin = login;

  const handleLogout = logout;

  const addStockItem = (item: StockItem) => setStock(prev => [...prev, item]);
  const updateStockItem = (updatedItem: StockItem) => setStock(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
  const deleteStockItem = (id: string) => setStock(prev => prev.filter(i => i.id !== id));

  const addSale = (sale: Sale) => {
    setSales(prev => [...prev, sale]);
    updateStockQuantity(sale.productCode, -sale.quantity);
  };

  const updateStockQuantity = (code: string, diff: number) => {
    setStock(prev => prev.map(item => {
      if (item.code === code) {
        const newQty = Math.max(0, item.quantity + diff);
        return { 
          ...item, 
          quantity: newQty,
          movementHistory: [...(item.movementHistory || []), {
            id: crypto.randomUUID(),
            date: getLocalDateISO(),
            type: diff < 0 ? 'extraction' : 'entry',
            quantityChange: diff,
            reason: diff < 0 ? 'Venta registrada' : 'Devolución/Ajuste'
          }]
        };
      }
      return item;
    }));
  };

  const updateSale = (updatedSale: Sale) => {
    const oldSale = sales.find(s => s.id === updatedSale.id);
    if (oldSale) updateStockQuantity(oldSale.productCode, oldSale.quantity);
    updateStockQuantity(updatedSale.productCode, -updatedSale.quantity);
    setSales(prev => prev.map(s => s.id === updatedSale.id ? updatedSale : s));
  };

  const deleteSale = (id: string) => {
    const saleToDelete = sales.find(s => s.id === id);
    if (saleToDelete) updateStockQuantity(saleToDelete.productCode, saleToDelete.quantity);
    setSales(prev => prev.filter(s => s.id !== id));
  };

  const addManualMovement = (move: ManualMovement) => setManualMovements(prev => [...prev, move]);
  const deleteManualMovement = (id: string) => setManualMovements(prev => prev.filter(i => i.id !== id));

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  const renderView = () => {
    switch (activeView) {
      case 'home': return <DailyBalance sales={sales} stock={stock} manualMovements={manualMovements} />;
      case 'sales': return <SalesManagement sales={sales} stock={stock} onAdd={addSale} onUpdate={updateSale} onDelete={deleteSale} />;
      case 'stock': return <StockManagement stock={stock} onAdd={addStockItem} onUpdate={updateStockItem} onDelete={deleteStockItem} role={role} />;
      case 'reports': return (
        <AdministrativeReport 
          stock={stock} 
          sales={sales} 
          manualMovements={manualMovements} 
          initialBalances={initialBalances}
          onUpdateInitialBalances={setInitialBalances}
        />
      );
      case 'movements': return (
        <Movements 
          sales={sales} 
          manualMovements={manualMovements} 
          onAddManual={addManualMovement} 
          onDeleteManual={deleteManualMovement} 
        />
      );
      case 'statistics': return <Statistics stock={stock} sales={sales} />;
      default: return <DailyBalance sales={sales} stock={stock} manualMovements={manualMovements} />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#fafcfb]">
      {/* SIDEBAR (Escritorio) */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-100 h-screen sticky top-0 z-30">
        <div className="p-6 border-b border-emerald-50">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-emerald-500 text-white rounded-2xl shadow-lg shadow-emerald-100">
              {ICONS.Logo}
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-800 leading-none">Se Libre</h1>
              <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest mt-1">Luz Interna</p>
            </div>
          </div>
          
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Usuario Activo</p>
            <p className="text-sm font-bold text-slate-700 truncate">{userName || 'Administrador'}</p>
            <p className="text-[9px] font-black text-emerald-600 uppercase mt-1 italic">{role === 'admin' ? 'Acceso Total' : 'Acceso Vendedor'}</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <SidebarButton active={activeView === 'home'} icon={ICONS.Dashboard} label="Caja Registradora" onClick={() => setActiveView('home')} />
          <SidebarButton active={activeView === 'sales'} icon={ICONS.Sales} label="Ventas" onClick={() => setActiveView('sales')} />
          <SidebarButton active={activeView === 'stock'} icon={ICONS.Stock} label="Stock / Inventario" onClick={() => setActiveView('stock')} />
          
          {role === 'admin' && (
            <div className="pt-4 mt-4 border-t border-slate-50 space-y-1">
              <p className="px-4 text-[9px] font-black text-slate-300 uppercase tracking-widest mb-2">Administración</p>
              <SidebarButton active={activeView === 'reports'} icon={ICONS.Reports} label="Fondos / Resguardo" onClick={() => setActiveView('reports')} />
              <SidebarButton active={activeView === 'movements'} icon={ICONS.Movements} label="Movimientos" onClick={() => setActiveView('movements')} />
              <SidebarButton active={activeView === 'statistics'} icon={ICONS.Stats} label="Métricas" onClick={() => setActiveView('statistics')} />
            </div>
          )}
        </nav>

        <div className="p-4 border-t border-slate-50">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all font-bold text-sm">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* HEADER (Móvil) */}
      <header className="md:hidden bg-white border-b border-emerald-50 px-4 py-3 sticky top-0 z-10 shadow-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500 text-white rounded-xl">
              {ICONS.Logo}
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800 leading-tight">Se Libre</h1>
              <p className="text-[10px] font-semibold text-emerald-600 uppercase tracking-widest">
                {role === 'admin' ? 'Administrador' : userName}
              </p>
            </div>
          </div>
          <button onClick={handleLogout} className="p-2 text-slate-300 hover:text-red-400">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          </button>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 w-full max-w-lg md:max-w-screen-2xl mx-auto p-4 md:p-8 overflow-y-auto pb-24 md:pb-8">
        {renderView()}
      </main>
      
      {/* NAVEGACIÓN INFERIOR (Móvil) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-2 py-3 flex justify-around items-center z-20 shadow-[0_-4px_12px_-1px_rgba(16,185,129,0.08)]">
        <NavButton active={activeView === 'home'} icon={ICONS.Dashboard} label="Balance" onClick={() => setActiveView('home')} />
        <NavButton active={activeView === 'sales'} icon={ICONS.Sales} label="Ventas" onClick={() => setActiveView('sales')} />
        <NavButton active={activeView === 'stock'} icon={ICONS.Stock} label="Stock" onClick={() => setActiveView('stock')} />
        
        {role === 'admin' && (
          <>
            <NavButton active={activeView === 'reports'} icon={ICONS.Reports} label="Informe" onClick={() => setActiveView('reports')} />
            <NavButton active={activeView === 'movements'} icon={ICONS.Movements} label="Movs." onClick={() => setActiveView('movements')} />
            <NavButton active={activeView === 'statistics'} icon={ICONS.Stats} label="Métricas" onClick={() => setActiveView('statistics')} />
          </>
        )}
      </nav>
    </div>
  );
};

interface SidebarButtonProps { active: boolean; icon: React.ReactNode; label: string; onClick: () => void; }
const SidebarButton: React.FC<SidebarButtonProps> = ({ active, icon, label, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all ${active ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}>
    <div className={active ? 'text-white' : 'text-slate-400'}>{icon}</div>
    {label}
  </button>
);

interface NavButtonProps { active: boolean; icon: React.ReactNode; label: string; onClick: () => void; }
const NavButton: React.FC<NavButtonProps> = ({ active, icon, label, onClick }) => (
  <button onClick={onClick} className={`flex flex-col items-center transition-all duration-300 min-w-[54px] ${active ? 'text-emerald-600 scale-105' : 'text-slate-400'}`}>
    <div className={`${active ? 'bg-emerald-50 p-2 rounded-xl ring-1 ring-emerald-100' : 'p-2'}`}>{icon}</div>
    <span className="text-[8px] font-bold mt-0.5">{label}</span>
  </button>
);

export default App;
