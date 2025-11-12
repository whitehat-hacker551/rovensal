import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContextAction } from '../../models/context-action.model';

@Component({
  selector: 'app-alfonso-context-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contextMenu.html',
  styleUrl: './contextMenu.css'
})
export class ContextMenuComponent<TPayload = unknown> {
  @Input() visible = false;
  @Input() x = 0;
  @Input() y = 0;
  @Input() actions: ContextAction<TPayload>[] = [];

  @Output() actionSelected = new EventEmitter<ContextAction<TPayload>>();
  @Output() dismissed = new EventEmitter<void>();

  @HostListener('document:click')
  onDocumentClick(): void {
    if (this.visible) {
      this.dismissed.emit();
    }
  }

  trackById(_: number, action: ContextAction<TPayload>): string {
    return action.id;
  }

  select(action: ContextAction<TPayload>): void {
    this.actionSelected.emit(action);
  }
}
