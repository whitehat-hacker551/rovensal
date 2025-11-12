/**
 * SERVICIO DE DATOS NBA - EL "ALMACÉN" DE TODA LA INFORMACIÓN
 * 
 * 
 * Es como tener una biblioteca NBA completa en nuestro código.
 */

import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Team, Player, Game, QuizQuestion, GameFilters } from '../model/nba-data.model';

@Injectable({
  providedIn: 'root' // Este servicio estará disponible en toda la aplicación
})
export class NbaDataService {
  // Sistema de notificaciones - cuando seleccionamos un jugador o equipo
  private selectedPlayerSubject = new Subject<Player>();
  private selectedTeamSubject = new Subject<Team>();
  
  // "Canales" públicos donde otros componentes pueden "escuchar" cambios
  public selectedPlayer$ = this.selectedPlayerSubject.asObservable();
  public selectedTeam$ = this.selectedTeamSubject.asObservable();

  // Nuestras "bases de datos" simuladas
  private mockTeams: Team[] = [];      // Lista de todos los equipos
  private mockPlayers: Player[] = [];  // Lista de todos los jugadores
  private mockGames: Game[] = [];      // Lista de todos los partidos
  private mockQuizQuestions: QuizQuestion[] = []; // Preguntas del quiz

  constructor() {
    // Cuando se crea el servicio, llenamos todas nuestras listas con datos
    this.initializeMockData();
  }

  // Método privado que carga todos los datos cuando inicia la aplicación
  private initializeMockData(): void {
    this.mockTeams = this.createMockTeams();           // Crea lista de equipos
    this.mockPlayers = this.createMockPlayers();       // Crea lista de jugadores
    this.mockGames = this.createMockGames();           // Crea lista de partidos
    this.mockQuizQuestions = this.createMockQuizQuestions(); // Crea preguntas del quiz
  }

  // MÉTODOS PÚBLICOS - Lo que pueden usar otros componentes

  // Obtener todos los equipos (simula una consulta a base de datos)
  getTeams(): Observable<Team[]> {
    return of([...this.mockTeams]).pipe(delay(500)); // Simula 500ms de carga
  }

  // Obtener partidos con filtros opcionales
  getGames(filters: GameFilters = {}): Observable<Game[]> {
    return of([...this.mockGames]).pipe(delay(500));
  }

  // Obtener preguntas para el quiz
  getQuizQuestions(): Observable<QuizQuestion[]> {
    return of([...this.mockQuizQuestions]).pipe(delay(300));
  }

  // Top jugadores por puntos anotados
  getTopPlayersByPoints(limit: number = 10): Observable<Player[]> {
    const topPlayers = [...this.mockPlayers].slice(0, limit);
    return of(topPlayers).pipe(delay(500));
  }

  // Top jugadores por asistencias
  getTopPlayersByAssists(limit: number = 10): Observable<Player[]> {
    const topPlayers = [...this.mockPlayers].slice(0, limit);
    return of(topPlayers).pipe(delay(500));
  }

  // Obtener jugadores de un equipo específico
  getPlayersByTeam(teamId: number): Observable<Player[]> {
    const team = this.mockTeams.find(t => t.id === teamId);
    return of(team?.players || []).pipe(delay(300));
  }

  // Notificar a toda la app que se seleccionó un jugador
  selectPlayer(player: Player): void {
    this.selectedPlayerSubject.next(player);
  }

  // Notificar a toda la app que se seleccionó un equipo
  selectTeam(team: Team): void {
    this.selectedTeamSubject.next(team);
  }

  // MÉTODOS PRIVADOS - Solo para uso interno del servicio
  
