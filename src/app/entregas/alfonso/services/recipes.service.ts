import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable, delay, map, of } from 'rxjs';
import { MealMood, Recipe, RecipeDifficulty } from '../models/recipe.model';

export interface RecipeFilter {
  term?: string;
  difficulty?: RecipeDifficulty | 'todas';
  maxTime?: number;
  mood?: MealMood | 'todas';
}

@Injectable({
  providedIn: 'root'
})
export class AlfonsoRecipesService {
  private readonly recipesSeed: Recipe[] = [
    {
      id: 101,
      title: 'Buns de calabaza fermentada',
      description: 'Panecillos vapor con miso suave, perfectos para brunch de otoño.',
      mood: 'salado',
      difficulty: 'media',
      timeMinutes: 70,
      servings: 6,
      costPerServing: 2.1,
      calories: 230,
      tags: ['vegetariano', 'sin lactosa'],
      image: '/alfonso/Panecillos-calabaza-chocolate_3.jpg',
      ingredients: [
        { name: 'Harina de trigo', quantity: 320, unit: 'g' },
        { name: 'Puré de calabaza', quantity: 180, unit: 'g' },
        { name: 'Miso blanco', quantity: 20, unit: 'g', optional: true },
        { name: 'Levadura fresca', quantity: 12, unit: 'g' }
      ],
      steps: [
        'Activar la levadura con agua tibia y azúcar.',
        'Integrar calabaza, miso y harina hasta obtener una masa elástica.',
        'Fermentar 45 minutos y formar bollos.',
        'Cocinar al vapor sobre hojas de col durante 12 minutos.'
      ],
      isFavorite: false,
      author: 'Alfonso Studio',
      lastCooked: '2025-11-01T18:00:00Z'
    },
    {
      id: 102,
      title: 'Tiramisú clásico',
      description: 'Capas de savoiardi al espresso, crema de mascarpone y cacao amargo.',
      mood: 'dulce',
      difficulty: 'fácil',
      timeMinutes: 30,
      servings: 6,
      costPerServing: 2.2,
      calories: 360,
      tags: ['sin alcohol'],
      image: '/alfonso/tiramisu-real.jpg',
      ingredients: [
        { name: 'Bizcochos savoiardi', quantity: 250, unit: 'g' },
        { name: 'Espresso frío', quantity: 200, unit: 'ml' },
        { name: 'Mascarpone', quantity: 300, unit: 'g' },
        { name: 'Cacao puro', quantity: 2, unit: 'cda' }
      ],
      steps: [
        'Batir mascarpone con azúcar glas y crema vegetal.',
        'Sumergir brevemente los savoiardi en espresso.',
        'Alternar capas de crema y bizcocho en una fuente.',
        'Refrigerar mínimo 2 horas y espolvorear cacao antes de servir.'
      ],
      isFavorite: true,
      author: 'Equipo Postres',
      lastCooked: '2025-11-05T21:00:00Z'
    },
    {
      id: 103,
      title: 'Ramen frío de pepino y sésamo',
      description: 'Versión exprés para servicio de medio día con caldo dashi helado.',
      mood: 'exprés',
      difficulty: 'fácil',
      timeMinutes: 18,
      servings: 2,
      costPerServing: 1.2,
      calories: 180,
      tags: ['vegano', 'sin lactosa'],
      image: '/alfonso/ramen.jpg',
      ingredients: [
        { name: 'Fideos ramen', quantity: 160, unit: 'g' },
        { name: 'Pepino', quantity: 1, unit: 'ud' },
        { name: 'Caldo dashi', quantity: 400, unit: 'ml' },
        { name: 'Aceite de sésamo', quantity: 10, unit: 'ml' }
      ],
      steps: [
        'Cocer y refrescar los fideos.',
        'Laminas de pepino y condimentos.',
        'Servir con caldo helado y semillas de sésamo.'
      ],
      isFavorite: false,
      author: 'Laboratorio Exprés',
      lastCooked: '2025-11-03T13:00:00Z'
    },
    {
      id: 104,
      title: 'Coliflor tikka glaseada',
      description: 'Horno alto con mezcla de especias y glaseado de yogur vegetal.',
      mood: 'salado',
      difficulty: 'retadora',
      timeMinutes: 55,
      servings: 5,
      costPerServing: 2.4,
      calories: 260,
      tags: ['vegano', 'sin gluten'],
      image: '/alfonso/coliflor-glaseada-768x1272.jpg',
      ingredients: [
        { name: 'Coliflor', quantity: 1, unit: 'ud' },
        { name: 'Garam masala', quantity: 1, unit: 'cda' },
        { name: 'Yogur vegetal', quantity: 120, unit: 'g' },
        { name: 'Jarabe de granada', quantity: 30, unit: 'ml', optional: true }
      ],
      steps: [
        'Marinar la coliflor con especias y yogur.',
        'Hornear 35 minutos a 200 ºC.',
        'Glasear con jarabe y gratinar 5 minutos más.'
      ],
      isFavorite: false,
      author: 'Cocina Vegetal',
      lastCooked: '2025-10-29T19:30:00Z'
    },
    {
      id: 105,
      title: 'Bao de shiitake y hoisin cítrica',
      description: 'Pan bao vegano relleno de setas glaseadas y encurtidos exprés.',
      mood: 'salado',
      difficulty: 'media',
      timeMinutes: 40,
      servings: 8,
      costPerServing: 1.6,
      calories: 210,
      tags: ['vegano', 'sin lactosa'],
      image: '/alfonso/1400x919-Crispy-shiitake-bao-buns-aa283b04-7068-4c4e-9f35-0797cfec7978-0-1400x919.jpg',
      ingredients: [
        { name: 'Bao precocidos', quantity: 8, unit: 'ud' },
        { name: 'Seta shiitake', quantity: 250, unit: 'g' },
        { name: 'Salsa hoisin', quantity: 60, unit: 'g' },
        { name: 'Pepino encurtido', quantity: 80, unit: 'g' }
      ],
      steps: [
        'Saltear shiitake y glasear con hoisin y cítricos.',
        'Abrir baos al vapor y rellenar con setas.',
        'Añadir encurtidos y hojas de pak choi.'
      ],
      isFavorite: false,
      author: 'Equipo Street Food',
      lastCooked: '2025-11-07T14:00:00Z'
    },
    {
      id: 106,
      title: 'Granola templada de cacao y quinoa',
      description: 'Desayuno vegano rico en proteína vegetal con frutas asadas.',
      mood: 'dulce',
      difficulty: 'fácil',
      timeMinutes: 30,
      servings: 6,
      costPerServing: 1.1,
      calories: 320,
      tags: ['vegano', 'sin gluten'],
      image: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&w=900&q=80',
      ingredients: [
        { name: 'Quinoa inflada', quantity: 120, unit: 'g' },
        { name: 'Copos de avena GF', quantity: 200, unit: 'g' },
        { name: 'Cacao puro', quantity: 25, unit: 'g' },
        { name: 'Fruta de temporada', quantity: 2, unit: 'ud' }
      ],
      steps: [
        'Tostar quinoa y avena con aceite de coco.',
        'Agregar cacao, semillas y endulzante.',
        'Servir templado con fruta asada y yogurt vegetal.'
      ],
      isFavorite: true,
      author: 'Breakfast Lab',
      lastCooked: '2025-11-06T08:30:00Z'
    },
    {
      id: 107,
      title: 'Focaccia de tomate confitado',
      description: 'Masa de fermentación lenta con aceite de romero y aceituna rellena.',
      mood: 'salado',
      difficulty: 'retadora',
      timeMinutes: 95,
      servings: 10,
      costPerServing: 1.9,
      calories: 280,
      tags: ['vegetariano'],
      image: '/alfonso/focaccia-casera.jpg',
      ingredients: [
        { name: 'Harina fuerza', quantity: 520, unit: 'g' },
        { name: 'Tomate cherry', quantity: 200, unit: 'g' },
        { name: 'Aceite de romero', quantity: 40, unit: 'ml' },
        { name: 'Aceitunas rellenas', quantity: 60, unit: 'g', optional: true }
      ],
      steps: [
        'Autólisis de harina y agua 30 minutos.',
        'Añadir levadura y aceite, plegar cada 20 minutos.',
        'Fermentar en frío 12h, hornear con tomates y aceitunas.'
      ],
      isFavorite: false,
      author: 'Panadería Lab',
      lastCooked: '2025-11-04T16:00:00Z'
    },
    {
      id: 108,
      title: 'Trifle de mango especiado',
      description: 'Postre en vaso con capas de crema vegetal, bizcocho y fruta caramelizada.',
      mood: 'dulce',
      difficulty: 'media',
      timeMinutes: 35,
      servings: 6,
      costPerServing: 1.5,
      calories: 340,
      tags: ['sin lactosa'],
      image: '/alfonso/trifle-de-coulis-de-mango-crema-y-jengibre2.jpg',
      ingredients: [
        { name: 'Mango maduro', quantity: 2, unit: 'ud' },
        { name: 'Bizcocho base', quantity: 180, unit: 'g' },
        { name: 'Crema vegetal batida', quantity: 250, unit: 'g' },
        { name: 'Cardamomo', quantity: 2, unit: 'g', optional: true }
      ],
      steps: [
        'Caramelizar mango con especias.',
        'Montar capas de bizcocho, mango y crema.',
        'Refrigerar 15 minutos y terminar con sirope.'
      ],
      isFavorite: true,
      author: 'Postres Express',
      lastCooked: '2025-11-08T11:00:00Z'
    },
    {
      id: 109,
      title: 'Wrap mediterráneo de tempeh',
      description: 'Relleno proteico con tempeh marinado, hummus y hojas crujientes.',
      mood: 'exprés',
      difficulty: 'fácil',
      timeMinutes: 20,
      servings: 4,
      costPerServing: 1.3,
      calories: 250,
      tags: ['vegano', 'sin lactosa'],
      image: '/alfonso/2024_10_28T12_03_43_badun_images.badun.es_79fca6169d91_wrap_de_sensational_pieces_9e7e_1290_742.jpg',
      ingredients: [
        { name: 'Tortillas integrales', quantity: 4, unit: 'ud' },
        { name: 'Tempeh', quantity: 200, unit: 'g' },
        { name: 'Hummus cítrico', quantity: 120, unit: 'g' },
        { name: 'Brotes y rúcula', quantity: 60, unit: 'g' }
      ],
      steps: [
        'Marinar tempeh con pimentón y limón, saltear 5 minutos.',
        'Untar hummus en la tortilla, añadir hojas y tempeh.',
        'Enrollar firme y sellar en plancha.'
      ],
      isFavorite: false,
      author: 'Veg Lab',
      lastCooked: '2025-11-08T12:30:00Z'
    }
  ];

