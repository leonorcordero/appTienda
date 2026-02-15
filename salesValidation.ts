import { Sale, SalePayment, StockItem } from './types';

interface SaleDraft {
  productCode: string;
  unitPrice: number;
  quantity: number;
  debtAmount: number;
  payments: SalePayment[];
}

export const getAvailableStockForSale = (
  stock: StockItem[],
  sales: Sale[],
  editingSaleId: string | null,
  productCode: string
): number => {
  const stockItem = stock.find((item) => item.code.toLowerCase() === productCode.toLowerCase());
  if (!stockItem) return 0;

  if (!editingSaleId) return stockItem.quantity;

  const previousSale = sales.find((sale) => sale.id === editingSaleId);
  if (previousSale?.productCode === stockItem.code) {
    return stockItem.quantity + previousSale.quantity;
  }

  return stockItem.quantity;
};

export const validateSaleDraft = (
  draft: SaleDraft,
  availableStock: number
): string | null => {
  const total = draft.unitPrice * draft.quantity;
  const paidAmount = draft.payments.reduce((sum, payment) => sum + payment.amount, 0);

  if (!draft.productCode.trim()) return 'Ingrese un código válido.';

  if (draft.quantity <= 0 || draft.unitPrice <= 0) {
    return 'La cantidad y el precio unitario deben ser mayores que 0.';
  }

  if (draft.debtAmount < 0 || draft.debtAmount > total) {
    return 'El monto de deuda es inválido para el total de la venta.';
  }

  if (Math.abs((paidAmount + draft.debtAmount) - total) > 0.01) {
    return 'El dinero ingresado más la deuda debe coincidir con el total de la venta.';
  }

  if (draft.quantity > availableStock) {
    return `Stock insuficiente. Disponible: ${availableStock} unidad(es).`;
  }

  return null;
};
