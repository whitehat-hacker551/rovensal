/**
 * COMPONENTE VOTE SIMPLE - SISTEMA DE VOTACIÓN AVANZADO CON ASYNC/AWAIT
 * 
 * 
 * Es como un "sistema de votación real" que podrías ver en el sitio oficial de la NBA
 */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogService } from '../../service/dialog.service';
import { NbaAsyncService } from '../../service/nba-async.service';

// INTERFAZ TIPADA FUERTE - EVITA ERRORES DE PROGRAMACIÓN
interface SimplePlayer {
  id: number;        // Identificador único del jugador
  name: string;      // Nombre completo del jugador
  team: string;      // Equipo al que pertenece
  votes: number;     // Número de votos recibidos
}

@Component({
  selector: 'app-vote-simple',    // Nombre del componente
  standalone: true,               // Componente independiente
  imports: [CommonModule],        // Solo funcionalidades básicas
  template: `
    <div class="container my-4">
      <div class="row">
        <div class="col-12">
          <div class="card shadow-sm">
            
            <!-- ENCABEZADO DE LA VOTACIÓN -->
            <div class="card-header bg-warning text-dark">
              <h3 class="mb-0">
                <i class="fas fa-vote-yea me-2"></i>
                Votación NBA All-Star
              </h3>
              <p class="mb-0 small">¡Vota por tu jugador favorito!</p>
            </div>
            
            <div class="card-body">
              
              <!-- ESTADO DE CARGA -->
              @if (loading) {
                <div class="text-center py-4">
                  <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Cargando...</span>
                  </div>
                  <p class="mt-2 text-muted">Cargando jugadores...</p>
                </div>
              } @else {
                
                <!-- ESTADÍSTICAS GENERALES -->
                <div class="row mb-4">
                  <div class="col-12">
                    <div class="alert alert-info">
                      <i class="fas fa-info-circle me-2"></i>
                      Total de votos: <strong>{{ totalVotes }}</strong>
                      <span class="ms-3">
                        <i class="fas fa-users me-1"></i>
                        {{ players.length }} jugadores
                      </span>
                    </div>
                  </div>
                </div>

                <!-- LISTA DE JUGADORES PARA VOTAR -->
                <div class="row">
                  @for (player of sortedPlayers; track player.id; let i = $index) {
                    <div class="col-md-6 col-lg-4 mb-3">
                      <div class="card h-100 border-0 shadow-sm">
                        <div class="card-body text-center">
                          
                          <!-- POSICIÓN EN EL RANKING -->
                          <div class="position-relative mb-3">
                            <span class="badge position-absolute top-0 start-0"
                                  [class]="getBadgeClass(i)">
                              #{{ i + 1 }}
                            </span>
                            <h5 class="card-title mb-1">{{ player.name }}</h5>
                            <p class="text-muted small">{{ player.team }}</p>
                          </div>
                          
                          <!-- CONTADOR DE VOTOS -->
                          <div class="mb-3">
                            <div class="vote-count">
                              <span class="fs-4 fw-bold text-primary">{{ player.votes }}</span>
                              <span class="text-muted small d-block">votos</span>
                            </div>
                            
                            <!-- BARRA DE PROGRESO VISUAL -->
                            <div class="progress mt-2" style="height: 8px;">
                              <div class="progress-bar" 
                                   [style.width.%]="getVotePercentage(player.votes)"
                                   [class]="getProgressClass(i)">
                              </div>
                            </div>
                            
                            <!-- PORCENTAJE DE VOTOS -->
                            <small class="text-muted">
                              {{ getVotePercentage(player.votes) }}%
                            </small>
                          </div>
                          
                          <!-- BOTÓN DE VOTACIÓN CON ASYNC/AWAIT -->
                          <button class="btn btn-primary btn-sm" 
                                  [disabled]="votingInProgress"
                                  (click)="voteForPlayerAsync(player)">
                            @if (votingInProgress && selectedPlayerId === player.id) {
                              <span class="spinner-border spinner-border-sm me-1" role="status"></span>
                              Votando...
                            } @else {
                              <i class="fas fa-thumbs-up me-1"></i>
                              Votar
                            }
                          </button>
                        </div>
                      </div>
                    </div>
                  } @empty {
                    <!-- MENSAJE CUANDO NO HAY JUGADORES -->
                    <div class="col-12 text-center py-4">
                      <i class="fas fa-users fa-3x text-muted mb-3"></i>
                      <p class="text-muted">No hay jugadores disponibles</p>
                    </div>
                  }
                </div>
                
                <!-- BOTONES DE ACCIÓN -->
                <div class="row mt-4">
                  <div class="col-12 text-center">
                    <button class="btn btn-outline-secondary me-2" 
                            [disabled]="loading"
                            (click)="resetVotesAsync()">
                      <i class="fas fa-redo me-1"></i>
                      Reiniciar Votación
                    </button>
                    <button class="btn btn-outline-primary" 
                            [disabled]="loading"
                            (click)="reloadPlayersAsync()">
                      <i class="fas fa-sync me-1"></i>
                      Recargar
                    </button>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* EFECTOS VISUALES PARA MEJOR EXPERIENCIA */
    .card {
      transition: transform 0.2s ease-in-out;
    }
    
    .card:hover {
      transform: translateY(-2px);
    }
    
    .vote-count {
      padding: 10px;
      background: #f8f9fa;
      border-radius: 8px;
    }
    
    .progress {
      background-color: #e9ecef;
    }
    
    .btn {
      transition: all 0.2s ease-in-out;
    }
    
    .btn:hover {
      transform: translateY(-1px);
    }
  `]
})
export class VoteSimpleComponent implements OnInit {
  
