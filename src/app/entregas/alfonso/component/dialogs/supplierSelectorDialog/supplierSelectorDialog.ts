import { Component, OnInit, inject, signal } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { AlfonsoSuppliersService } from '../../../services/suppliers.service';
import { Supplier, SupplierSpecialty } from '../../../models/supplier.model';

@Component({
  selector: 'app-alfonso-supplier-selector-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatListModule, MatButtonModule, MatChipsModule, CurrencyPipe],
  templateUrl: './supplierSelectorDialog.html',
  styleUrl: './supplierSelectorDialog.css'
})
export class SupplierSelectorDialogComponent implements OnInit {
  protected readonly specialties: Array<SupplierSpecialty | 'todas'> = ['todas', 'km0', 'eco', 'gourmet', 'bulk'];
  protected readonly activeSpecialty = signal<SupplierSpecialty | 'todas'>('todas');
  protected suppliers$!: Observable<Supplier[]>;
  protected selectedSupplier: Supplier | null = null;

  private readonly service = inject(AlfonsoSuppliersService);

  constructor(private readonly dialogRef: MatDialogRef<SupplierSelectorDialogComponent>) {}

  ngOnInit(): void {
    this.loadSuppliers();
  }

  loadSuppliers(): void {
    this.suppliers$ = this.service.bySpecialty(this.activeSpecialty());
    this.selectedSupplier = null;
  }

  setSpecialty(specialty: SupplierSpecialty | 'todas'): void {
    this.activeSpecialty.set(specialty);
    this.loadSuppliers();
  }

  select(supplier: Supplier): void {
    this.selectedSupplier = supplier;
  }

  confirm(): void {
    if (this.selectedSupplier) {
      this.dialogRef.close(this.selectedSupplier);
    }
  }
}