  // Crea la lista completa de equipos NBA con todos sus datos
  private createMockTeams(): Team[] {
    return [
      {
        id: 1,
        name: 'Lakers',
        city: 'Los Angeles',
        conference: 'West',
        division: 'Pacific',
        championships: 17,
        founded: 1947,
        logo: 'https://cdn.nba.com/logos/nba/1610612747/primary/L/logo.svg',
        players: [
          { id: 1, name: 'LeBron James', team: 'Lakers', teamLogo: 'https://cdn.nba.com/logos/nba/1610612747/primary/L/logo.svg', pointsPerGame: 28.5, assistsPerGame: 6.8, jerseyNumber: 6, isAllStar: true },
          { id: 2, name: 'Anthony Davis', team: 'Lakers', teamLogo: 'https://cdn.nba.com/logos/nba/1610612747/primary/L/logo.svg', pointsPerGame: 25.2, assistsPerGame: 2.4, jerseyNumber: 3, isAllStar: true }
        ]
      },
      {
        id: 2,
        name: 'Warriors',
        city: 'Golden State',
        conference: 'West',
        division: 'Pacific',
        championships: 7,
        founded: 1946,
        logo: 'https://cdn.nba.com/logos/nba/1610612744/primary/L/logo.svg',
        players: [
          { id: 3, name: 'Stephen Curry', team: 'Warriors', teamLogo: 'https://cdn.nba.com/logos/nba/1610612744/primary/L/logo.svg', pointsPerGame: 31.2, assistsPerGame: 5.8, jerseyNumber: 30, isAllStar: true },
          { id: 4, name: 'Klay Thompson', team: 'Warriors', teamLogo: 'https://cdn.nba.com/logos/nba/1610612744/primary/L/logo.svg', pointsPerGame: 21.7, assistsPerGame: 2.4, jerseyNumber: 11, isAllStar: false }
        ]
      },
      {
        id: 3,
        name: 'Celtics',
        city: 'Boston',
        conference: 'East',
        division: 'Atlantic',
        championships: 18,
        founded: 1946,
        logo: 'https://cdn.nba.com/logos/nba/1610612738/primary/L/logo.svg',
        players: [
          { id: 5, name: 'Jayson Tatum', team: 'Celtics', teamLogo: 'https://cdn.nba.com/logos/nba/1610612738/primary/L/logo.svg', pointsPerGame: 30.8, assistsPerGame: 4.3, jerseyNumber: 0, isAllStar: true },
          { id: 6, name: 'Jaylen Brown', team: 'Celtics', teamLogo: 'https://cdn.nba.com/logos/nba/1610612738/primary/L/logo.svg', pointsPerGame: 24.2, assistsPerGame: 3.6, jerseyNumber: 7, isAllStar: true }
        ]
      },
      {
        id: 4,
        name: 'Heat',
        city: 'Miami',
        conference: 'East',
        division: 'Southeast',
        championships: 3,
        founded: 1988,
        logo: 'https://cdn.nba.com/logos/nba/1610612748/primary/L/logo.svg',
        players: [
          { id: 7, name: 'Jimmy Butler', team: 'Heat', teamLogo: 'https://cdn.nba.com/logos/nba/1610612748/primary/L/logo.svg', pointsPerGame: 22.9, assistsPerGame: 5.3, jerseyNumber: 22, isAllStar: true },
          { id: 8, name: 'Bam Adebayo', team: 'Heat', teamLogo: 'https://cdn.nba.com/logos/nba/1610612748/primary/L/logo.svg', pointsPerGame: 19.3, assistsPerGame: 3.2, jerseyNumber: 13, isAllStar: true }
        ]
      },
      {
        id: 5,
        name: '76ers',
        city: 'Philadelphia',
        conference: 'East',
        division: 'Atlantic',
        championships: 3,
        founded: 1949,
        logo: 'https://cdn.nba.com/logos/nba/1610612755/primary/L/logo.svg',
        players: [
          { id: 9, name: 'Joel Embiid', team: '76ers', teamLogo: 'https://cdn.nba.com/logos/nba/1610612755/primary/L/logo.svg', pointsPerGame: 33.1, assistsPerGame: 4.2, jerseyNumber: 21, isAllStar: true },
          { id: 10, name: 'Tyrese Maxey', team: '76ers', teamLogo: 'https://cdn.nba.com/logos/nba/1610612755/primary/L/logo.svg', pointsPerGame: 20.3, assistsPerGame: 3.5, jerseyNumber: 0, isAllStar: false }
        ]
      },
      {
        id: 6,
        name: 'Mavericks',
        city: 'Dallas',
        conference: 'West',
        division: 'Southwest',
        championships: 1,
        founded: 1980,
        logo: 'https://cdn.nba.com/logos/nba/1610612742/primary/L/logo.svg',
        players: [
          { id: 11, name: 'Luka Dončić', team: 'Mavericks', teamLogo: 'https://cdn.nba.com/logos/nba/1610612742/primary/L/logo.svg', pointsPerGame: 32.4, assistsPerGame: 9.1, jerseyNumber: 77, isAllStar: true },
          { id: 12, name: 'Kyrie Irving', team: 'Mavericks', teamLogo: 'https://cdn.nba.com/logos/nba/1610612742/primary/L/logo.svg', pointsPerGame: 25.6, assistsPerGame: 5.2, jerseyNumber: 11, isAllStar: true }
        ]
      },
      {
        id: 7,
        name: 'Nuggets',
        city: 'Denver',
        conference: 'West',
        division: 'Northwest',
        championships: 1,
        founded: 1976,
        logo: 'https://cdn.nba.com/logos/nba/1610612743/primary/L/logo.svg',
        players: [
          { id: 13, name: 'Nikola Jokić', team: 'Nuggets', teamLogo: 'https://cdn.nba.com/logos/nba/1610612743/primary/L/logo.svg', pointsPerGame: 29.7, assistsPerGame: 8.3, jerseyNumber: 15, isAllStar: true },
          { id: 14, name: 'Jamal Murray', team: 'Nuggets', teamLogo: 'https://cdn.nba.com/logos/nba/1610612743/primary/L/logo.svg', pointsPerGame: 21.2, assistsPerGame: 4.0, jerseyNumber: 27, isAllStar: false }
        ]
      },
      {
        id: 8,
        name: 'Bucks',
        city: 'Milwaukee',
        conference: 'East',
        division: 'Central',
        championships: 2,
        founded: 1968,
        logo: 'https://cdn.nba.com/logos/nba/1610612749/primary/L/logo.svg',
        players: [
          { id: 15, name: 'Giannis Antetokounmpo', team: 'Bucks', teamLogo: 'https://cdn.nba.com/logos/nba/1610612749/primary/L/logo.svg', pointsPerGame: 31.1, assistsPerGame: 5.7, jerseyNumber: 34, isAllStar: true },
          { id: 16, name: 'Damian Lillard', team: 'Bucks', teamLogo: 'https://cdn.nba.com/logos/nba/1610612749/primary/L/logo.svg', pointsPerGame: 24.3, assistsPerGame: 7.0, jerseyNumber: 0, isAllStar: true }
        ]
      }
    ];
  }

