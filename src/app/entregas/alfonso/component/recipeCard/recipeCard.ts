import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Recipe } from '../../models/recipe.model';

export interface RecipeContextEvent {
  event: MouseEvent;
  recipe: Recipe;
}

@Component({
  selector: 'app-alfonso-recipe-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatChipsModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './recipeCard.html',
  styleUrl: './recipeCard.css'
})
export class RecipeCardComponent {
  @Input({ required: true }) recipe!: Recipe;
  @Output() view = new EventEmitter<Recipe>();
  @Output() favorite = new EventEmitter<Recipe>();
  @Output() contextMenu = new EventEmitter<RecipeContextEvent>();

  get difficultyBadge(): string {
    switch (this.recipe.difficulty) {
      case 'fácil':
        return 'badge text-bg-success';
      case 'media':
        return 'badge text-bg-warning';
      default:
        return 'badge text-bg-danger';
    }
  }

  onContextMenu(event: MouseEvent): void {
    event.preventDefault();
    this.contextMenu.emit({ event, recipe: this.recipe });
  }
}
