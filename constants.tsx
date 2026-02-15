
import React from 'react';
import { LayoutDashboard, Package, ShoppingCart, Plus, Search, Trash2, TrendingUp, DollarSign, Clock, Pencil, FileText, History, BarChart3 } from 'lucide-react';

// Custom Dragonfly Icon (Libélula)
export const DragonflyIcon = ({ size = 20 }: { size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M12 8v12" />
    <path d="M12 10c4-1 10-1 10 2s-6 3-10 2" />
    <path d="M12 10C8 9 2 9 2 12s6 3 10 2" />
    <path d="M12 14c3-0.5 8-0.5 8 2s-5 2.5-8 2" />
    <path d="M12 14c-3-0.5-8-0.5-8 2s5 2.5 8 2" />
    <circle cx="12" cy="6" r="2" />
  </svg>
);

export const ICONS = {
  Dashboard: <LayoutDashboard size={20} />,
  Stock: <Package size={20} />,
  Sales: <ShoppingCart size={20} />,
  Reports: <FileText size={20} />,
  Movements: <History size={20} />,
  Stats: <BarChart3 size={20} />,
  Plus: <Plus size={20} />,
  Search: <Search size={18} />,
  Delete: <Trash2 size={18} />,
  Edit: <Pencil size={18} />,
  Trend: <TrendingUp size={20} />,
  Money: <DollarSign size={20} />,
  Pending: <Clock size={20} />,
  Logo: <DragonflyIcon size={20} />
};

export const COLORS = {
  primary: '#10b981', // Verde Esmeralda (Naturaleza)
  primaryLight: '#f0fdf4', // Verde muy claro
  secondary: '#f97316', // Naranja Suave
  secondaryLight: '#fff7ed', // Naranja muy claro
  danger: '#ef4444',
  text: '#374151'
};
