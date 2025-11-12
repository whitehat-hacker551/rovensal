export type SupplierSpecialty = 'km0' | 'eco' | 'gourmet' | 'bulk';

export interface Supplier {
  id: number;
  name: string;
  specialty: SupplierSpecialty;
  leadTimeDays: number;
  rating: number;
  minOrder: number;
  contact: string;
  deliveryDays: string[];
  highlightedProducts: string[];
}
