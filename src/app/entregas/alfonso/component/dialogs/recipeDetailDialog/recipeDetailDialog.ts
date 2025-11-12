import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { Recipe } from '../../../models/recipe.model';

@Component({
  selector: 'app-alfonso-recipe-detail-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatChipsModule, MatButtonModule],
  templateUrl: './recipeDetailDialog.html',
  styleUrl: './recipeDetailDialog.css'
})
export class RecipeDetailDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public readonly recipe: Recipe,
    private readonly dialogRef: MatDialogRef<RecipeDetailDialogComponent>
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}
