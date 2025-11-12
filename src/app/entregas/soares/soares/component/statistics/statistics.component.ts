/**
 * COMPONENTE STATISTICS - PÁGINA DE ESTADÍSTICAS NBA
 * 
 * Funciones principales:
 * - Mostrar rankings de mejores jugadores por categoría
 * - Permitir alternar entre diferentes estadísticas
 * - Presentar datos de manera visual y fácil de entender
 * - Mantener la información actualizada y ordenada
 */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { NbaDataService } from '../../service/nba-data.service';
import { Player } from '../../model';

// Definición de cómo se ve cada estadística de jugador
interface PlayerStat {
  name: string;      // Nombre del jugador
  team: string;      // Su equipo
  points: number;    // Puntos por partido
  assists: number;   // Asistencias por partido
  rebounds: number;  // Rebotes por partido
}

@Component({
  selector: 'app-statistics',    // Nombre para usar en HTML: <app-statistics>
  standalone: true,              // Componente independiente
  imports: [CommonModule],       // Solo necesita funcionalidades básicas
  templateUrl: './statistics.component.html', // Usa el archivo HTML externo
  styleUrls: ['./statistics.component.css']   // Usa el archivo CSS externo
})
export class StatisticsComponent  {
  // PROPIEDADES PARA COINCIDIR CON EL HTML
  selectedCategory: 'points' | 'assists' | 'rebounds' | 'steals' = 'points';
  allPlayers: any[] = [];

  constructor(private nbaDataService: NbaDataService) {}

  ngOnInit(): void {
    this.loadSimpleStats();
  }

  // MÉTODO PARA SELECCIONAR CATEGORÍA
  selectCategory(category: 'points' | 'assists' | 'rebounds' | 'steals'): void {
    this.selectedCategory = category;
  }

  // MÉTODOS REQUERIDOS POR EL HTML
  getCategoryIcon(): string {
    switch(this.selectedCategory) {
      case 'points': return 'fas fa-basketball-ball';
      case 'assists': return 'fas fa-hands-helping';
      case 'rebounds': return 'fas fa-chart-bar';
      case 'steals': return 'fas fa-hand-paper';
      default: return 'fas fa-chart-line';
    }
  }

  getCategoryTitle(): string {
    switch(this.selectedCategory) {
      case 'points': return 'Puntos por Juego';
      case 'assists': return 'Asistencias por Juego';
      case 'rebounds': return 'Rebotes por Juego';
      case 'steals': return 'Robos por Juego';
      default: return 'Estadísticas';
    }
  }

  getCategoryLabel(): string {
    switch(this.selectedCategory) {
      case 'points': return 'PTS';
      case 'assists': return 'AST';
      case 'rebounds': return 'REB';
      case 'steals': return 'STL';
      default: return '';
    }
  }

  closeDetail(): void {
    // Método para cerrar vista detallada
    console.log('Cerrando detalle...');
  }

  getCurrentPlayers(): Observable<any[]> {
    // Retorna un observable con los jugadores filtrados según la categoría seleccionada
    const sortedPlayers = [...this.allPlayers].sort((a, b) => {
      const statA = this.getPlayerStat(a);
      const statB = this.getPlayerStat(b);
      return statB - statA; // Orden descendente (mayor a menor)
    });
    
    return of(sortedPlayers.slice(0, 10)); // Top 10 jugadores
  }

  getPlayerStat(player: any): number {
    if (!player || !player.stats) return 0;
    
    switch(this.selectedCategory) {
      case 'points': return player.stats.pointsPerGame || 0;
      case 'assists': return player.stats.assistsPerGame || 0;
      case 'rebounds': return player.stats.reboundsPerGame || 0;
      case 'steals': return player.stats.stealsPerGame || 0;
      default: return 0;
    }
  }

  // DATOS MOCK CON LA ESTRUCTURA QUE ESPERA EL HTML
  private loadSimpleStats(): void {
    this.allPlayers = [
      {
        id: 1,
        firstName: 'LeBron',
        lastName: 'James',
        image: 'https://cdn.nba.com/headshots/nba/latest/1040x760/2544.png',
        position: 'SF',
        jerseyNumber: 6,
        team: {
          city: 'Los Angeles',
          name: 'Lakers'
        },
        stats: {
          pointsPerGame: 28.5,
          assistsPerGame: 8.2,
          reboundsPerGame: 7.9,
          stealsPerGame: 1.1
        }
      },
      {
        id: 2,
        firstName: 'Stephen',
        lastName: 'Curry',
        image: 'https://cdn.nba.com/headshots/nba/latest/1040x760/201939.png',
        position: 'PG',
        jerseyNumber: 30,
        team: {
          city: 'Golden State',
          name: 'Warriors'
        },
        stats: {
          pointsPerGame: 30.1,
          assistsPerGame: 6.8,
          reboundsPerGame: 5.4,
          stealsPerGame: 1.5
        }
      },
      {
        id: 3,
        firstName: 'Jayson',
        lastName: 'Tatum',
        image: 'https://cdn.nba.com/headshots/nba/latest/1040x760/1628369.png',
        position: 'SF',
        jerseyNumber: 0,
        team: {
          city: 'Boston',
          name: 'Celtics'
        },
        stats: {
          pointsPerGame: 27.8,
          assistsPerGame: 4.9,
          reboundsPerGame: 8.1,
          stealsPerGame: 1.2
        }
      },
      {
        id: 4,
        firstName: 'Luka',
        lastName: 'Dončić',
        image: 'https://cdn.nba.com/headshots/nba/latest/1040x760/1629029.png',
        position: 'PG',
        jerseyNumber: 77,
        team: {
          city: 'Dallas',
          name: 'Mavericks'
        },
        stats: {
          pointsPerGame: 29.3,
          assistsPerGame: 9.1,
          reboundsPerGame: 8.5,
          stealsPerGame: 1.4
        }
      },
      {
        id: 5,
        firstName: 'Nikola',
        lastName: 'Jokić',
        image: 'https://cdn.nba.com/headshots/nba/latest/1040x760/203999.png',
        position: 'C',
        jerseyNumber: 15,
        team: {
          city: 'Denver',
          name: 'Nuggets'
        },
        stats: {
          pointsPerGame: 25.2,
          assistsPerGame: 10.8,
          reboundsPerGame: 12.3,
          stealsPerGame: 1.3
        }
      },
      {
        id: 6,
        firstName: 'Giannis',
        lastName: 'Antetokounmpo',
        image: 'https://cdn.nba.com/headshots/nba/latest/1040x760/203507.png',
        position: 'PF',
        jerseyNumber: 34,
        team: {
          city: 'Milwaukee',
          name: 'Bucks'
        },
        stats: {
          pointsPerGame: 31.2,
          assistsPerGame: 6.1,
          reboundsPerGame: 11.2,
          stealsPerGame: 1.0
        }
      }
    ];
  }
}