import { Component, inject } from '@angular/core';
import { FavoritosService } from '../../services/favoritos.service';
import { Dino } from '../../model/dinoInterface';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

/**
 * Componente para visualizar y gestionar dinosaurios favoritos.
 * Muestra la lista de favoritos guardados en LocalStorage.
 * Permite eliminar favoritos y navegar a sus detalles.
 * Componente enrutado accesible desde /calinescu/favoritos
 */
@Component({
  selector: 'app-favoritos',
  imports: [RouterLink, MatButtonModule, MatIconModule, MatCardModule],
  templateUrl: './favoritos.html',
  styleUrl: './favoritos.css'
})
export class Favoritos {
  /** Servicio de favoritos inyectado */
  favoritosService = inject(FavoritosService);
  
  /** Lista de dinosaurios favoritos */
  favoritos: Dino[] = [];

  /**
   * Hook del ciclo de vida que se ejecuta al inicializar el componente.
   * Carga los favoritos desde el servicio.
   */
  ngOnInit() {
    this.cargarFavoritos();
  }

  /**
   * Hook que se ejecuta en cada ciclo de detección de cambios.
   * Recarga los favoritos para mantenerlos actualizados en tiempo real.
   */
  ngDoCheck() {
    // Recargar favoritos en cada ciclo de detección
    // Esto asegura que siempre estén sincronizados con el servicio
    const favoritosActuales = this.favoritosService.getFavoritos();
    if (JSON.stringify(this.favoritos) !== JSON.stringify(favoritosActuales)) {
      this.favoritos = favoritosActuales;
    }
  }

  /**
   * Carga la lista actualizada de favoritos desde el servicio.
   * @example
   * this.cargarFavoritos();
   */
  cargarFavoritos() {
    this.favoritos = this.favoritosService.getFavoritos();
  }

  /**
   * Elimina un dinosaurio de la lista de favoritos.
   * @param nombreDino - Nombre del dinosaurio a eliminar
   * @example
   * this.eliminarFavorito('Tyrannosaurus');
   */
  eliminarFavorito(nombreDino: string) {
    const eliminado = this.favoritosService.removeFavorito(nombreDino);
    if (eliminado) {
      this.cargarFavoritos(); // Recargar lista actualizada
      console.log('🗑️ Favorito eliminado:', nombreDino);
    }
  }

  /**
   * Elimina todos los favoritos directamente sin confirmación.
   * @example
   * this.limpiarTodos();
   */
  limpiarTodos() {
    this.favoritosService.limpiarFavoritos();
    this.cargarFavoritos();
  }
}
