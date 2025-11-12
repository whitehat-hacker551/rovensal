/**
 * COMPONENTE GAMES - PÁGINA DE PARTIDOS NBA
 * 
 * Este componente es como un "calendario deportivo" o "cartelera de cine"
 * pero para partidos de baloncesto. Muestra cuándo y dónde juega cada equipo.
 * 
 * Funciones principales:
 * - Mostrar calendario de partidos (pasados y futuros)
 * - Filtrar partidos por fecha o estado (jugado/por jugar)
 * - Mostrar resultados de partidos terminados
 * - Mostrar horarios de partidos próximos
 * - Interfaz fácil de usar para encontrar información rápido
 */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NbaDataService } from '../../service/nba-data.service';
import { Game } from '../../model';

// Definición simplificada de cómo se ve cada partido
interface SimpleGame {
  id: number;           // Número único del partido
  homeTeam: string;     // Equipo que juega en casa
  awayTeam: string;     // Equipo visitante
  date: string;         // Fecha del partido
  time: string;         // Hora del partido
  status: string;       // Estado: "Terminado", "En vivo", "Próximo"
  homeScore?: number;   // Puntos del equipo local (si ya jugó)
  awayScore?: number;   // Puntos del equipo visitante (si ya jugó)
}

@Component({
  selector: 'app-games',        // Nombre para usar en HTML: <app-games>
  standalone: true,             // Componente independiente
  imports: [CommonModule, FormsModule], // Necesita formularios para filtros
  templateUrl: './games.component.html', // Usa el archivo HTML externo
  styleUrls: ['./games.component.css'], // Usa el archivo CSS externo
})
export class GamesComponent {
  // PROPIEDADES PARA LA VISTA (necesarias para el HTML)
  games: any[] = [];                    // Lista de juegos desde la API
  teams: any[] = [];                    // Lista de equipos disponibles
  viewMode: string = 'today';           // Modo de vista actual
  selectedDate: string = '';            // Fecha seleccionada
  selectedSeason: string = '2025REG';   // Temporada seleccionada
  selectedTeamKey: string | null = null; // Equipo seleccionado para filtrar
  loading: boolean = false;             // Estado de carga
  error: string = '';                   // Mensaje de error

  // INYECCIÓN DEL SERVICIO DE DATOS
  constructor(private nbaDataService: NbaDataService) {
    // Configurar fecha actual por defecto
    const today = new Date();
    this.selectedDate = today.toISOString().split('T')[0];
  }

  // INICIALIZACIÓN DEL COMPONENTE
  ngOnInit(): void {
    this.loadTeams();        // Cargar lista de equipos
    this.loadTodayGames();   // Cargar juegos de hoy por defecto
  }

  // CARGAR JUEGOS DE HOY
  loadTodayGames(): void {
    this.viewMode = 'today';
    this.loading = true;
    this.error = '';

    // Simular carga de juegos de hoy
    this.nbaDataService.getGames({}).subscribe({
      next: (data: any) => {
        this.games = this.createMockGamesForToday();
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Error al cargar los juegos de hoy';
        this.loading = false;
        console.error('Error:', err);
      }
    });
  }

  // CARGAR PRÓXIMOS 7 DÍAS
  loadUpcomingGames(): void {
    this.viewMode = 'upcoming';
    this.loading = true;
    this.error = '';

    this.nbaDataService.getGames({}).subscribe({
      next: (data: any) => {
        this.games = this.createMockUpcomingGames();
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Error al cargar los próximos juegos';
        this.loading = false;
      }
    });
  }

  // CARGAR JUEGOS POR TEMPORADA
  loadGamesBySeason(): void {
    this.viewMode = 'season';
    this.loading = true;
    this.error = '';

    this.nbaDataService.getGames({}).subscribe({
      next: (data: any) => {
        this.games = this.createMockSeasonGames();
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Error al cargar los juegos de la temporada';
        this.loading = false;
      }
    });
  }

  // CARGAR EQUIPOS
  loadTeams(): void {
    this.nbaDataService.getTeams().subscribe({
      next: (teams: any) => {
        this.teams = teams.map((team: any) => ({
          Key: team.name.substring(0, 3).toUpperCase(), // Crear abreviatura del nombre
          City: team.city,
          Name: team.name
        }));
      },
      error: (err: any) => {
        console.error('Error cargando equipos:', err);
      }
    });
  }

