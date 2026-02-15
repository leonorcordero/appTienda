
import React, { useMemo } from 'react';
import { StockItem, Sale } from './types';
import { ICONS } from './constants';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface StatisticsProps {
  stock: StockItem[];
  sales: Sale[];
}

const Statistics: React.FC<StatisticsProps> = ({ stock, sales }) => {
  // --- PROCESAMIENTO DE DATOS ---
  const stats = useMemo(() => {
    const categoryCounts: Record<string, number> = {};
    const productStats: Record<string, { name: string, qty: number, profit: number, revenue: number }> = {};

    sales.forEach(sale => {
      const product = stock.find(p => p.code === sale.productCode);
      const cat = product?.category || 'Otros';
      const name = product?.name || sale.productCode;
      const cost = product?.costValue || 0;

      // Categortía
      categoryCounts[cat] = (categoryCounts[cat] || 0) + sale.quantity;

      // Productos
      if (!productStats[sale.productCode]) {
        productStats[sale.productCode] = { name, qty: 0, profit: 0, revenue: 0 };
      }
      productStats[sale.productCode].qty += sale.quantity;
      productStats[sale.productCode].revenue += sale.totalPrice;
      productStats[sale.productCode].profit += (sale.unitPrice - cost) * sale.quantity;
    });

    const categoryData = Object.entries(categoryCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    const productsByQty = Object.values(productStats)
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);

    const productsByProfit = Object.values(productStats)
      .sort((a, b) => b.profit - a.profit)
      .slice(0, 5);

    return { categoryData, productsByQty, productsByProfit };
  }, [sales, stock]);

  const COLORS_CHART = ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#d1fae5'];

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Análisis de Rendimiento</h2>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Descubre lo que impulsa tu negocio</p>
      </div>

      {/* 1. CATEGORÍA MÁS VENDIDA */}
      <section className="bg-white rounded-[2.5rem] p-7 shadow-sm border border-slate-50">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1 h-4 bg-emerald-500 rounded-full"></div>
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Categoría Líder</h3>
        </div>

        {stats.categoryData.length > 0 ? (
          <div className="flex flex-col items-center">
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.categoryData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stats.categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS_CHART[index % COLORS_CHART.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="w-full mt-4 space-y-2">
              <div className="bg-emerald-50 p-4 rounded-2xl flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest block">Top Categoría</span>
                  <span className="text-lg font-black text-emerald-800">{stats.categoryData[0]?.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-emerald-600">{stats.categoryData[0]?.value}</span>
                  <span className="text-[9px] font-bold text-emerald-400 block uppercase">Unidades</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <EmptyState />
        )}
      </section>

      {/* 2. PRODUCTOS MÁS VENDIDOS (VOLUMEN) */}
      <section className="bg-white rounded-[2.5rem] p-7 shadow-sm border border-slate-50">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1 h-4 bg-orange-500 rounded-full"></div>
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Ranking de Ventas (Cantidad)</h3>
        </div>

        <div className="space-y-4">
          {stats.productsByQty.map((prod, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100/30">
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${idx === 0 ? 'bg-amber-400 text-white shadow-lg shadow-amber-100' : 'bg-slate-200 text-slate-500'}`}>
                  {idx + 1}
                </div>
                <span className="text-sm font-bold text-slate-700 uppercase tracking-tight truncate max-w-[150px]">{prod.name}</span>
              </div>
              <div className="text-right">
                <span className="text-lg font-black text-slate-800">{prod.qty}</span>
                <span className="text-[9px] font-bold text-slate-400 block uppercase">Uds.</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. PRODUCTOS QUE DEJAN MÁS GANANCIA */}
      <section className="bg-slate-900 rounded-[2.5rem] p-7 shadow-2xl shadow-slate-200 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-5 scale-150 rotate-12">
           {ICONS.Trend}
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-1 h-4 bg-emerald-400 rounded-full"></div>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Top Rentabilidad</h3>
          </div>

          <div className="space-y-6">
            {stats.productsByProfit.map((prod, idx) => (
              <div key={idx} className="flex items-center justify-between group">
                <div className="flex flex-col">
                   <div className="flex items-center gap-2">
                     {idx === 0 && <span className="text-[10px] bg-emerald-500 px-1.5 py-0.5 rounded-md font-black uppercase">Estrella</span>}
                     <span className="text-sm font-bold uppercase tracking-tight text-slate-100">{prod.name}</span>
                   </div>
                   <span className="text-[10px] text-slate-500 font-bold uppercase mt-1">Margen Neto Total</span>
                </div>
                <div className="text-right">
                   <span className="text-xl font-black text-emerald-400 tracking-tighter">${prod.profit.toLocaleString()}</span>
                   <div className="w-full h-1 bg-white/5 rounded-full mt-1 overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 transition-all duration-1000" 
                        style={{ width: `${(prod.profit / stats.productsByProfit[0].profit) * 100}%` }}
                      ></div>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const EmptyState = () => (
  <div className="py-10 text-center text-slate-300 italic text-sm">
    No hay ventas registradas para generar estadísticas.
  </div>
);

export default Statistics;
