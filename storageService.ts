
import { StockItem, Sale, ManualMovement } from './types';
import { getLocalDateISO } from './dateUtils';

const KEYS = {
  STOCK: 'selibre_stock',
  SALES: 'selibre_sales',
  MOVEMENTS: 'selibre_manual_movements',
  BALANCES: 'selibre_initial_balances',
  DAILY: 'selibre_daily_registry',
  CLOSED_DAYS: 'selibre_closed_days'
};

export const storageService = {
  async saveAll(data: { stock: StockItem[], sales: Sale[], movements: ManualMovement[] }) {
    localStorage.setItem(KEYS.STOCK, JSON.stringify(data.stock));
    localStorage.setItem(KEYS.SALES, JSON.stringify(data.sales));
    localStorage.setItem(KEYS.MOVEMENTS, JSON.stringify(data.movements));
  },

  async getAll() {
    return {
      stock: JSON.parse(localStorage.getItem(KEYS.STOCK) || '[]') as StockItem[],
      sales: JSON.parse(localStorage.getItem(KEYS.SALES) || '[]') as Sale[],
      movements: JSON.parse(localStorage.getItem(KEYS.MOVEMENTS) || '[]') as ManualMovement[],
      balances: JSON.parse(localStorage.getItem(KEYS.BALANCES) || '{"bank":0,"cash":0,"usd":0}')
    };
  },

  exportDatabase() {
    const data = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      stock: JSON.parse(localStorage.getItem(KEYS.STOCK) || '[]'),
      sales: JSON.parse(localStorage.getItem(KEYS.SALES) || '[]'),
      movements: JSON.parse(localStorage.getItem(KEYS.MOVEMENTS) || '[]'),
      daily: JSON.parse(localStorage.getItem(KEYS.DAILY) || '{}'),
      balances: JSON.parse(localStorage.getItem(KEYS.BALANCES) || '{}')
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SeLibre_Respaldo_${getLocalDateISO()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },


  clearAppData() {
    Object.values(KEYS).forEach((key) => localStorage.removeItem(key));
    localStorage.removeItem('selibre_auth');
    localStorage.removeItem('selibre_role');
    localStorage.removeItem('selibre_user_name');
  },

  async importDatabase(file: File): Promise<boolean> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          if (data.stock) localStorage.setItem(KEYS.STOCK, JSON.stringify(data.stock));
          if (data.sales) localStorage.setItem(KEYS.SALES, JSON.stringify(data.sales));
          if (data.movements) localStorage.setItem(KEYS.MOVEMENTS, JSON.stringify(data.movements));
          if (data.daily) localStorage.setItem(KEYS.DAILY, JSON.stringify(data.daily));
          if (data.balances) localStorage.setItem(KEYS.BALANCES, JSON.stringify(data.balances));
          resolve(true);
        } catch (err) {
          console.error("Error importando:", err);
          resolve(false);
        }
      };
      reader.readAsText(file);
    });
  }
};
