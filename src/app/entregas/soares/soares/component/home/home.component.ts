/**
 * COMPONENTE HOME - LA PÁGINA PRINCIPAL DE NUESTRA WEB NBA
 * 
 * 
 * Funciones principales:
 * - Mostrar un mensaje de bienvenida atractivo
 * - Presentar los mejores jugadores de la temporada actual
 * - Ofrecer accesos rápidos a las secciones más populares
 * - Crear una primera impresión genial de nuestra web NBA
 */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { NbaDataService } from '../../service/nba-data.service';
import { PlayerVote } from '../../model';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-home',       // Nombre para usar en HTML: <app-home>
  standalone: true,           // Componente independiente
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './home.component.html', // Su archivo HTML
  styleUrl: './home.component.css'      // Su archivo de estilos
})
export class HomeComponent  {
  // Lista de los mejores jugadores para mostrar en la portada
  topPlayers: PlayerVote[] = [];

  // Base de datos local con los 6 mejores jugadores NBA actuales
  // Cada jugador tiene foto real de la NBA oficial
  private rankingPlayers: PlayerVote[] = [
    {
      id: 1,
      name: 'LeBron James',              // El Rey - leyenda viviente
      team: 'Los Angeles Lakers',
      position: 'Forward',
      image: 'https://cdn.nba.com/headshots/nba/latest/1040x760/2544.png',
      votes: 0
    },
    {
      id: 2,
      name: 'Stephen Curry',             // El mejor tirador de 3 puntos de la historia
      team: 'Golden State Warriors',
      position: 'Guard',
      image: 'https://cdn.nba.com/headshots/nba/latest/1040x760/201939.png',
      votes: 0
    },
    {
      id: 3,
      name: 'Jayson Tatum',             // Joven estrella de los Celtics
      team: 'Boston Celtics',
      position: 'Forward',
      image: 'https://cdn.nba.com/headshots/nba/latest/1040x760/1628369.png',
      votes: 0
    },
    {
      id: 4,
      name: 'Luka Dončić',              // Genio europeo del baloncesto
      team: 'Dallas Mavericks',
      position: 'Guard',
      image: 'https://cdn.nba.com/headshots/nba/latest/1040x760/1629029.png',
      votes: 0
    },
    {
      id: 5,
      name: 'Giannis Antetokounmpo',    // La Bestia Griega
      team: 'Milwaukee Bucks',
      position: 'Forward',
      image: 'https://cdn.nba.com/headshots/nba/latest/1040x760/203507.png',
      votes: 0
    },
    {
      id: 6,
      name: 'Nikola Jokić',             // El mejor centro actual
      team: 'Denver Nuggets',
      position: 'Center',
      image: 'https://cdn.nba.com/headshots/nba/latest/1040x760/203999.png',
      votes: 0
    }
  ];

  constructor(private nbaDataService: NbaDataService) {
    // Inyectamos el servicio de datos NBA para futuras funcionalidades
  }

  // Se ejecuta cuando se carga la página principal
  ngOnInit(): void {
    this.loadTopPlayers();
  }

  // Carga los mejores jugadores para mostrar en la portada
  private loadTopPlayers(): void {
    // Mostramos los 6 mejores jugadores con sus fotos reales de la NBA
    this.topPlayers = this.rankingPlayers.slice(0, 6);
  }
}
