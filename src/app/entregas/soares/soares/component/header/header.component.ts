/**
 * COMPONENTE HEADER - LA BARRA DE NAVEGACIÓN SUPERIOR
 * 
 * Este componente es como el "menú principal" de un restaurante.
 * Siempre está visible en la parte superior y nos permite navegar
 * por todas las secciones de nuestra web NBA.
 * 
 * Funciones principales:
 * - Mostrar el logo y título de la web
 * - Mostrar los enlaces de navegación (Inicio, Equipos, etc.)
 * - Manejar el menú hamburguesa en móviles
 * - Permitir navegar entre páginas
 */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-header',     // Nombre para usar en HTML: <app-header>
  standalone: true,           // Componente independiente
  imports: [CommonModule, RouterModule], // Necesita estas librerías para funcionar
  templateUrl: './header.component.html', // Su archivo HTML
  styleUrls: ['./header.component.css']   // Su archivo de estilos
})
export class HeaderComponent {
  // Variable que controla si el menú móvil está abierto o cerrado
  menuOpen = false;

  constructor(private router: Router) {
    // Router nos ayuda a navegar entre páginas
  }

  // Se ejecuta cuando el componente se carga por primera vez
  ngOnInit(): void {
    console.log('Header component initialized');
  }

  // Abrir/cerrar el menú hamburguesa en móviles
  toggleMenu(): void {
    this.menuOpen = !this.menuOpen; // Cambia de true a false y viceversa
  }

  // Cerrar el menú (usado cuando se hace clic en un enlace)
  closeMenu(): void {
    this.menuOpen = false;
  }
}
