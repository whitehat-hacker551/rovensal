/**
 * COMPONENTE TEAMS - PÁGINA DE EQUIPOS NBA
 * 
 */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbaDataService } from '../../service/nba-data.service';
import { DialogService } from '../../service/dialog.service';
import { Team } from '../../model/nba-data.model';
import { PlayersModalComponent } from '../players/players.component';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-teams',     // Nombre para usar en HTML: <app-teams>
  standalone: true,          // Componente independiente
  imports: [CommonModule, PlayersModalComponent], // Usa el modal de jugadores
  templateUrl: './teams.component.html',          // Su archivo HTML
  styleUrl: './teams-new.component.css'           // Su archivo de estilos
})
export class TeamsComponent {
  // Listas de equipos organizadas
  teams: Team[] = [];           // Todos los equipos
  eastTeams: Team[] = [];       // Solo equipos de la Conferencia Este
  westTeams: Team[] = [];       // Solo equipos de la Conferencia Oeste
  
  // Estados de la interfaz
  loading = true;               // ¿Estamos cargando datos?
  error = '';                   // ¿Hubo algún error?

  // Control del modal (ventana emergente) de jugadores
  showPlayersModal = false;     // ¿Está abierto el modal?
  selectedTeam: Team | null = null; // ¿Qué equipo seleccionamos?

  constructor(
    private nbaDataService: NbaDataService, // Servicio para obtener datos
    private dialogService: DialogService   // Servicio para mostrar mensajes
  ) {}

  // Se ejecuta cuando se carga la página de equipos
  ngOnInit(): void {
    this.loadTeamsAsync();
  }

  /**
   * CARGAR TODOS LOS EQUIPOS NBA
   * Obtiene la lista completa y la organiza por conferencias
   */
  async loadTeamsAsync(): Promise<void> {
    this.loading = true;  // Mostrar indicador de carga
    this.error = '';      // Limpiar errores anteriores

    try {
      // Obtener equipos del servicio de datos
      const teams = await firstValueFrom(this.nbaDataService.getTeams());
      
      // Organizar los equipos
      this.teams = teams;
      this.eastTeams = teams.filter(team => team.conference === 'East');
      this.westTeams = teams.filter(team => team.conference === 'West');
      this.loading = false; // Ocultar indicador de carga

      // Si no hay equipos de la API, usar mock data
      if (teams.length === 0) {
        await this.loadMockTeamsAsync();
      }
    } catch (error) {
      console.error('Error loading teams:', error);
      
      // Usar DialogService en lugar de console.error visible al usuario
      await this.dialogService.error(
        'Error de carga',
        'No se pudieron cargar los equipos desde el servidor. Usando datos locales.'
      );
      
      await this.loadMockTeamsAsync();
      this.loading = false;
    }
  }

