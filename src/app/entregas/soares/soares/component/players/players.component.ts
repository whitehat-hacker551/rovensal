/**
 * COMPONENTE PLAYERS MODAL - VENTANA EMERGENTE DE JUGADORES
 * 
 * Características importantes:
 * - NO es una página independiente (no tiene ruta propia)
 * - Es un modal (ventana emergente) que se superpone al contenido
 * - Muestra todos los jugadores de un equipo específico
 * - Se puede cerrar haciendo clic fuera o en el botón de cerrar
 * - Permite seleccionar jugadores para futuras funcionalidades
 */

import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NbaDataService } from '../../service/nba-data.service';
import { Team, Player } from '../../model';

@Component({
  selector: 'app-players-modal',  // Nombre específico para el modal
  standalone: true,               // Componente independiente
  imports: [CommonModule, FormsModule], // Necesita formularios para interacción
  templateUrl: './players.component.html',      // Su archivo HTML
  styleUrl: './players-modal.component.css'    // Estilos específicos del modal
})
export class PlayersModalComponent {
  // PROPIEDADES DE ENTRADA (lo que recibe de su componente padre)
  @Input() team!: Team;          // El equipo cuyos jugadores queremos mostrar
  @Input() show = false;         // Si el modal debe estar visible o no

  // EVENTOS DE SALIDA (lo que comunica al componente padre)
  @Output() close = new EventEmitter<void>(); // Avisa cuando se debe cerrar

  // Estados internos del modal
  loading = false;               // ¿Estamos cargando jugadores?
  error = '';                    // ¿Hubo algún error?

  constructor(private nbaDataService: NbaDataService) {
    // Servicio para manejar la selección de jugadores
  }

  // Se ejecuta cuando se inicializa el modal
  ngOnInit(): void {
    // Los jugadores ya vienen incluidos en team.players
    // No necesitamos cargar datos adicionales
  }

  // CERRAR EL MODAL
  // Comunica al componente padre que debe ocultar el modal
  closeModal(): void {
    this.close.emit();
  }

  // SELECCIONAR UN JUGADOR
  // Marca un jugador como seleccionado para futuras funcionalidades
  selectPlayer(player: Player): void {
    this.nbaDataService.selectPlayer(player);
  }

  // CERRAR AL HACER CLIC FUERA DEL MODAL
  // Si hace clic en el fondo oscuro (overlay), se cierra el modal
  onOverlayClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }
}