  private readonly recipesSubject = new BehaviorSubject<Recipe[]>(structuredClone(this.recipesSeed));
  readonly recipes$ = this.recipesSubject.asObservable();
  readonly lastFavorite = signal<number | null>(null);

  getAll(): Observable<Recipe[]> {
    return this.recipes$.pipe(delay(200));
  }

  filterRecipes(filter: RecipeFilter): Observable<Recipe[]> {
    return this.recipes$.pipe(
      map(recipes => recipes.filter(recipe => this.matchesFilter(recipe, filter))),
      delay(150)
    );
  }

  getById(id: number): Observable<Recipe | undefined> {
    return this.recipes$.pipe(map(list => list.find(recipe => recipe.id === id)));
  }

  toggleFavorite(id: number): Observable<Recipe | undefined> {
    const collection = structuredClone(this.recipesSubject.value);
    const index = collection.findIndex(recipe => recipe.id === id);
    if (index === -1) {
      return of(undefined);
    }
    collection[index].isFavorite = !collection[index].isFavorite;
    this.recipesSubject.next(collection);
    this.lastFavorite.set(id);
    return of(collection[index]).pipe(delay(100));
  }

  private matchesFilter(recipe: Recipe, filter: RecipeFilter): boolean {
    const normalizedTerm = (filter.term ?? '').trim().toLowerCase();
    const matchesTerm =
      !normalizedTerm ||
      recipe.title.toLowerCase().includes(normalizedTerm) ||
      recipe.tags.some(tag => tag.toLowerCase().includes(normalizedTerm));
    const matchesDifficulty = !filter.difficulty || filter.difficulty === 'todas' || recipe.difficulty === filter.difficulty;
    const matchesTime = !filter.maxTime || recipe.timeMinutes <= filter.maxTime;
    const matchesMood = !filter.mood || filter.mood === 'todas' || recipe.mood === filter.mood;
    return matchesTerm && matchesDifficulty && matchesTime && matchesMood;
  }
}