  private createMockPlayers(): Player[] {
    return [
      { id: 1, name: 'LeBron James', team: 'Lakers', teamLogo: 'https://cdn.nba.com/logos/nba/1610612747/primary/L/logo.svg', pointsPerGame: 28.5, assistsPerGame: 6.8, jerseyNumber: 6, isAllStar: true },
      { id: 2, name: 'Anthony Davis', team: 'Lakers', teamLogo: 'https://cdn.nba.com/logos/nba/1610612747/primary/L/logo.svg', pointsPerGame: 25.2, assistsPerGame: 2.4, jerseyNumber: 3, isAllStar: true },
      { id: 3, name: 'Stephen Curry', team: 'Warriors', teamLogo: 'https://cdn.nba.com/logos/nba/1610612744/primary/L/logo.svg', pointsPerGame: 31.2, assistsPerGame: 5.8, jerseyNumber: 30, isAllStar: true },
      { id: 4, name: 'Klay Thompson', team: 'Warriors', teamLogo: 'https://cdn.nba.com/logos/nba/1610612744/primary/L/logo.svg', pointsPerGame: 21.7, assistsPerGame: 2.4, jerseyNumber: 11, isAllStar: false },
      { id: 5, name: 'Jayson Tatum', team: 'Celtics', teamLogo: 'https://cdn.nba.com/logos/nba/1610612738/primary/L/logo.svg', pointsPerGame: 30.8, assistsPerGame: 4.3, jerseyNumber: 0, isAllStar: true },
      { id: 6, name: 'Jaylen Brown', team: 'Celtics', teamLogo: 'https://cdn.nba.com/logos/nba/1610612738/primary/L/logo.svg', pointsPerGame: 24.2, assistsPerGame: 3.6, jerseyNumber: 7, isAllStar: true },
      { id: 7, name: 'Jimmy Butler', team: 'Heat', teamLogo: 'https://cdn.nba.com/logos/nba/1610612748/primary/L/logo.svg', pointsPerGame: 22.9, assistsPerGame: 5.3, jerseyNumber: 22, isAllStar: true },
      { id: 8, name: 'Bam Adebayo', team: 'Heat', teamLogo: 'https://cdn.nba.com/logos/nba/1610612748/primary/L/logo.svg', pointsPerGame: 19.3, assistsPerGame: 3.2, jerseyNumber: 13, isAllStar: true },
      { id: 9, name: 'Joel Embiid', team: '76ers', teamLogo: 'https://cdn.nba.com/logos/nba/1610612755/primary/L/logo.svg', pointsPerGame: 33.1, assistsPerGame: 4.2, jerseyNumber: 21, isAllStar: true },
      { id: 10, name: 'Tyrese Maxey', team: '76ers', teamLogo: 'https://cdn.nba.com/logos/nba/1610612755/primary/L/logo.svg', pointsPerGame: 20.3, assistsPerGame: 3.5, jerseyNumber: 0, isAllStar: false },
      { id: 11, name: 'Luka Dončić', team: 'Mavericks', teamLogo: 'https://cdn.nba.com/logos/nba/1610612742/primary/L/logo.svg', pointsPerGame: 32.4, assistsPerGame: 9.1, jerseyNumber: 77, isAllStar: true },
      { id: 12, name: 'Kyrie Irving', team: 'Mavericks', teamLogo: 'https://cdn.nba.com/logos/nba/1610612742/primary/L/logo.svg', pointsPerGame: 25.6, assistsPerGame: 5.2, jerseyNumber: 11, isAllStar: true },
      { id: 13, name: 'Nikola Jokić', team: 'Nuggets', teamLogo: 'https://cdn.nba.com/logos/nba/1610612743/primary/L/logo.svg', pointsPerGame: 29.7, assistsPerGame: 8.3, jerseyNumber: 15, isAllStar: true },
      { id: 14, name: 'Jamal Murray', team: 'Nuggets', teamLogo: 'https://cdn.nba.com/logos/nba/1610612743/primary/L/logo.svg', pointsPerGame: 21.2, assistsPerGame: 4.0, jerseyNumber: 27, isAllStar: false },
      { id: 15, name: 'Giannis Antetokounmpo', team: 'Bucks', teamLogo: 'https://cdn.nba.com/logos/nba/1610612749/primary/L/logo.svg', pointsPerGame: 31.1, assistsPerGame: 5.7, jerseyNumber: 34, isAllStar: true },
      { id: 16, name: 'Damian Lillard', team: 'Bucks', teamLogo: 'https://cdn.nba.com/logos/nba/1610612749/primary/L/logo.svg', pointsPerGame: 24.3, assistsPerGame: 7.0, jerseyNumber: 0, isAllStar: true }
    ];
  }

