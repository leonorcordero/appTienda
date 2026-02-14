
export enum PaymentMethod {
  CASH = 'Efectivo',
  TRANSFER = 'Transferencia',
  PENDING = 'Pendiente'
}

export enum DebtStatus {
  NONE = 'Saldado',
  CUSTOMER_OWES = 'Cliente Debe',
  STORE_OWES = 'Debemos'
}

export type MovementType = 'entry' | 'extraction';
export type UserRole = 'admin' | 'seller';

export interface StockMovement {
  id: string;
  date: string;
  type: MovementType;
  quantityChange: number;
  costValue?: number;
  reason?: string;
}

export interface StockItem {
  id: string;
  purchaseDate: string;
  code: string;
  name: string;
  category: string;
  quantity: number;
  costValue: number;
  salePrice: number;
  consignee: string;
  movementHistory?: StockMovement[];
}

export interface SalePayment {
  method: PaymentMethod;
  amount: number;
}

export interface Sale {
  id: string;
  date: string;
  sellerName: string;
  buyerName: string;
  productCode: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  payments: SalePayment[];
  debtStatus: DebtStatus;
  debtAmount: number;
  observations?: string;
}

export type ManualMovementCategory = 
  | 'Ingreso por error' 
  | 'Otros ingresos'
  | 'Compra' 
  | 'Pagos pendientes de compras' 
  | 'Compra de USD' 
  | 'Consignación sede central' 
  | 'Traspaso sede local' 
  | 'Pago consignación' 
  | 'Devolución' 
  | 'Pago trabajos' 
  | 'Otros egresos' 
  | 'Devolución caja'
  | 'Retiro de caja (Resguardo)';

export interface ManualMovement {
  id: string;
  date: string;
  type: 'income' | 'expense';
  category: ManualMovementCategory;
  amount: number;
  description: string;
  paymentMethod: PaymentMethod;
}

export type AppView = 'home' | 'stock' | 'sales' | 'reports' | 'movements' | 'statistics';
