import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Supplier, SupplierSpecialty } from '../models/supplier.model';

@Injectable({
  providedIn: 'root'
})
export class AlfonsoSuppliersService {
  private readonly suppliers: Supplier[] = [
    {
      id: 1,
      name: 'Harinas La Vega',
      specialty: 'bulk',
      leadTimeDays: 2,
      rating: 4.7,
      minOrder: 40,
      contact: 'hola@harinaslavega.es',
      deliveryDays: ['martes', 'viernes'],
      highlightedProducts: ['espelta', 'tritordeum', 'centeno']
    },
    {
      id: 2,
      name: 'Huerto Atlántico',
      specialty: 'km0',
      leadTimeDays: 1,
      rating: 4.9,
      minOrder: 30,
      contact: '+34 611 555 010',
      deliveryDays: ['lunes', 'jueves'],
      highlightedProducts: ['mizuna', 'microverdes', 'tomate rosa']
    },
    {
      id: 3,
      name: 'Sabores del Mundo',
      specialty: 'gourmet',
      leadTimeDays: 4,
      rating: 4.4,
      minOrder: 60,
      contact: 'pedidos@saboresmundo.com',
      deliveryDays: ['miércoles'],
      highlightedProducts: ['especias', 'fermentos', 'salsas base']
    },
    {
      id: 4,
      name: 'Bio Lácteos Vega',
      specialty: 'eco',
      leadTimeDays: 3,
      rating: 4.6,
      minOrder: 50,
      contact: '+34 688 777 900',
      deliveryDays: ['martes', 'viernes'],
      highlightedProducts: ['yogur vegetal', 'mantequilla clarificada']
    }
  ];

  getAll(): Observable<Supplier[]> {
    return of(structuredClone(this.suppliers));
  }

  bySpecialty(specialty: SupplierSpecialty | 'todas'): Observable<Supplier[]> {
    if (specialty === 'todas') {
      return this.getAll();
    }
    return of(this.suppliers.filter(supplier => supplier.specialty === specialty));
  }
}
