import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChecklistItem } from '../../models/checklist-item.model';

@Component({
  selector: 'app-alfonso-checklist',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checklist.html',
  styleUrl: './checklist.css'
})
export class ChecklistComponent {
  @Input() title = 'Checklist';
  @Input() items: ChecklistItem[] = [];
  @Output() toggled = new EventEmitter<ChecklistItem>();

  onToggle(item: ChecklistItem): void {
    item.completed = !item.completed;
    this.toggled.emit(item);
  }
}
