/**
 * MODELOS DE DATOS NBA - DEFINICIONES DE QUÉ INFORMACIÓN MANEJAMOS
 * 
 * Aquí definimos la "forma" que tienen todos los datos de nuestra app NBA
 * Es como tener fichas técnicas que nos dicen qué información debe tener
 * cada jugador, equipo, partido, etc.
 */

// JUGADOR NBA - Toda la info que guardamos de cada jugador
export interface Player {
  id: number;           // Número único del jugador
  name: string;         // Nombre completo
  team: string;         // Equipo al que pertenece
  teamLogo: string;     // Logo del equipo
  pointsPerGame: number;     // Puntos que anota por partido
  assistsPerGame: number;    // Asistencias que da por partido
  jerseyNumber: number;      // Número de camiseta
  isAllStar: boolean;        // Si es jugador All-Star o no
}

// EQUIPO NBA - Información completa de cada equipo
export interface Team {
  id: number;              // Número único del equipo
  name: string;            // Nombre del equipo (ej: Lakers)
  city: string;            // Ciudad donde juega (ej: Los Angeles)
  conference: 'East' | 'West';  // Conferencia Este u Oeste
  division: string;        // División dentro de la conferencia
  championships: number;   // Cuántos campeonatos ha ganado
  founded: number;         // Año en que se fundó el equipo
  logo: string;           // Logo del equipo
  players: Player[];      // Lista de todos sus jugadores
}

// PARTIDO NBA - Información de cada juego
export interface Game {
  id: number;        // Número único del partido
  date: string;      // Fecha cuando se jugó
  homeTeam: string;  // Equipo que juega en casa
  awayTeam: string;  // Equipo visitante
  homeScore: number; // Puntos del equipo local
  awayScore: number; // Puntos del equipo visitante
}

// PREGUNTA DEL QUIZ - Cada pregunta del juego
export interface QuizQuestion {
  id: number;           // Número único de la pregunta
  question: string;     // El texto de la pregunta
  options: string[];    // Las 4 opciones de respuesta
  correctAnswer: number; // Cuál es la respuesta correcta (0,1,2,3)
  category: 'teams' | 'records' | 'players' | 'history' | 'rules'; // Tema de la pregunta
  difficulty: 'easy' | 'medium' | 'hard'; // Qué tan difícil es
  explanation: string;  // Explicación de por qué esa es la respuesta
}

// FILTROS PARA BUSCAR PARTIDOS - Cómo buscar juegos específicos
export interface GameFilters {
  date?: string;    // Filtrar por fecha (opcional)
  team?: string;    // Filtrar por equipo (opcional)
  season?: number;  // Filtrar por temporada (opcional)
}

// VOTO DE JUGADOR - Para la votación de jugadores favoritos
export interface PlayerVote {
  id: number;       // ID único del jugador
  name: string;     // Nombre del jugador
  team: string;     // Su equipo
  position: string; // Su posición (base, escolta, etc.)
  image: string;    // Foto del jugador
  votes: number;    // Cuántos votos ha recibido
}

// RESULTADO DEL QUIZ - Cómo guardamos las respuestas del usuario
export interface QuizResult {
  questionId: number;    // A qué pregunta respondió
  selectedAnswer: number; // Qué opción eligió
  isCorrect: boolean;    // Si acertó o no
  timeSpent: number;     // Cuánto tiempo tardó en responder
}