  /**
   * Carga datos mock de forma asíncrona
   */
  private async loadMockTeamsAsync(): Promise<void> {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const mockTeams: Team[] = [
      // Eastern Conference
      {
        id: 1, name: 'Celtics', city: 'Boston',
        conference: 'East', division: 'Atlantic', championships: 18, founded: 1946,
        logo: 'https://cdn.nba.com/logos/nba/1610612738/primary/L/logo.svg',
        players: [
          {
            id: 101, name: 'Jayson Tatum', team: 'Boston Celtics', teamLogo: 'https://cdn.nba.com/logos/nba/1610612738/primary/L/logo.svg',
            pointsPerGame: 28.7, assistsPerGame: 4.9, jerseyNumber: 0, isAllStar: true
          },
          {
            id: 102, name: 'Jaylen Brown', team: 'Boston Celtics', teamLogo: 'https://cdn.nba.com/logos/nba/1610612738/primary/L/logo.svg',
            pointsPerGame: 23.1, assistsPerGame: 3.5, jerseyNumber: 7, isAllStar: true
          },
          {
            id: 103, name: 'Marcus Smart', team: 'Boston Celtics', teamLogo: 'https://cdn.nba.com/logos/nba/1610612738/primary/L/logo.svg',
            pointsPerGame: 12.1, assistsPerGame: 5.9, jerseyNumber: 36, isAllStar: false
          }
        ]
      },
      {
        id: 2, name: '76ers', city: 'Philadelphia',
        conference: 'East', division: 'Atlantic', championships: 3, founded: 1963,
        logo: 'https://cdn.nba.com/logos/nba/1610612755/primary/L/logo.svg',
        players: [
          {
            id: 201, name: 'Joel Embiid', team: 'Philadelphia 76ers', teamLogo: 'https://cdn.nba.com/logos/nba/1610612755/primary/L/logo.svg',
            pointsPerGame: 33.1, assistsPerGame: 4.2, jerseyNumber: 21, isAllStar: true
          },
          {
            id: 202, name: 'Tyrese Maxey', team: 'Philadelphia 76ers', teamLogo: 'https://cdn.nba.com/logos/nba/1610612755/primary/L/logo.svg',
            pointsPerGame: 20.3, assistsPerGame: 3.5, jerseyNumber: 0, isAllStar: false
          }
        ]
      },
      {
        id: 3, name: 'Nets', city: 'Brooklyn',
        conference: 'East', division: 'Atlantic', championships: 0, founded: 1976,
        logo: 'https://cdn.nba.com/logos/nba/1610612751/primary/L/logo.svg',
        players: [
          {
            id: 301, name: 'Mikal Bridges', team: 'Brooklyn Nets', teamLogo: 'https://cdn.nba.com/logos/nba/1610612751/primary/L/logo.svg',
            pointsPerGame: 20.1, assistsPerGame: 4.1, jerseyNumber: 1, isAllStar: false
          },
          {
            id: 302, name: 'Nic Claxton', team: 'Brooklyn Nets', teamLogo: 'https://cdn.nba.com/logos/nba/1610612751/primary/L/logo.svg',
            pointsPerGame: 12.6, assistsPerGame: 2.5, jerseyNumber: 33, isAllStar: false
          }
        ]
      },
      {
        id: 4, name: 'Knicks', city: 'New York',
        conference: 'East', division: 'Atlantic', championships: 2, founded: 1946,
        logo: 'https://cdn.nba.com/logos/nba/1610612752/primary/L/logo.svg',
        players: [
          {
            id: 401, name: 'Julius Randle', team: 'New York Knicks', teamLogo: 'https://cdn.nba.com/logos/nba/1610612752/primary/L/logo.svg',
            pointsPerGame: 25.1, assistsPerGame: 4.1, jerseyNumber: 30, isAllStar: true
          },
          {
            id: 402, name: 'Jalen Brunson', team: 'New York Knicks', teamLogo: 'https://cdn.nba.com/logos/nba/1610612752/primary/L/logo.svg',
            pointsPerGame: 24.0, assistsPerGame: 6.2, jerseyNumber: 11, isAllStar: true
          }
        ]
      },
      {
        id: 5, name: 'Raptors', city: 'Toronto',
        conference: 'East', division: 'Atlantic', championships: 1, founded: 1995,
        logo: 'https://cdn.nba.com/logos/nba/1610612761/primary/L/logo.svg',
        players: [
          {
            id: 501, name: 'Pascal Siakam', team: 'Toronto Raptors', teamLogo: 'https://cdn.nba.com/logos/nba/1610612761/primary/L/logo.svg',
            pointsPerGame: 24.2, assistsPerGame: 5.8, jerseyNumber: 43, isAllStar: true
          },
          {
            id: 502, name: 'Scottie Barnes', team: 'Toronto Raptors', teamLogo: 'https://cdn.nba.com/logos/nba/1610612761/primary/L/logo.svg',
            pointsPerGame: 15.3, assistsPerGame: 4.8, jerseyNumber: 4, isAllStar: false
          }
        ]
      },
      
      // Western Conference
      {
        id: 14, name: 'Lakers', city: 'Los Angeles',
        conference: 'West', division: 'Pacific', championships: 17, founded: 1947,
        logo: 'https://cdn.nba.com/logos/nba/1610612747/primary/L/logo.svg',
        players: [
          {
            id: 1401, name: 'LeBron James', team: 'Los Angeles Lakers', teamLogo: 'https://cdn.nba.com/logos/nba/1610612747/primary/L/logo.svg',
            pointsPerGame: 28.9, assistsPerGame: 8.3, jerseyNumber: 6, isAllStar: true
          },
          {
            id: 1402, name: 'Anthony Davis', team: 'Los Angeles Lakers', teamLogo: 'https://cdn.nba.com/logos/nba/1610612747/primary/L/logo.svg',
            pointsPerGame: 25.9, assistsPerGame: 2.6, jerseyNumber: 3, isAllStar: true
          },
          {
            id: 1403, name: 'Austin Reaves', team: 'Los Angeles Lakers', teamLogo: 'https://cdn.nba.com/logos/nba/1610612747/primary/L/logo.svg',
            pointsPerGame: 13.0, assistsPerGame: 3.4, jerseyNumber: 15, isAllStar: false
          }
        ]
      },
      {
        id: 10, name: 'Warriors', city: 'Golden State',
        conference: 'West', division: 'Pacific', championships: 7, founded: 1946,
        logo: 'https://cdn.nba.com/logos/nba/1610612744/primary/L/logo.svg',
        players: [
          {
            id: 1001, name: 'Stephen Curry', team: 'Golden State Warriors', teamLogo: 'https://cdn.nba.com/logos/nba/1610612744/primary/L/logo.svg',
            pointsPerGame: 29.5, assistsPerGame: 6.2, jerseyNumber: 30, isAllStar: true
          },
          {
            id: 1002, name: 'Klay Thompson', team: 'Golden State Warriors', teamLogo: 'https://cdn.nba.com/logos/nba/1610612744/primary/L/logo.svg',
            pointsPerGame: 21.9, assistsPerGame: 2.4, jerseyNumber: 11, isAllStar: true
          },
          {
            id: 1003, name: 'Draymond Green', team: 'Golden State Warriors', teamLogo: 'https://cdn.nba.com/logos/nba/1610612744/primary/L/logo.svg',
            pointsPerGame: 8.5, assistsPerGame: 7.2, jerseyNumber: 23, isAllStar: false
          }
        ]
      },
      {
        id: 21, name: 'Suns', city: 'Phoenix',
        conference: 'West', division: 'Pacific', championships: 0, founded: 1968,
        logo: 'https://cdn.nba.com/logos/nba/1610612756/primary/L/logo.svg',
        players: [
          {
            id: 2101, name: 'Devin Booker', team: 'Phoenix Suns', teamLogo: 'https://cdn.nba.com/logos/nba/1610612756/primary/L/logo.svg',
            pointsPerGame: 27.1, assistsPerGame: 4.5, jerseyNumber: 1, isAllStar: true
          },
          {
            id: 2102, name: 'Kevin Durant', team: 'Phoenix Suns', teamLogo: 'https://cdn.nba.com/logos/nba/1610612756/primary/L/logo.svg',
            pointsPerGame: 29.7, assistsPerGame: 5.0, jerseyNumber: 35, isAllStar: true
          }
        ]
      },
      {
        id: 6, name: 'Mavericks', city: 'Dallas',
        conference: 'West', division: 'Southwest', championships: 1, founded: 1980,
        logo: 'https://cdn.nba.com/logos/nba/1610612742/primary/L/logo.svg',
        players: [
          {
            id: 601, name: 'Luka Dončić', team: 'Dallas Mavericks', teamLogo: 'https://cdn.nba.com/logos/nba/1610612742/primary/L/logo.svg',
            pointsPerGame: 32.4, assistsPerGame: 8.6, jerseyNumber: 77, isAllStar: true
          },
          {
            id: 602, name: 'Kyrie Irving', team: 'Dallas Mavericks', teamLogo: 'https://cdn.nba.com/logos/nba/1610612742/primary/L/logo.svg',
            pointsPerGame: 25.6, assistsPerGame: 5.2, jerseyNumber: 2, isAllStar: true
          }
        ]
      },
      {
        id: 7, name: 'Nuggets', city: 'Denver',
        conference: 'West', division: 'Northwest', championships: 1, founded: 1976,
        logo: 'https://cdn.nba.com/logos/nba/1610612743/primary/L/logo.svg',
        players: [
          {
            id: 701, name: 'Nikola Jokić', team: 'Denver Nuggets', teamLogo: 'https://cdn.nba.com/logos/nba/1610612743/primary/L/logo.svg',
            pointsPerGame: 24.5, assistsPerGame: 9.8, jerseyNumber: 15, isAllStar: true
          },
          {
            id: 702, name: 'Jamal Murray', team: 'Denver Nuggets', teamLogo: 'https://cdn.nba.com/logos/nba/1610612743/primary/L/logo.svg',
            pointsPerGame: 20.0, assistsPerGame: 4.8, jerseyNumber: 27, isAllStar: false
          }
        ]
      }
    ];

    this.teams = mockTeams;
    this.eastTeams = mockTeams.filter(team => team.conference === 'East');
    this.westTeams = mockTeams.filter(team => team.conference === 'West');
  }

  /**
   * Selecciona equipo y muestra modal directamente
   */
  async selectTeam(team: Team): Promise<void> {
    this.selectedTeam = team;
    this.showPlayersModal = true;
    this.nbaDataService.selectTeam(team);
    
    console.log('Team selected:', team.name, 'Players:', team.players.length);
  }

  closePlayersModal(): void {
    this.showPlayersModal = false;
    this.selectedTeam = null;
  }

  /**
   * Recarga equipos con confirmación
   */
  async reloadTeams(): Promise<void> {
    const confirmed = await this.dialogService.confirm({
      title: 'Recargar datos',
      message: '¿Quieres recargar la lista de equipos?',
      confirmText: 'Recargar',
      cancelText: 'Cancelar',
      type: 'warning'
    });

    if (confirmed) {
      await this.loadTeamsAsync();
    }
  }
}