  // PROPIEDADES DEL COMPONENTE (tipado fuerte, no "any")
  players: SimplePlayer[] = [];        // Lista de jugadores para votar
  loading = false;                     // ¿Está cargando datos?
  votingInProgress = false;            // ¿Hay un voto en proceso?
  selectedPlayerId: number | null = null; // ¿Qué jugador se está votando?

  // INYECCIÓN DE SERVICIOS (como "asistentes" del componente)
  constructor(
    private dialogService: DialogService,    // Para mostrar mensajes elegantes
    private nbaAsyncService: NbaAsyncService // Para operaciones asíncronas
  ) {}

  // INICIALIZACIÓN ASÍNCRONA DEL COMPONENTE
  async ngOnInit(): Promise<void> {
    await this.loadPlayersAsync(); // Carga los jugadores cuando se inicia
  }

  // GETTER: TOTAL DE VOTOS (concepto básico de programación)
  get totalVotes(): number {
    return this.players.reduce((total, player) => total + player.votes, 0);
  }

  // GETTER: JUGADORES ORDENADOS POR VOTOS (concepto básico)
  get sortedPlayers(): SimplePlayer[] {
    return [...this.players].sort((a, b) => b.votes - a.votes);
  }

  // MÉTODO PRINCIPAL: VOTAR POR UN JUGADOR (async/await)
  async voteForPlayerAsync(player: SimplePlayer): Promise<void> {
    // VALIDACIÓN: ¿Ya hay un voto en proceso?
    if (this.votingInProgress) return;

    // INICIA EL PROCESO DE VOTACIÓN
    this.votingInProgress = true;
    this.selectedPlayerId = player.id;

    try {
      // CONFIRMACIÓN: ¿Realmente quiere votar? (NO usa alert())
      const confirmed = await this.dialogService.confirm({
        title: 'Confirmar voto',
        message: `¿Estás seguro de que quieres votar por ${player.name} de ${player.team}?`,
        confirmText: 'Sí, votar',
        cancelText: 'Cancelar',
        type: 'info'
      });

      if (confirmed) {
        // PROCESAMIENTO: Usa servicio async en lugar de callbacks
        const success = await this.nbaAsyncService.processPlayerVote(player.id, player.name);
        
        if (success) {
          // ACTUALIZACIÓN: Incrementa el contador local
          player.votes++;
          
          // ÉXITO: Muestra mensaje de confirmación (NO alert())
          await this.dialogService.success(
            '¡Voto registrado!',
            `Tu voto por ${player.name} ha sido registrado correctamente.`
          );
        }
      }
    } catch (error) {
      // MANEJO DE ERRORES: Siempre informa al usuario
      console.error('Error al votar:', error);
      await this.dialogService.error(
        'Error al votar',
        'No se pudo registrar tu voto. Inténtalo de nuevo.'
      );
    } finally {
      // LIMPIEZA: Siempre termina el estado de votación
      this.votingInProgress = false;
      this.selectedPlayerId = null;
    }
  }

