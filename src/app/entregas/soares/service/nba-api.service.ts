/**
 * NBA API SERVICE - SERVICIO PRINCIPAL CON API REAL
 * Ubicación: src/app/entregas/soares/service/nba-api.service.ts
 * Este servicio se encarga de interactuar con la API externa de balldontlie.io
 * para obtener datos reales de equipos, jugadores y partidos de la NBA.
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, timeout, retry } from 'rxjs/operators';
import { Team, Player, Game, QuizQuestion, GameFilters } from '../model/nba-data.model';
import { environment } from '../environments/environment';

// Interfaces de la API
interface ApiTeam {
  id: number;
  conference: string;
  division: string;
  city: string;
  name: string;
  full_name: string;
  abbreviation: string;
}

interface ApiPlayer {
  id: number;
  first_name: string;
  last_name: string;
  position: string;
  height: string;
  weight: string;
  jersey_number: string;
  team?: ApiTeam;
  team_id?: number;
}

interface ApiGame {
  id: number;
  date: string;
  season: number;
  status: string;
  home_team_score: number;
  visitor_team_score: number;
  home_team: ApiTeam;
  visitor_team: ApiTeam;
}

interface ApiResponse<T> {
  data: T;
  meta?: {
    next_cursor?: number;
    per_page?: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class NbaApiService {
  private readonly BASE_URL = environment.apiUrl;
  private readonly API_KEY = environment.apiKey;
  private readonly TIMEOUT = environment.apiTimeout;
  private headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({
      'Authorization': this.API_KEY
    });
  }

  // ========== EQUIPOS ==========
  getTeams(): Observable<Team[]> {
    const url = `${this.BASE_URL}/teams`;
    return this.http.get<ApiResponse<ApiTeam[]>>(url, { headers: this.headers })
      .pipe(
        timeout(this.TIMEOUT),
        retry(2),
    map((response: ApiResponse<ApiTeam[]>) => this.transformTeams(response.data)),
        catchError(error => {
          console.warn('API falló, usando datos mock');
          return this.getTeamsMock();
        })
      );
  }

  getPlayersByTeam(teamId: number): Observable<Player[]> {
    const params = new HttpParams().set('team_ids[]', teamId.toString());
    const url = `${this.BASE_URL}/players`;
    return this.http.get<ApiResponse<ApiPlayer[]>>(url, { 
      headers: this.headers, 
      params 
    }).pipe(
      timeout(this.TIMEOUT),
  map((response: ApiResponse<ApiPlayer[]>) => this.transformPlayers(response.data)),
      catchError(() => of([]))
    );
  }

  // ========== PARTIDOS ==========
  getGames(filters: GameFilters = {}): Observable<Game[]> {
    let params = new HttpParams().set('per_page', '25');
    if (filters.date) {
      params = params.set('dates[]', filters.date);
    }
    if (filters.season) {
      params = params.set('seasons[]', filters.season.toString());
    }
    const url = `${this.BASE_URL}/games`;
    return this.http.get<ApiResponse<ApiGame[]>>(url, { 
      headers: this.headers, 
      params 
    }).pipe(
      timeout(this.TIMEOUT),
      retry(2),
  map((response: ApiResponse<ApiGame[]>) => this.transformGames(response.data)),
      catchError(error => {
        console.warn('API falló, usando partidos mock');
        return this.getGamesMock();
      })
    );
  }

  getTodayGames(): Observable<Game[]> {
    const today = new Date().toISOString().split('T')[0];
    return this.getGames({ date: today });
  }

  // ========== JUGADORES ==========
  getPlayers(page: number = 1, perPage: number = 25): Observable<Player[]> {
    const params = new HttpParams()
      .set('per_page', perPage.toString())
      .set('cursor', ((page - 1) * perPage).toString());
    const url = `${this.BASE_URL}/players`;
    return this.http.get<ApiResponse<ApiPlayer[]>>(url, { 
      headers: this.headers, 
      params 
    }).pipe(
      timeout(this.TIMEOUT),
  map((response: ApiResponse<ApiPlayer[]>) => this.transformPlayers(response.data)),
      catchError(() => this.getPlayersMock())
    );
  }

  searchPlayers(searchTerm: string): Observable<Player[]> {
    const params = new HttpParams().set('search', searchTerm);
    const url = `${this.BASE_URL}/players`;
    return this.http.get<ApiResponse<ApiPlayer[]>>(url, { 
      headers: this.headers, 
      params 
    }).pipe(
      timeout(this.TIMEOUT),
  map((response: ApiResponse<ApiPlayer[]>) => this.transformPlayers(response.data)),
      catchError(() => of([]))
    );
  }

  // ========== TRANSFORMACIONES ==========
  private transformTeams(apiTeams: ApiTeam[]): Team[] {
    return apiTeams.map(team => ({
      id: team.id,
      name: team.name,
      city: team.city,
      conference: team.conference as 'East' | 'West',
      division: team.division,
      championships: 0,
      founded: 1946,
      logo: '', // Sin iconos/logos
      players: []
    }));
  }

  private transformPlayers(apiPlayers: ApiPlayer[]): Player[] {
    return apiPlayers.map(player => ({
      id: player.id,
      name: `${player.first_name} ${player.last_name}`,
      team: player.team ? player.team.name : 'Free Agent',
      teamLogo: '', // Sin iconos/logos
      pointsPerGame: 0,
      assistsPerGame: 0,
      jerseyNumber: parseInt(player.jersey_number) || 0,
      isAllStar: false
    }));
  }

  private transformGames(apiGames: ApiGame[]): Game[] {
    return apiGames.map(game => ({
      id: game.id,
      date: game.date,
      homeTeam: game.home_team.name,
      awayTeam: game.visitor_team.name,
      homeScore: game.home_team_score,
      awayScore: game.visitor_team_score
    }));
  }

  // ========== MOCK DATA (FALLBACK) ==========
  private getTeamsMock(): Observable<Team[]> {
    return of([
      {
        id: 1,
        name: 'Lakers',
        city: 'Los Angeles',
        conference: 'West',
        division: 'Pacific',
        championships: 17,
        founded: 1947,
        logo: '', // Sin iconos/logos
        players: []
      }
      // ... más equipos mock
    ]);
  }

  private getPlayersMock(): Observable<Player[]> {
    return of([
      {
        id: 1,
        name: 'LeBron James',
        team: 'Lakers',
        teamLogo: '', // Sin iconos/logos
        pointsPerGame: 28.5,
        assistsPerGame: 6.8,
        jerseyNumber: 6,
        isAllStar: true
      }
      // ... más jugadores mock
    ]);
  }

  private getGamesMock(): Observable<Game[]> {
    return of([
      {
        id: 1,
        date: '2024-11-08',
        homeTeam: 'Lakers',
        awayTeam: 'Warriors',
        homeScore: 112,
        awayScore: 108
      }
    ]);
  }

  // ========== QUIZ (SIEMPRE MOCK) ==========
  getQuizQuestions(): Observable<QuizQuestion[]> {
    return of([
      {
        id: 1,
        question: '¿Cuántos campeonatos NBA tienen los Lakers?',
        options: ['15', '16', '17', '18'],
        correctAnswer: 2,
        category: 'teams',
        difficulty: 'medium',
        explanation: 'Los Lakers han ganado 17 campeonatos.'
      }
    ]);
  }
}
