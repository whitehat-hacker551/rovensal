// Modelos para datos NBA usados en Soares

export interface Team {
  id: number;
  name: string;
  city: string;
  conference: 'East' | 'West';
  division: string;
  championships: number;
  founded: number;
  logo: string;
  players: Player[];
}

export interface Player {
  id: number;
  name: string;
  team: string;
  teamLogo: string;
  pointsPerGame: number;
  assistsPerGame: number;
  jerseyNumber: number;
  isAllStar: boolean;
}

export interface Game {
  id: number;
  date: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
  difficulty: string;
  explanation: string;
}

export interface GameFilters {
  date?: string;
  season?: number;
}
