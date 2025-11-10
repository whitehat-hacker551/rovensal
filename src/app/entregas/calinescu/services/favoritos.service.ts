import { Injectable } from '@angular/core';
import { Dino } from '../model/dinoInterface';

/**
 * Servicio singleton para gestionar dinosaurios favoritos.
 * Utiliza LocalStorage para persistir los favoritos entre sesiones.
 * Proporciona métodos para añadir, eliminar, verificar y obtener favoritos.
 */
@Injectable({
  providedIn: 'root'
})
export class FavoritosService {
  /** Clave usada para almacenar favoritos en LocalStorage */
  private readonly STORAGE_KEY = 'dinoFavoritos';
  
  /** Cache en memoria de los favoritos actuales */
  private favoritos: Dino[] = [];

  constructor() {
    this.cargarFavoritos();
  }

  /**
   * Carga los favoritos desde LocalStorage al iniciar el servicio.
   * Si no hay datos guardados, inicializa un array vacío.
   * @private
   */
  private cargarFavoritos(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        this.favoritos = JSON.parse(stored);
      } catch (error) {
        console.error('Error al cargar favoritos:', error);
        this.favoritos = [];
      }
    }
  }

  /**
   * Guarda los favoritos actuales en LocalStorage.
   * @private
   */
  private guardarFavoritos(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.favoritos));
  }

  /**
   * Obtiene todos los dinosaurios favoritos.
   * @returns Array de dinosaurios favoritos
   * @example
   * const misFavoritos = favoritosService.getFavoritos();
   */
  getFavoritos(): Dino[] {
    return [...this.favoritos]; // Retorna copia para evitar mutaciones
  }

  /**
   * Añade un dinosaurio a favoritos si no existe ya.
   * @param dino - Dinosaurio a añadir a favoritos
   * @returns true si se añadió correctamente, false si ya existía
   * @example
   * const exito = favoritosService.addFavorito(trex);
   */
  addFavorito(dino: Dino): boolean {
    // Verificar si ya existe
    if (this.esFavorito(dino.Name)) {
      return false;
    }
    
    this.favoritos.push(dino);
    this.guardarFavoritos();
    return true;
  }

  /**
   * Elimina un dinosaurio de favoritos por su nombre.
   * @param nombreDino - Nombre del dinosaurio a eliminar
   * @returns true si se eliminó correctamente, false si no existía
   * @example
   * const eliminado = favoritosService.removeFavorito('Tyrannosaurus');
   */
  removeFavorito(nombreDino: string): boolean {
    const indexInicial = this.favoritos.length;
    this.favoritos = this.favoritos.filter(d => d.Name !== nombreDino);
    
    if (this.favoritos.length < indexInicial) {
      this.guardarFavoritos();
      return true;
    }
    return false;
  }

  /**
   * Verifica si un dinosaurio está en favoritos.
   * @param nombreDino - Nombre del dinosaurio a verificar
   * @returns true si está en favoritos, false en caso contrario
   * @example
   * if (favoritosService.esFavorito('Velociraptor')) {
   *   console.log('Ya es favorito');
   * }
   */
  esFavorito(nombreDino: string): boolean {
    return this.favoritos.some(d => d.Name === nombreDino);
  }

  /**
   * Obtiene el número total de favoritos.
   * @returns Cantidad de dinosaurios en favoritos
   * @example
   * const total = favoritosService.getCantidadFavoritos();
   */
  getCantidadFavoritos(): number {
    return this.favoritos.length;
  }

  /**
   * Elimina todos los favoritos.
   * @example
   * favoritosService.limpiarFavoritos();
   */
  limpiarFavoritos(): void {
    this.favoritos = [];
    this.guardarFavoritos();
  }

  /**
   * Alterna el estado de favorito de un dinosaurio.
   * Si está en favoritos lo elimina, si no está lo añade.
   * @param dino - Dinosaurio a alternar
   * @returns true si se añadió, false si se eliminó
   * @example
   * const agregado = favoritosService.toggleFavorito(spinosaurus);
   */
  toggleFavorito(dino: Dino): boolean {
    if (this.esFavorito(dino.Name)) {
      this.removeFavorito(dino.Name);
      return false;
    } else {
      this.addFavorito(dino);
      return true;
    }
  }
}
