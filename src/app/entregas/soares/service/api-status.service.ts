/**
 * API STATUS SERVICE - Monitorear estado de la API
 * Ubicación: src/app/entregas/soares/service/api-status.service.ts
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../environments/environment';

export interface ApiStatus {
  available: boolean;
  lastChecked: Date;
  responseTime?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ApiStatusService {
  
    // aqui se encarga de comprobar si la API externa está disponible.
    // Cuando se crea este servicio, hago una petición a la API y guardo si está funcionando o no.
    // Uso un BehaviorSubject para guardar el estado (disponible/no disponible, fecha de última comprobación y tiempo de respuesta).
    // Si la API responde bien, marco que está disponible y guardo el tiempo que tardó en responder.
    // Si falla, marco que no está disponible.
    // Puedes ver el estado de la API en cualquier momento usando getApiStatus().
    // Si quieres forzar una comprobación manual, puedes llamar a forceCheck().
  private apiStatus$ = new BehaviorSubject<ApiStatus>({
    available: true,
    lastChecked: new Date()
  });

  constructor(private http: HttpClient) {
    this.checkApiStatus();
  }

  private checkApiStatus(): void {
    const startTime = Date.now();
    const url = `${environment.apiUrl}/teams`;
    this.http.get(url, {
      headers: { 'Authorization': environment.apiKey }
    }).pipe(
      map(() => ({
        available: true,
        lastChecked: new Date(),
        responseTime: Date.now() - startTime
      })),
      catchError(() => [{
        available: false,
        lastChecked: new Date()
      }])
    ).subscribe(status => {
      this.apiStatus$.next(status);
      console.log(status.available ? 'API disponible' : 'API no disponible');
    });
  }

  getApiStatus(): Observable<ApiStatus> {
    return this.apiStatus$.asObservable();
  }

  forceCheck(): void {
    this.checkApiStatus();
  }
}
