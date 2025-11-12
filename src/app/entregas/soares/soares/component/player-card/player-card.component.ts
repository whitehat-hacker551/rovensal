/**
 * COMPONENTE PLAYER CARD - TARJETA DE JUGADOR PARA VOTACIÓN
 * 
 * Es una tarjeta simple pero elegante que se usa en el sistema de votación.
 * 
 * Funciones principales:
 * - Mostrar información básica del jugador
 * - Permitir votar con un solo clic
 * - Diseño responsive y atractivo
 * - Comunicación con el componente padre (Ranking)
 */

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerVote } from '../../model';

@Component({
  selector: 'app-player-card',   // Nombre para usar: <app-player-card>
  standalone: true,              // Componente independiente
  imports: [CommonModule],       // Solo funcionalidades básicas
  templateUrl: './player-card.component.html', // Su archivo HTML
  styleUrls: ['./player-card.component.css']   // Sus estilos CSS
})
export class PlayerCardComponent {
  
  // PROPIEDADES DE ENTRADA (lo que recibe del componente padre)
  @Input() player!: PlayerVote;  // Datos del jugador para votación (obligatorio!)
  
  // EVENTOS DE SALIDA (lo que comunica al componente padre)
  @Output() voted = new EventEmitter<number>(); // "¡Se votó por este jugador!"

  // FUNCIÓN PRINCIPAL: VOTAR POR EL JUGADOR
  // Cuando el usuario hace clic en el botón "Votar"
  vote() {
    this.voted.emit(this.player.id); // Envía el ID del jugador al componente padre
  }
}