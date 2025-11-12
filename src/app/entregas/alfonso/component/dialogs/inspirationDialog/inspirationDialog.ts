import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { InspirationRecipe } from '../../../services/inspiration.service';

export interface InspirationDialogData {
  inspirations: InspirationRecipe[];
}

@Component({
  selector: 'app-alfonso-inspiration-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './inspirationDialog.html',
  styleUrl: './inspirationDialog.css'
})
export class InspirationDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public readonly data: InspirationDialogData) {}
}
