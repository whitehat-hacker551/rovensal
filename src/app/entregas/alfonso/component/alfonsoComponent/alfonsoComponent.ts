import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSliderModule } from '@angular/material/slider';
import { MatCardModule } from '@angular/material/card';
import { AlfonsoRecipesService, RecipeFilter } from '../../services/recipes.service';
import { Recipe } from '../../models/recipe.model';
import { ChecklistItem } from '../../models/checklist-item.model';
import { ContextAction } from '../../models/context-action.model';
import { AlfonsoInspirationService, InspirationRecipe } from '../../services/inspiration.service';
import { RecipeCardComponent, RecipeContextEvent } from '../recipeCard/recipeCard';
import { ContextMenuComponent } from '../contextMenu/contextMenu';
import { ChecklistComponent } from '../checklist/checklist';
import { RecipeDetailDialogComponent } from '../dialogs/recipeDetailDialog/recipeDetailDialog';
import { SupplierSelectorDialogComponent } from '../dialogs/supplierSelectorDialog/supplierSelectorDialog';
import { InspirationDialogComponent } from '../dialogs/inspirationDialog/inspirationDialog';
import { Supplier } from '../../models/supplier.model';

interface ContextMenuState {
  visible: boolean;
  x: number;
  y: number;
  recipe: Recipe | null;
}

