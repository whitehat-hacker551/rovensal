import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { AlfonsoPantryService } from '../../services/pantry.service';
import { PantryItem, PantryStatus } from '../../models/pantry-item.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-alfonso-stock',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule],
  templateUrl: './stockPage.html',
  styleUrl: './stockPage.css'
})
export class StockPageComponent {
  private readonly pantryService = inject(AlfonsoPantryService);
  protected readonly items = signal<PantryItem[]>([]);

  constructor() {
    this.pantryService
      .getAll()
      .pipe(takeUntilDestroyed())
      .subscribe(items => this.items.set(items));
  }

  statusClass(status: PantryStatus): string {
    switch (status) {
      case 'ok':
        return 'text-bg-success';
      case 'bajo':
        return 'text-bg-warning';
      default:
        return 'text-bg-danger';
    }
  }

  updateStatus(item: PantryItem, status: PantryStatus): void {
    this.pantryService.updateStatus(item.id, status);
    this.items.update(items =>
      items.map(current => (current.id === item.id ? { ...current, status } : current))
    );
  }
}
