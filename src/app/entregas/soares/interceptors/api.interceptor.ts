/**
 * API INTERCEPTOR - Añade headers automáticamente
 * Ubicación: src/app/entregas/soares/interceptors/api.interceptor.ts
 * asi no tengo que añadir manualmente la API Key en cada servicio y tengo un control centralizado
 *  de los errores de la API para facilitar el encontrarlos facilmente.
 */

import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable()
export class ApiInterceptor {
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
      
      // Cuando hago una petición HTTP, este método intercepta la petición antes de que salga.
      // Si la URL contiene 'balldontlie.io', significa que voy a pedir datos a la API externa de baloncesto.
      // En ese caso, clono la petición y le añado el header 'Authorization' con mi API Key automáticamente.
      // Así no tengo que poner la API Key manualmente en cada servicio.
      // Después, envío la petición modificada y:
      // - Si falla, reviso el tipo de error y muestro un mensaje claro en consola (por ejemplo, API Key inválida, límite de peticiones, recurso no encontrado, error del servidor).
      // - Reintento la petición una vez si falla (retry).
      // Si no es una petición a balldontlie.io, dejo pasar la petición tal cual.
    // Solo para requests a BallDontLie API
    if (req.url.includes('balldontlie.io')) {
      const modifiedReq = req.clone({
        setHeaders: {
          'Authorization': environment.apiKey
        }
      });
      return next.handle(modifiedReq).pipe(
        retry(1),
        catchError((error: HttpErrorResponse) => {
          let errorMessage = 'Error desconocido';
          switch (error.status) {
            case 401:
              errorMessage = 'API Key inválida';
              break;
            case 429:
              errorMessage = 'Límite de rate excedido';
              break;
            case 404:
              errorMessage = 'Recurso no encontrado';
              break;
            case 500:
              errorMessage = 'Error del servidor';
              break;
          }
          console.error('Error API:', errorMessage);
          return throwError(() => new Error(errorMessage));
        })
      );
    }
    return next.handle(req);
  }
}
