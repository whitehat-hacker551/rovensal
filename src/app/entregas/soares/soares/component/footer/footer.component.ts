/**
 * COMPONENTE FOOTER - PIE DE PÁGINA
 * 
 * 
 */

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',       // Nombre para usar en HTML: <app-footer>
  standalone: true,             // Componente independiente
  imports: [CommonModule, RouterModule], // Necesita navegación para enlaces
  templateUrl: './footer.component.html', // Su archivo HTML
  styleUrl: './footer.component.css'      // Su archivo de estilos
})
export class FooterComponent {
  // Se actualiza solo cada año sin tocar código
  currentYear = new Date().getFullYear();
}