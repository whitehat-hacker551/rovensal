export type PantryStatus = 'ok' | 'bajo' | 'agotado';

export interface PantryItem {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  category: 'frescos' | 'despensa' | 'especias' | 'preparados';
  status: PantryStatus;
  supplier: string;
  reorderLevel: number;
  notes?: string;
}
