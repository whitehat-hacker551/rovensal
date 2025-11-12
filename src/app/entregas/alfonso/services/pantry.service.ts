import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, delay, map } from 'rxjs';
import { PantryItem, PantryStatus } from '../models/pantry-item.model';

@Injectable({
  providedIn: 'root'
})
export class AlfonsoPantryService {
  private readonly itemsSeed: PantryItem[] = [
    {
      id: 1,
      name: 'Harina de espelta',
      quantity: 4,
      unit: 'kg',
      category: 'despensa',
      status: 'bajo',
      supplier: 'Harinería Heredia',
      reorderLevel: 2,
      notes: 'Preferente para masas de fermentación lenta.'
    },
    {
      id: 2,
      name: 'Manteca de cacao',
      quantity: 1.2,
      unit: 'kg',
      category: 'preparados',
      status: 'ok',
      supplier: 'EcoCacao',
      reorderLevel: 0.5
    },
    {
      id: 3,
      name: 'Mizuna fresca',
      quantity: 0.8,
      unit: 'kg',
      category: 'frescos',
      status: 'agotado',
      supplier: 'Huerto KM0',
      reorderLevel: 1,
      notes: 'Necesario para el menú verde del jueves.'
    },
    {
      id: 4,
      name: 'Garam masala',
      quantity: 0.3,
      unit: 'kg',
      category: 'especias',
      status: 'ok',
      supplier: 'Sabores del Mundo',
      reorderLevel: 0.1
    }
  ];

  private readonly pantrySubject = new BehaviorSubject<PantryItem[]>(structuredClone(this.itemsSeed));
  readonly pantry$ = this.pantrySubject.asObservable();

  getAll(): Observable<PantryItem[]> {
    return this.pantry$.pipe(delay(120));
  }

  updateStatus(id: number, status: PantryStatus): void {
    const items = structuredClone(this.pantrySubject.value);
    const index = items.findIndex(item => item.id === id);
    if (index === -1) {
      return;
    }
    items[index].status = status;
    this.pantrySubject.next(items);
  }

  summaryByCategory(): Observable<Record<string, number>> {
    return this.pantry$.pipe(
      map(items => items.reduce<Record<string, number>>((acc, item) => {
        acc[item.category] = (acc[item.category] ?? 0) + item.quantity;
        return acc;
      }, {}))
    );
  }
}
