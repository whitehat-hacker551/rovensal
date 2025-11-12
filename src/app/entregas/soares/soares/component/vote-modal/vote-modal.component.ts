/**
 * COMPONENTE VOTE MODAL - VENTANA EMERGENTE DE CONFIRMACIÓN DE VOTO
 * 
 * Este componente es como un "cuadro de diálogo" que aparece cuando
 * alguien quiere votar por un jugador en el ranking. Pide confirmación
 * antes de registrar el voto, evitando votos accidentales.
 * 
 * Funciones principales:
 * - Mostrar información del jugador seleccionado
 * - Pedir confirmación antes de votar
 * - Permitir cancelar la operación
 * - Comunicarse con el componente padre (Ranking)
 */

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerVote } from '../../model';

@Component({
  selector: 'app-vote-modal',   // Nombre para usar en HTML: <app-vote-modal>
  standalone: true,             // Componente independiente
  imports: [CommonModule],      // Solo necesita funcionalidades básicas
  templateUrl: './vote-modal.component.html', // Su archivo HTML
  styleUrls: ['./vote-modal.component.css']   // Su archivo de estilos
})
export class VoteModalComponent {
  // PROPIEDADES DE ENTRADA (lo que recibe del componente padre)
  @Input() player: PlayerVote | null = null; // ¿Por qué jugador vamos a votar?
  @Input() show = false;                      // ¿Debe mostrarse el modal?

  // EVENTOS DE SALIDA (lo que comunica al componente padre)
  @Output() voteConfirmed = new EventEmitter<number>();  // "¡Confirmó el voto!"
  @Output() modalClosed = new EventEmitter<void>();      // "¡Canceló o cerró el modal!"

  // CONFIRMAR EL VOTO
  // Cuando el usuario hace clic en "Sí, votar"
  confirmVote() {
    if (this.player) {
      this.voteConfirmed.emit(this.player.id); // Envía el ID del jugador al padre
    }
  }

  // CERRAR EL MODAL
  // Cuando el usuario hace clic en "Cancelar" o "X"
  closeModal() {
    this.modalClosed.emit(); // Avisa al padre que cierre el modal
  }

  // CERRAR AL HACER CLIC EN EL FONDO
  // Si hace clic fuera del modal, se cierra automáticamente
  onBackdropClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }
}