@Component({
  selector: 'app-alfonso',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatSliderModule,
    MatCardModule,
    RecipeCardComponent,
    ContextMenuComponent,
    ChecklistComponent
  ],
  templateUrl: './alfonsoComponent.html',
  styleUrl: './alfonsoComponent.css'
})
export class AlfonsoComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly recipesService = inject(AlfonsoRecipesService);
  private readonly inspirationService = inject(AlfonsoInspirationService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly moods = [
    { id: 'dulce', label: 'Dulce' },
    { id: 'salado', label: 'Salado' },
    { id: 'exprés', label: 'Exprés' }
  ];

  protected readonly selectedMood = signal<'dulce' | 'salado' | 'exprés'>('salado');
  protected moodModel: 'dulce' | 'salado' | 'exprés' = this.selectedMood();
  protected readonly recipes = signal<Recipe[]>([]);
  protected readonly filteredRecipes = signal<Recipe[]>([]);
  protected readonly loadingRecipes = signal(true);
  protected readonly inspirationsLoading = signal(false);
  protected readonly lastPlanSummary = signal<string | null>(null);
  protected readonly contextMenuState = signal<ContextMenuState>({
    visible: false,
    x: 0,
    y: 0,
    recipe: null
  });

  protected readonly heroStats = computed(() => {
    const recipes = this.filteredRecipes();
    const totalCost = recipes.reduce((acc, recipe) => acc + recipe.costPerServing * recipe.servings, 0);
    const favoriteId = this.recipesService.lastFavorite();
    const favoriteName = favoriteId ? recipes.find(recipe => recipe.id === favoriteId)?.title ?? 'Sin selección' : 'Sin selección';
    return [
      { label: 'Recetas activas', value: recipes.length.toString() },
      { label: 'Coste combinado', value: `${totalCost.toFixed(2)} €` },
      { label: 'Favorito reciente', value: favoriteName }
    ];
  });

  protected readonly veganShowcase = computed(() =>
    this.recipes().filter(recipe => recipe.tags.includes('vegano')).slice(0, 4)
  );

  protected readonly checklist: ChecklistItem[] = [
    { id: 1, label: 'Mise en place de fermentos', critical: true, completed: false, notes: 'Revisar PH antes de las 12h' },
    { id: 2, label: 'Caldo base para ramen frío', critical: false, completed: true },
    { id: 3, label: 'Inventario de especias', critical: true, completed: false },
    { id: 4, label: 'Actualizar etiquetas de alérgenos', critical: false, completed: false }
  ];

  protected readonly filterForm = this.fb.group({
    term: [''],
    difficulty: ['todas'],
    maxTime: [60],
    mood: ['todas']
  });

  protected readonly planForm = this.fb.group({
    recipeId: this.fb.control<number | null>(null, Validators.required),
    day: ['Lunes', Validators.required],
    service: ['comida', Validators.required],
    diners: [20, [Validators.required, Validators.min(1), Validators.max(60)]],
    notes: [''],
    supplierName: ['']
  });

  protected readonly days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  protected readonly services = ['comida', 'cena'];

  protected readonly contextActions = computed<ContextAction[]>(() => [
    { id: 'detalle', label: 'Ver receta', icon: 'bi bi-eye' },
    { id: 'plan', label: 'Añadir al menú', icon: 'bi bi-calendar-plus' },
    { id: 'favorito', label: 'Alternar favorito', icon: 'bi bi-heart' }
  ]);

  ngOnInit(): void {
    this.recipesService
      .getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(recipes => {
        this.recipes.set(recipes);
        this.filteredRecipes.set(recipes);
        this.loadingRecipes.set(false);
        if (!this.planForm.value.recipeId && recipes.length) {
          this.planForm.patchValue({ recipeId: recipes[0].id });
        }
      });

    this.filterForm.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.applyFilters());
  }

  applyFilters(): void {
    const raw = this.filterForm.getRawValue();
    const filter: RecipeFilter = {
      term: raw.term ?? '',
      difficulty: (raw.difficulty as RecipeFilter['difficulty']) ?? 'todas',
      maxTime: raw.maxTime ?? undefined,
      mood: (raw.mood as RecipeFilter['mood']) ?? 'todas'
    };
    this.loadingRecipes.set(true);
    this.recipesService
      .filterRecipes(filter)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(recipes => {
        this.filteredRecipes.set(recipes);
        this.loadingRecipes.set(false);
      });
  }

  resetFilters(): void {
    this.filterForm.setValue({ term: '', difficulty: 'todas', maxTime: 60, mood: 'todas' });
  }

  openRecipeDialog(recipe: Recipe): void {
    this.dialog.open(RecipeDetailDialogComponent, {
      data: recipe,
      width: '600px'
    });
  }

  toggleFavorite(recipe: Recipe): void {
    this.recipesService
      .toggleFavorite(recipe.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(updated => {
        if (updated) {
          this.snackBar.open(`${updated.title} actualizado`, 'OK', { duration: 1800 });
        }
      });
  }

  onRecipeContext(event: RecipeContextEvent): void {
    this.contextMenuState.set({
      visible: true,
      x: event.event.clientX,
      y: event.event.clientY,
      recipe: event.recipe
    });
  }

  hideContextMenu(): void {
    this.contextMenuState.set({ visible: false, x: 0, y: 0, recipe: null });
  }

  handleContextAction(action: ContextAction): void {
    const recipe = this.contextMenuState().recipe;
    if (!recipe) {
      return;
    }
    switch (action.id) {
      case 'detalle':
        this.openRecipeDialog(recipe);
        break;
      case 'plan':
        this.planForm.patchValue({ recipeId: recipe.id, notes: `Planificado desde ${recipe.title}` });
        this.snackBar.open('Formulario actualizado con la receta seleccionada.', undefined, { duration: 2000 });
        break;
      case 'favorito':
        this.toggleFavorite(recipe);
        break;
    }
    this.hideContextMenu();
  }

  openSupplierSelector(): void {
    const dialogRef = this.dialog.open<SupplierSelectorDialogComponent, void, Supplier>(SupplierSelectorDialogComponent, {
      width: '640px'
    });
    dialogRef.afterClosed().subscribe(selected => {
      if (selected) {
        this.planForm.patchValue({ supplierName: selected.name });
        this.snackBar.open(`Proveedor ${selected.name} añadido al plan.`, 'hecho', { duration: 2500 });
      }
    });
  }

  loadInspirations(): void {
    this.inspirationsLoading.set(true);
    this.inspirationService
      .getInspirations()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((inspirations: InspirationRecipe[]) => {
        this.dialog.open(InspirationDialogComponent, {
          data: { inspirations },
          width: '640px'
        });
        this.inspirationsLoading.set(false);
      });
  }

  submitPlan(): void {
    if (this.planForm.invalid) {
      this.planForm.markAllAsTouched();
      return;
    }
    const { recipeId, day, service, diners, supplierName } = this.planForm.getRawValue();
    const recipe = this.recipes().find(item => item.id === recipeId);
    const summary = `Menú ${service} del ${day}: ${recipe?.title ?? 'receta sin definir'} · ${diners} comensales`;
    this.lastPlanSummary.set(summary + (supplierName ? ` · Proveedor ${supplierName}` : ''));
    this.snackBar.open('Plan semanal actualizado.', 'ver', { duration: 3000 });
    this.planForm.patchValue({ notes: '' });
  }

  updateMood(mood: 'dulce' | 'salado' | 'exprés'): void {
    this.selectedMood.set(mood);
    this.moodModel = mood;
    this.filterForm.patchValue({ mood }, { emitEvent: true });
  }

  onChecklistToggle(item: ChecklistItem): void {
    this.snackBar.open(
      `${item.label} marcado como ${item.completed ? 'listo' : 'pendiente'}`,
      undefined,
      { duration: 1500 }
    );
  }
}