  private createMockGames(): Game[] {
    return [
      {
        id: 1,
        date: '2024-11-08',
        homeTeam: 'Lakers',
        awayTeam: 'Warriors',
        homeScore: 112,
        awayScore: 108
      },
      {
        id: 2,
        date: '2024-11-09',
        homeTeam: 'Celtics',
        awayTeam: 'Heat',
        homeScore: 105,
        awayScore: 98
      }
    ];
  }

  private createMockQuizQuestions(): QuizQuestion[] {
    return [
      {
        id: 1,
        question: '¿Cuántos campeonatos NBA tienen los Lakers?',
        options: ['15', '16', '17', '18'],
        correctAnswer: 2,
        category: 'teams',
        difficulty: 'medium',
        explanation: 'Los Lakers han ganado 17 campeonatos de la NBA.'
      },
      {
        id: 2,
        question: '¿Quién tiene el récord de más puntos en un partido NBA?',
        options: ['Kobe Bryant', 'Michael Jordan', 'Wilt Chamberlain', 'LeBron James'],
        correctAnswer: 2,
        category: 'records',
        difficulty: 'hard',
        explanation: 'Wilt Chamberlain anotó 100 puntos en un partido en 1962.'
      },
      {
        id: 3,
        question: '¿Cuántos equipos tiene la NBA actualmente?',
        options: ['28', '30', '32', '34'],
        correctAnswer: 1,
        category: 'teams',
        difficulty: 'easy',
        explanation: 'La NBA tiene actualmente 30 equipos.'
      },
      {
        id: 4,
        question: '¿En qué año se fundó la NBA?',
        options: ['1946', '1949', '1950', '1953'],
        correctAnswer: 0,
        category: 'history',
        difficulty: 'medium',
        explanation: 'La NBA fue fundada el 6 de junio de 1946 como BAA y se fusionó con la NBL en 1949.'
      },
      {
        id: 5,
        question: '¿Quién tiene más anillos de campeonato como jugador?',
        options: ['Michael Jordan', 'Bill Russell', 'Magic Johnson', 'Kareem Abdul-Jabbar'],
        correctAnswer: 1,
        category: 'players',
        difficulty: 'hard',
        explanation: 'Bill Russell ganó 11 anillos con los Boston Celtics entre 1957 y 1969.'
      },
      {
        id: 6,
        question: '¿Cuál es la franquicia más antigua de la NBA?',
        options: ['Boston Celtics', 'New York Knicks', 'Sacramento Kings', 'Philadelphia 76ers'],
        correctAnswer: 2,
        category: 'history',
        difficulty: 'hard',
        explanation: 'Los Sacramento Kings (fundados como Rochester Royals en 1945) son la franquicia más antigua.'
      },
      {
        id: 7,
        question: '¿Cuánto dura un partido de NBA?',
        options: ['40 minutos', '44 minutos', '48 minutos', '50 minutos'],
        correctAnswer: 2,
        category: 'rules',
        difficulty: 'easy',
        explanation: 'Un partido de NBA dura 48 minutos, divididos en 4 cuartos de 12 minutos cada uno.'
      },
      {
        id: 8,
        question: '¿Quién es el máximo anotador histórico de la NBA?',
        options: ['Kareem Abdul-Jabbar', 'LeBron James', 'Kobe Bryant', 'Michael Jordan'],
        correctAnswer: 1,
        category: 'records',
        difficulty: 'medium',
        explanation: 'LeBron James superó a Kareem Abdul-Jabbar en 2023 como el máximo anotador histórico.'
      },
      {
        id: 9,
        question: '¿Cuántos equipos forman cada conferencia?',
        options: ['12', '14', '15', '16'],
        correctAnswer: 2,
        category: 'teams',
        difficulty: 'easy',
        explanation: 'Cada conferencia (Este y Oeste) tiene 15 equipos, para un total de 30 equipos.'
      },
      {
        id: 10,
        question: '¿Quién tiene el récord de más triples dobles en una temporada?',
        options: ['Russell Westbrook', 'Oscar Robertson', 'Magic Johnson', 'LeBron James'],
        correctAnswer: 0,
        category: 'records',
        difficulty: 'hard',
        explanation: 'Russell Westbrook logró 42 triples dobles en la temporada 2016-17, rompiendo el récord de Oscar Robertson.'
      }
    ];
  }
}
