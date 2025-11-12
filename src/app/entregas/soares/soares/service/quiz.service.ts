/**
 * SERVICIO QUIZ - LÓGICA DEL JUEGO DE PREGUNTAS NBA
 * 
 * Este servicio es como el "cerebro" del juego de preguntas NBA.
 * Se encarga de toda la lógica: llevar puntuación, cambiar preguntas,
 * verificar respuestas y manejar el estado del quiz.
 * 
 * Es como tener un "maestro de ceremonias" que dirige el juego
 * y mantiene todo organizado mientras el usuario juega.
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { QuizQuestion, QuizResult } from '../model/nba-data.model';
import { NbaDataService } from './nba-data.service';

@Injectable({
  providedIn: 'root'  // Disponible en toda la aplicación
})
export class QuizService {
  // "Transmisores de estado" - mantienen información actualizada
  private currentQuestionIndexSubject = new BehaviorSubject<number>(0);  // ¿En qué pregunta vamos?
  private scoreSubject = new BehaviorSubject<number>(0);                 // ¿Cuántos puntos tenemos?
  private questionsSubject = new BehaviorSubject<QuizQuestion[]>([]);    // ¿Qué preguntas estamos usando?
  private resultsSubject = new BehaviorSubject<QuizResult[]>([]);        // ¿Cómo hemos respondido?
  private isQuizActiveSubject = new BehaviorSubject<boolean>(false);     // ¿Está el quiz activo?

  // "Canales públicos" - otros componentes pueden "escuchar" estos cambios
  public readonly currentQuestionIndex$ = this.currentQuestionIndexSubject.asObservable();
  public readonly score$ = this.scoreSubject.asObservable();
  public readonly questions$ = this.questionsSubject.asObservable();
  public readonly results$ = this.resultsSubject.asObservable();
  public readonly isQuizActive$ = this.isQuizActiveSubject.asObservable();

  constructor(private nbaDataService: NbaDataService) {
    // Necesitamos el servicio de datos para obtener las preguntas
  }

  /**
   * INICIAR UN NUEVO QUIZ
   * Prepara todo para una nueva partida: resetea puntuación, carga preguntas, etc.
   */
  async startQuizAsync(): Promise<void> {
    try {
      const questionsObservable = this.nbaDataService.getQuizQuestions();
      const questions = await new Promise<QuizQuestion[]>((resolve, reject) => {
        questionsObservable.subscribe({
          next: resolve,
          error: reject
        });
      });

      // Mezclar preguntas aleatoriamente
      const shuffled = this.shuffleArray([...questions]);
      this.questionsSubject.next(shuffled);
      this.currentQuestionIndexSubject.next(0);
      this.scoreSubject.next(0);
      this.resultsSubject.next([]);
      this.isQuizActiveSubject.next(true);
    } catch (error) {
      console.error('Error starting quiz:', error);
      throw error;
    }
  }

  /**
   * Iniciar quiz (método legacy para compatibilidad)
   */
  startQuiz(): void {
    this.nbaDataService.getQuizQuestions().subscribe(questions => {
      const shuffled = this.shuffleArray([...questions]);
      this.questionsSubject.next(shuffled);
      this.currentQuestionIndexSubject.next(0);
      this.scoreSubject.next(0);
      this.resultsSubject.next([]);
      this.isQuizActiveSubject.next(true);
    });
  }

  /**
   *  tipado fuerte
   */
  answerQuestion(selectedAnswerIndex: number, timeSpent: number = 0): boolean {
    const questions = this.questionsSubject.value;
    const currentIndex = this.currentQuestionIndexSubject.value;
    const currentQuestion = questions[currentIndex];

    if (!currentQuestion) {
      console.error('No current question available');
      return false;
    }

    const isCorrect = selectedAnswerIndex === currentQuestion.correctAnswer;
    const result: QuizResult = {
      questionId: currentQuestion.id,
      selectedAnswer: selectedAnswerIndex,
      isCorrect: isCorrect,
      timeSpent: timeSpent
    };

    // Agregar resultado
    const results = this.resultsSubject.value;
    this.resultsSubject.next([...results, result]);

    // Actualizar puntuación
    if (isCorrect) {
      this.scoreSubject.next(this.scoreSubject.value + 1);
    }

    return isCorrect;
  }

  /**
   * Pasar a la siguiente pregunta
   */
  nextQuestion(): boolean {
    const currentIndex = this.currentQuestionIndexSubject.value;
    const questions = this.questionsSubject.value;

    if (currentIndex + 1 < questions.length) {
      this.currentQuestionIndexSubject.next(currentIndex + 1);
      return true;
    } else {
      // Quiz terminado
      this.endQuiz();
      return false;
    }
  }

  /**
   * Terminar el quiz
   */
  endQuiz(): void {
    this.isQuizActiveSubject.next(false);
  }

  /**
   * Obtener la pregunta actual con tipado seguro
   */
  getCurrentQuestion(): QuizQuestion | null {
    const questions = this.questionsSubject.value;
    const currentIndex = this.currentQuestionIndexSubject.value;
    return questions[currentIndex] || null;
  }

  /**
   * Obtener el porcentaje de aciertos
   */
  getScorePercentage(): number {
    const results = this.resultsSubject.value;
    if (results.length === 0) return 0;
    const correct = results.filter(r => r.isCorrect).length;
    return Math.round((correct / results.length) * 100);
  }

  /**
   * Obtener estadísticas del quiz
   */
  getQuizStats(): {
    totalQuestions: number;
    correctAnswers: number;
    incorrectAnswers: number;
    percentage: number;
    averageTime: number;
  } {
    const results = this.resultsSubject.value;
    const correct = results.filter(r => r.isCorrect).length;
    const total = results.length;
    const averageTime = total > 0 
      ? results.reduce((sum, r) => sum + r.timeSpent, 0) / total 
      : 0;

    return {
      totalQuestions: total,
      correctAnswers: correct,
      incorrectAnswers: total - correct,
      percentage: this.getScorePercentage(),
      averageTime: Math.round(averageTime)
    };
  }

  /**
   * Reiniciar el quiz
   */
  resetQuiz(): void {
    this.currentQuestionIndexSubject.next(0);
    this.scoreSubject.next(0);
    this.questionsSubject.next([]);
    this.resultsSubject.next([]);
    this.isQuizActiveSubject.next(false);
  }

  /**
   * Verificar si es la última pregunta
   */
  isLastQuestion(): boolean {
    const questions = this.questionsSubject.value;
    const currentIndex = this.currentQuestionIndexSubject.value;
    return currentIndex >= questions.length - 1;
  }

  /**
   * Obtener progreso del quiz
   */
  getProgress(): { current: number; total: number; percentage: number } {
    const questions = this.questionsSubject.value;
    const current = this.currentQuestionIndexSubject.value + 1;
    const total = questions.length;
    const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

    return { current, total, percentage };
  }

  /**
   * Mezclar un array aleatoriamente (Fisher-Yates) con tipado genérico
   */
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}