  // EVENTOS DE CAMBIO
  onDateChange(): void {
    if (this.selectedDate) {
      this.loading = true;
      this.games = this.createMockGamesForDate(this.selectedDate);
      this.loading = false;
    }
  }

  onSeasonChange(): void {
    this.loadGamesBySeason();
  }

  onTeamChange(): void {
    // Filtrar juegos por equipo seleccionado
    if (this.selectedTeamKey) {
      this.games = this.games.filter(game => 
        game.HomeTeam === this.selectedTeamKey || 
        game.AwayTeam === this.selectedTeamKey
      );
    } else {
      // Recargar todos los juegos según el modo actual
      switch(this.viewMode) {
        case 'today': this.loadTodayGames(); break;
        case 'upcoming': this.loadUpcomingGames(); break;
        case 'season': this.loadGamesBySeason(); break;
      }
    }
  }

  // MÉTODOS HELPER PARA EL HTML
  getGameStatusClass(status: string): string {
    switch (status) {
      case 'Final': return 'badge bg-success';
      case 'InProgress': return 'badge bg-warning';
      case 'Scheduled': return 'badge bg-info';
      default: return 'badge bg-secondary';
    }
  }

  getGameStatusText(status: string): string {
    switch (status) {
      case 'Final': return 'Finalizado';
      case 'InProgress': return 'En Curso';
      case 'Scheduled': return 'Programado';
      default: return status;
    }
  }

  formatGameDate(dateTime: string): string {
    if (!dateTime) return '';
    const date = new Date(dateTime);
    return date.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  }

  formatGameTime(dateTime: string): string {
    if (!dateTime) return '';
    const date = new Date(dateTime);
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  hasScore(game: any): boolean {
    return game.HomeTeamScore !== null && game.AwayTeamScore !== null;
  }

  getTeamName(teamKey: string): string {
    const team = this.teams.find(t => t.Key === teamKey);
    return team ? `${team.City} ${team.Name}` : teamKey;
  }

  // MÉTODOS PARA CREAR DATOS MOCK
  private createMockGamesForToday(): any[] {
    const today = new Date().toISOString();
    return [
      {
        GameID: 1,
        DateTime: today,
        Status: 'Scheduled',
        HomeTeam: 'LAL',
        AwayTeam: 'GSW',
        HomeTeamScore: null,
        AwayTeamScore: null,
        Channel: 'ESPN',
        Attendance: null
      },
      {
        GameID: 2,
        DateTime: today,
        Status: 'InProgress',
        HomeTeam: 'BOS',
        AwayTeam: 'MIA',
        HomeTeamScore: 85,
        AwayTeamScore: 78,
        Channel: 'TNT',
        Attendance: 19580
      }
    ];
  }

  private createMockUpcomingGames(): any[] {
    // Crear juegos para los próximos 7 días
    const games = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const dateString = date.toISOString();
      
      games.push({
        GameID: i + 10,
        DateTime: dateString,
        Status: 'Scheduled',
        HomeTeam: i % 2 === 0 ? 'LAL' : 'BOS',
        AwayTeam: i % 2 === 0 ? 'GSW' : 'MIA',
        HomeTeamScore: null,
        AwayTeamScore: null,
        Channel: 'ESPN',
        Attendance: null
      });
    }
    return games;
  }

  private createMockSeasonGames(): any[] {
    // Crear juegos de temporada
    return [
      {
        GameID: 20,
        DateTime: '2025-01-15T20:00:00',
        Status: 'Final',
        HomeTeam: 'LAL',
        AwayTeam: 'BOS',
        HomeTeamScore: 112,
        AwayTeamScore: 108,
        Channel: 'ABC',
        Attendance: 20000
      },
      // Agregar más juegos según sea necesario...
    ];
  }

  private createMockGamesForDate(date: string): any[] {
    return [
      {
        GameID: 30,
        DateTime: `${date}T20:00:00`,
        Status: 'Scheduled',
        HomeTeam: 'LAL',
        AwayTeam: 'GSW',
        HomeTeamScore: null,
        AwayTeamScore: null,
        Channel: 'ESPN',
        Attendance: null
      }
    ];
  }
}