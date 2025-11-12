import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';

interface MealDbResponse {
  meals: Array<{
    idMeal: string;
    strMeal: string;
    strMealThumb: string;
    strArea: string;
    strCategory: string;
    strInstructions: string;
  }> | null;
}

export interface InspirationRecipe {
  id: string;
  title: string;
  area: string;
  category: string;
  image: string;
  instructions: string;
}

@Injectable({
  providedIn: 'root'
})
export class AlfonsoInspirationService {
  private readonly endpoint = 'https://www.themealdb.com/api/json/v1/1/search.php?s=salad';

  constructor(private readonly http: HttpClient) {}

  getInspirations(limit = 4): Observable<InspirationRecipe[]> {
    return this.http.get<MealDbResponse>(this.endpoint).pipe(
      map(response => (response.meals ?? []).slice(0, limit).map(meal => ({
        id: meal.idMeal,
        title: meal.strMeal,
        area: meal.strArea,
        category: meal.strCategory,
        image: meal.strMealThumb,
        instructions: meal.strInstructions.split('.').slice(0, 3).join('. ') + '.'
      }))),
      catchError(() =>
        of([
          {
            id: 'fallback',
            title: 'Gazpacho de remolacha asada',
            area: 'Laboratorio interno',
            category: 'Cold Soup',
            image: '/alfonso/panna-cotta.svg',
            instructions: 'Licuar verduras asadas. Ajustar acidez con vinagre de Jerez. Servir muy frío con aceite verde.'
          }
        ])
      )
    );
  }
}
