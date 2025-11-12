/**
 * SERVICIO NBA ASYNC - MANEJO AVANZADO DE OPERACIONES ASÍNCRONAS
 * 
 * Este servicio demuestra las mejores prácticas para manejar operaciones
 * asíncronas en Angular usando async/await en lugar de callbacks complicados.
 * Es como tener un "asistente inteligente" que maneja todas las operaciones
 * que tardan tiempo (como cargar datos o confirmar acciones).
 * 
 * ¿Qué hace especial a este servicio?
 * - Usa async/await para código más limpio y fácil de leer
 * - Maneja errores de forma elegante con try/catch
 * - Muestra diálogos informativos al usuario
 * - Evita el "callback hell" (código muy anidado)
 * - Ejecuta operaciones en paralelo para mejor rendimiento
 */
import { Injectable } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';
import { NbaDataService } from './nba-data.service';
import { DialogService } from './dialog.service';
import { Player, Team } from '../model/nba-data.model';

@Injectable({
  providedIn: 'root'  // Disponible en toda la aplicación
})
export class NbaAsyncService {

  // INYECCIÓN DE DEPENDENCIAS
  // Como tener dos "asistentes": uno para datos NBA y otro para diálogos
  constructor(
    private nbaDataService: NbaDataService,  // Para obtener datos de jugadores/equipos
    private dialogService: DialogService     // Para mostrar mensajes al usuario
  ) {}

  /**
   * OBTENER MEJORES JUGADORES DE FORMA ASÍNCRONA
   * En lugar de usar callbacks complicados, usa async/await
   * para hacer el código más fácil de leer y mantener
   */
  async getTopPlayersAsync(): Promise<Player[]> {
    try {
      // Obtiene los 10 mejores jugadores por puntos
      const players$ = this.nbaDataService.getTopPlayersByPoints(10);
      const players = await firstValueFrom(players$); // Espera a que lleguen los datos
      return players;
    } catch (error) {
      // Si algo sale mal, muestra un mensaje amigable
      await this.dialogService.error(
        'Error de carga',
        'No se pudieron cargar los jugadores. Inténtalo de nuevo.'
      );
      throw error; // Re-lanza el error para que el componente lo sepa
    }
  }

  /**
   * SELECCIONAR JUGADOR CON CONFIRMACIÓN
   * Pide confirmación antes de hacer una acción importante
   * Usa diálogos profesionales en lugar de alert() básicos
   */
  async selectPlayerWithConfirmation(player: Player): Promise<boolean> {
    // Pide confirmación al usuario
    const confirmed = await this.dialogService.confirm({
      title: 'Confirmar selección',
      message: `¿Estás seguro de que quieres seleccionar a ${player.name} de ${player.team}?`,
      confirmText: 'Sí, seleccionar',
      cancelText: 'Cancelar',
      type: 'info'
    });

    if (confirmed) {
      // Si confirma, selecciona el jugador y muestra éxito
      this.nbaDataService.selectPlayer(player);
      await this.dialogService.success(
        'Jugador seleccionado',
        `${player.name} ha sido seleccionado correctamente.`
      );
      return true;
    }
    
    return false; // Si cancela, no hace nada
  }

  /**
   * CARGA MÚLTIPLES DATOS EN PARALELO
   * En lugar de esperar uno por uno (lento), carga todo al mismo tiempo
   * Como pedir tres platos en un restaurante al mismo tiempo
   */
  async loadAllDataParallel(): Promise<{
    teams: Team[];
    players: Player[];
    topPlayers: Player[];
  }> {
    try {
      // Promise.all ejecuta todas las peticiones al mismo tiempo
      const [teams, players, topPlayers] = await Promise.all([
        firstValueFrom(this.nbaDataService.getTeams()),           // Equipos
        firstValueFrom(this.nbaDataService.getTopPlayersByPoints()), // Mejores anotadores
        firstValueFrom(this.nbaDataService.getTopPlayersByAssists()) // Mejores asistentes
      ]);

      return { teams, players, topPlayers };
    } catch (error) {
      await this.dialogService.error(
        'Error de carga',
        'No se pudieron cargar todos los datos. Revisa tu conexión.'
      );
      throw error;
    }
  }

  /**
   * BUSCAR JUGADORES POR EQUIPO CON VALIDACIÓN
   * Incluye validación de datos y manejo elegante de errores
   * Siempre informa al usuario qué está pasando
   */
  async getPlayersByTeamAsync(teamId: number): Promise<Player[]> {
    // VALIDACIÓN: ¿El ID del equipo es válido?
    if (!teamId || teamId <= 0) {
      await this.dialogService.error(
        'Error de validación',
        'El ID del equipo debe ser válido.'
      );
      return []; // Retorna lista vacía si no es válido
    }

    try {
      const players$ = this.nbaDataService.getPlayersByTeam(teamId);
      const players = await firstValueFrom(players$);
      
      // Si no encuentra jugadores, informa al usuario
      if (players.length === 0) {
        await this.dialogService.info(
          'Sin resultados',
          'No se encontraron jugadores para este equipo.'
        );
      }
      
      return players;
    } catch (error) {
      await this.dialogService.error(
        'Error de búsqueda',
        'No se pudieron cargar los jugadores del equipo.'
      );
      return [];
    }
  }

  /**
   * PROCESAR VOTOS CON VALIDACIÓN Y CONFIRMACIÓN
   * Sistema completo de votación con todas las verificaciones necesarias
   * Tipado fuerte para evitar errores de programación
   */
  async processPlayerVote(playerId: number, playerName: string): Promise<boolean> {
    // VALIDACIÓN: ¿Tenemos todos los datos necesarios?
    if (!playerId || !playerName) {
      await this.dialogService.error(
        'Datos incompletos',
        'Faltan datos del jugador para procesar el voto.'
      );
      return false;
    }

    // CONFIRMACIÓN: ¿Realmente quiere votar?
    const confirmed = await this.dialogService.confirm({
      title: 'Confirmar voto',
      message: `¿Quieres votar por ${playerName}?`,
      confirmText: 'Votar',
      cancelText: 'Cancelar',
      type: 'warning'
    });

    if (!confirmed) {
      return false; // Si no confirma, no hace nada
    }

    try {
      // PROCESAMIENTO: Simula el registro del voto
      await this.simulateVoteProcessing(); // Espera a que se procese
      
      // ÉXITO: Informa que todo salió bien
      await this.dialogService.success(
        '¡Voto registrado!',
        `Tu voto por ${playerName} ha sido registrado correctamente.`
      );
      
      return true;
    } catch (error) {
      // ERROR: Si algo falla, informa el problema
      await this.dialogService.error(
        'Error al votar',
        'No se pudo registrar tu voto. Inténtalo de nuevo.'
      );
      return false;
    }
  }

  /**
   * SIMULADOR DE PROCESAMIENTO ASÍNCRONO
   * Simula una operación que tarda tiempo (como enviar datos a un servidor)
   * En una aplicación real, aquí estaría la llamada a la API
   */
  private async simulateVoteProcessing(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, 1500); // Espera 1.5 segundos para simular procesamiento
    });
  }
}