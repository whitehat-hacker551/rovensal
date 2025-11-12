import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AlfonsoRecipesService } from '../../services/recipes.service';
import { Recipe } from '../../models/recipe.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface MenuSlot {
  day: string;
  service: 'comida' | 'cena';
  recipeId: number;
}

@Component({
  selector: 'app-alfonso-menu',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './menuPage.html',
  styleUrl: './menuPage.css'
})
export class MenuPageComponent {
  private readonly recipesService = inject(AlfonsoRecipesService);
  protected readonly recipes = signal<Recipe[]>([]);
  protected readonly plan: MenuSlot[] = [
    { day: 'Lunes', service: 'comida', recipeId: 101 },
    { day: 'Lunes', service: 'cena', recipeId: 103 },
    { day: 'Martes', service: 'comida', recipeId: 104 },
    { day: 'Martes', service: 'cena', recipeId: 102 },
    { day: 'Miércoles', service: 'comida', recipeId: 103 },
    { day: 'Jueves', service: 'comida', recipeId: 101 },
    { day: 'Viernes', service: 'cena', recipeId: 104 }
  ];

  constructor() {
    this.recipesService
      .getAll()
      .pipe(takeUntilDestroyed())
      .subscribe(recipes => this.recipes.set(recipes));
  }

  recipeFor(recipeId: number): Recipe | undefined {
    return this.recipes().find(recipe => recipe.id === recipeId);
  }
}