  // REINICIAR TODOS LOS VOTOS (con confirmación)
  async resetVotesAsync(): Promise<void> {
    const confirmed = await this.dialogService.confirm({
      title: 'Reiniciar votación',
      message: '¿Estás seguro de que quieres reiniciar todos los votos? Esta acción no se puede deshacer.',
      confirmText: 'Sí, reiniciar',
      cancelText: 'Cancelar',
      type: 'warning'
    });

    if (confirmed) {
      // Simula operación asíncrona
      this.loading = true;
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Resetea todos los votos a cero
      this.players.forEach(player => player.votes = 0);
      this.loading = false;
      
      await this.dialogService.success(
        'Votación reiniciada',
        'Todos los votos han sido reiniciados correctamente.'
      );
    }
  }

  // RECARGAR LISTA DE JUGADORES
  async reloadPlayersAsync(): Promise<void> {
    const confirmed = await this.dialogService.confirm({
      title: 'Recargar jugadores',
      message: '¿Quieres recargar la lista de jugadores? Los votos actuales se mantendrán.',
      confirmText: 'Recargar',
      cancelText: 'Cancelar',
      type: 'info'
    });

    if (confirmed) {
      await this.loadPlayersAsync();
      await this.dialogService.info(
        'Lista actualizada',
        'La lista de jugadores ha sido recargada.'
      );
    }
  }

  // CÁLCULO DE PORCENTAJE (matemática básica)
  getVotePercentage(votes: number): number {
    if (this.totalVotes === 0) return 0;
    return Math.round((votes / this.totalVotes) * 100);
  }

  // CLASES CSS DINÁMICAS SEGÚN POSICIÓN
  getBadgeClass(position: number): string {
    switch(position) {
      case 0: return 'bg-warning';      // Oro para el primero
      case 1: return 'bg-secondary';    // Plata para el segundo
      case 2: return 'bg-dark';         // Bronce para el tercero
      default: return 'bg-light text-dark'; // Normal para el resto
    }
  }

  getProgressClass(position: number): string {
    switch(position) {
      case 0: return 'bg-warning';      // Oro
      case 1: return 'bg-secondary';    // Plata
      case 2: return 'bg-dark';         // Bronce
      default: return 'bg-primary';     // Azul normal
    }
  }

  // CARGA ASÍNCRONA DE JUGADORES (privado)
  private async loadPlayersAsync(): Promise<void> {
    this.loading = true;
    
    try {
      // Simula carga desde una API (en la vida real sería una petición HTTP)
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mantiene votos existentes si es una recarga
      const currentVotes = new Map(this.players.map(p => [p.id, p.votes]));
      
      // Lista de jugadores estrella de la NBA (datos ficticios)
      this.players = [
        { id: 1, name: 'LeBron James', team: 'Lakers', votes: currentVotes.get(1) || 0 },
        { id: 2, name: 'Stephen Curry', team: 'Warriors', votes: currentVotes.get(2) || 0 },
        { id: 3, name: 'Jayson Tatum', team: 'Celtics', votes: currentVotes.get(3) || 0 },
        { id: 4, name: 'Luka Dončić', team: 'Mavericks', votes: currentVotes.get(4) || 0 },
        { id: 5, name: 'Giannis Antetokounmpo', team: 'Bucks', votes: currentVotes.get(5) || 0 },
        { id: 6, name: 'Nikola Jokić', team: 'Nuggets', votes: currentVotes.get(6) || 0 }
      ];
    } catch (error) {
      // Si hay error al cargar, informa al usuario
      console.error('Error cargando jugadores:', error);
      await this.dialogService.error(
        'Error de carga',
        'No se pudieron cargar los jugadores. Inténtalo de nuevo.'
      );
    } finally {
      // Siempre termina el estado de carga
      this.loading = false;
    }
  }
}