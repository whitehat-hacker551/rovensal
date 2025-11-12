export type MealMood = 'dulce' | 'salado' | 'exprés';
export type RecipeDifficulty = 'fácil' | 'media' | 'retadora';
export type DietaryTag = 'vegano' | 'vegetariano' | 'sin gluten' | 'sin lactosa' | 'sin alcohol';

export interface RecipeIngredient {
  name: string;
  quantity: number;
  unit: string;
  optional?: boolean;
}

export interface Recipe {
  id: number;
  title: string;
  description: string;
  mood: MealMood;
  difficulty: RecipeDifficulty;
  timeMinutes: number;
  servings: number;
  costPerServing: number;
  calories: number;
  tags: DietaryTag[];
  image: string;
  ingredients: RecipeIngredient[];
  steps: string[];
  isFavorite: boolean;
  author: string;
  lastCooked: string;
}
