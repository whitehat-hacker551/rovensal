/**
 * COMPONENTE QUIZ - JUEGO DE PREGUNTAS NBA
 * 
 * Este componente es como un "examen divertido" sobre conocimientos de NBA.
 * Los usuarios pueden probar qué tanto saben sobre baloncesto respondiendo
 * preguntas sobre equipos, jugadores, historia y récords.
 * 
 * Funciones principales:
 * - Mostrar preguntas aleatorias de una base de datos
 * - Llevar puntuación del usuario
 * - Dar retroalimentación inmediata (correcto/incorrecto)
 * - Mostrar explicaciones de las respuestas
 * - Permitir reiniciar el quiz para jugar de nuevo
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbaDataService } from '../../service/nba-data.service';
import { QuizQuestion } from '../../model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-quiz',      // Nombre para usar en HTML: <app-quiz>
  standalone: true,          // Componente independiente
  imports: [CommonModule],   // Solo necesita funcionalidades básicas
  templateUrl: './quiz.component.html', // Su archivo HTML
  styleUrl: './quiz.component.css'      // Su archivo de estilos
})
export class QuizComponent  {
  // Base de datos de preguntas
  allQuestions: QuizQuestion[] = [];     // Todas las preguntas disponibles
  questions: QuizQuestion[] = [];        // Preguntas seleccionadas para esta partida
  
  // Estado actual del quiz
  currentQuestionIndex: number = 0;      // ¿En qué pregunta vamos?
  currentQuestion: QuizQuestion | null = null; // La pregunta actual
  selectedAnswer: number | null = null;  // ¿Qué opción eligió el usuario?
  score: number = 0;                     // Puntuación acumulada
  
  // Estados de la interfaz
  isQuizActive: boolean = false;         // ¿Está el quiz en curso?
  showFeedback: boolean = false;         // ¿Mostramos si acertó o no?
  feedbackMessage: string = '';          // Mensaje de retroalimentación
  isCorrect: boolean = false;            // ¿La respuesta fue correcta?
  isQuizCompleted: boolean = false;      // ¿Terminó el quiz?

  // Control de limpieza de memoria
  private destroy$ = new Subject<void>();
  
  // Configuración del quiz
  private readonly QUIZ_QUESTIONS_COUNT = 5;    // Solo 5 preguntas por partida
  private readonly TOTAL_QUESTIONS_POOL = 10;   // 10 preguntas en total disponibles

  constructor(private nbaDataService: NbaDataService) {
    // Servicio para obtener las preguntas NBA
  }

  // Se ejecuta cuando se carga la página del quiz
  ngOnInit(): void {
    console.log('Quiz component initialized');
    this.loadQuestions();
  }

  // Se ejecuta cuando se sale de la página (limpieza)
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // CARGAR PREGUNTAS DESDE EL SERVICIO
  loadQuestions(): void {
    this.nbaDataService.getQuizQuestions()
      .pipe(takeUntil(this.destroy$)) // Se cancela automáticamente al salir
      .subscribe({
        next: (questions: QuizQuestion[]) => {
          this.allQuestions = questions;
          if (questions.length > 0) {
            console.log('Questions loaded:', questions.length);
          }
        },
        error: (err: Error) => {
          console.error('Error loading questions:', err);
        }
      });
  }

  /**
   * Mezcla array usando algoritmo Fisher-Yates con expresión regular para validación
   */
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    const randomPattern = /^\d+$/; // Expresión regular para validar números
    
    for (let i = shuffled.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      
      // Validar que el índice sea válido usando regex
      if (randomPattern.test(randomIndex.toString()) && randomIndex <= i) {
        [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
      }
    }
    return shuffled;
  }

  /**
   * Selecciona 5 preguntas aleatorias de las 10 disponibles
   */
  private selectRandomQuestions(): QuizQuestion[] {
    if (this.allQuestions.length === 0) return [];
    
    const shuffled = this.shuffleArray(this.allQuestions);
    return shuffled.slice(0, this.QUIZ_QUESTIONS_COUNT);
  }

  startQuiz(): void {
    this.questions = this.selectRandomQuestions();
    this.isQuizActive = true;
    this.isQuizCompleted = false;
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.currentQuestion = this.questions[0] || null;
    this.selectedAnswer = null;
    this.showFeedback = false;
  }

  selectAnswer(answerIndex: number): void {
    if (this.showFeedback) return;
    this.selectedAnswer = answerIndex;
    this.submitAnswer();
  }

  submitAnswer(): void {
    if (this.selectedAnswer === null || !this.currentQuestion) return;

    this.isCorrect = this.selectedAnswer === this.currentQuestion.correctAnswer;
    
    if (this.isCorrect) {
      this.score++;
      this.feedbackMessage = '¡Correcto! ' + this.currentQuestion.explanation;
    } else {
      this.feedbackMessage = 'Incorrecto. ' + this.currentQuestion.explanation;
    }
    
    this.showFeedback = true;
  }

  nextQuestion(): void {
    this.currentQuestionIndex++;
    
    if (this.currentQuestionIndex < this.questions.length) {
      this.currentQuestion = this.questions[this.currentQuestionIndex];
      this.selectedAnswer = null;
      this.showFeedback = false;
    } else {
      this.completeQuiz();
    }
  }

  completeQuiz(): void {
    this.isQuizCompleted = true;
    this.isQuizActive = false;
  }

  resetQuiz(): void {
    this.isQuizCompleted = false;
    this.isQuizActive = false;
  }

  get totalQuestions(): number {
    return this.questions.length;
  }

  get progressPercentage(): number {
    return this.totalQuestions > 0 ? (this.currentQuestionIndex / this.totalQuestions) * 100 : 0;
  }

  getScorePercentage(): number {
    return this.totalQuestions > 0 ? Math.round((this.score / this.totalQuestions) * 100) : 0;
  }

  getOptionLetter(index: number): string {
    return String.fromCharCode(65 + index);
  }
}