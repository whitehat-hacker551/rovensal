/**
 * COMPONENTE RANKING - PÁGINA DE VOTACIÓN TOP 10 NBA
 * 
 *
 * Funciones principales:
 * - Mostrar los 10 mejores jugadores NBA actuales con fotos reales
 * - Permitir votar por el jugador favorito
 * - Mostrar resultados de votación en tiempo real
 * - Carrusel interactivo para navegar entre jugadores
 * - Modal (ventana emergente) para confirmar votos
 */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VoteModalComponent } from '../vote-modal/vote-modal.component';
import { PlayerVote } from '../../model';

@Component({
  selector: 'app-ranking',      // Nombre para usar en HTML: <app-ranking>
  standalone: true,             // Componente independiente
  imports: [CommonModule, VoteModalComponent], // Usa el modal de votación
  templateUrl: './ranking.component.html',     // Su archivo HTML
  styleUrls: ['./ranking.component.css']       // Su archivo de estilos
})
export class RankingComponent {
  title = 'Top 10 NBA - Vota por tu Favorito';  // Título de la página
  
  // Control del modal de votación
  showVoteModal = false;                // ¿Está abierto el modal?
  selectedPlayer: PlayerVote | null = null; // ¿Qué jugador se seleccionó para votar?
  
  // Control del carrusel de jugadores
  currentPlayerIndex = 0;               // ¿Qué jugador se está mostrando?

  // BASE DE DATOS LOCAL - Los 10 mejores jugadores NBA actuales
  // Cada jugador tiene su foto oficial de NBA.com
  players: PlayerVote[] = [
    {
      id: 1,
      name: 'LeBron James',              // "El Rey" - Leyenda viviente
      team: 'Los Angeles Lakers',
      position: 'Forward',
      image: 'https://cdn.nba.com/headshots/nba/latest/1040x760/2544.png',
      votes: 0
    },
    {
      id: 2,
      name: 'Stephen Curry',             // "Chef Curry" - Mejor tirador 3pts de la historia
      team: 'Golden State Warriors',
      position: 'Guard',
      image: 'https://cdn.nba.com/headshots/nba/latest/1040x760/201939.png',
      votes: 0
    },
    {
      id: 3,
      name: 'Jayson Tatum',             // Joven estrella de Boston
      team: 'Boston Celtics',
      position: 'Forward',
      image: 'https://cdn.nba.com/headshots/nba/latest/1040x760/1628369.png',
      votes: 0
    },
    {
      id: 4,
      name: 'Luka Dončić',              // "Luka Magic" - Genio europeo
      team: 'Dallas Mavericks',
      position: 'Guard',
      image: 'https://cdn.nba.com/headshots/nba/latest/1040x760/1629029.png',
      votes: 0
    },
    {
      id: 5,
      name: 'Giannis Antetokounmpo',
      team: 'Milwaukee Bucks',
      position: 'Forward',
      image: 'https://cdn.nba.com/headshots/nba/latest/1040x760/203507.png',
      votes: 0
    },
    {
      id: 6,
      name: 'Nikola Jokić',
      team: 'Denver Nuggets',
      position: 'Center',
      image: 'https://cdn.nba.com/headshots/nba/latest/1040x760/203999.png',
      votes: 0
    },
    {
      id: 7,
      name: 'Kevin Durant',
      team: 'Phoenix Suns',
      position: 'Forward',
      image: 'https://cdn.nba.com/headshots/nba/latest/1040x760/201142.png',
      votes: 0
    },
    {
      id: 8,
      name: 'Joel Embiid',
      team: 'Philadelphia 76ers',
      position: 'Center',
      image: 'https://cdn.nba.com/headshots/nba/latest/1040x760/203954.png',
      votes: 0
    },
    {
      id: 9,
      name: 'Anthony Davis',
      team: 'Los Angeles Lakers',
      position: 'Forward/Center',
      image: 'https://cdn.nba.com/headshots/nba/latest/1040x760/203076.png',
      votes: 0
    },
    {
      id: 10,
      name: 'Damian Lillard',
      team: 'Milwaukee Bucks',
      position: 'Guard',
      image: 'https://cdn.nba.com/headshots/nba/latest/1040x760/203081.png',
      votes: 0
    }
  ];

  totalVotes = 0;

  // Getter para el jugador actual del carrusel
  get currentPlayer(): PlayerVote | undefined {
    return this.players[this.currentPlayerIndex];
  }

  ngOnInit() {
    this.loadVotes();
  }

  // Métodos del carrusel
  previousPlayer() {
    if (this.currentPlayerIndex > 0) {
      this.currentPlayerIndex--;
    }
  }

  nextPlayer() {
    if (this.currentPlayerIndex < this.players.length - 1) {
      this.currentPlayerIndex++;
    }
  }

  goToPlayer(index: number) {
    this.currentPlayerIndex = index;
  }

  openVoteModal(player: PlayerVote) {
    this.selectedPlayer = player;
    this.showVoteModal = true;
  }

  closeVoteModal() {
    this.showVoteModal = false;
    this.selectedPlayer = null;
  }

  onVoteConfirmed(playerId: number) {
    const player = this.players.find(p => p.id === playerId);
    if (player) {
      player.votes++;
      this.totalVotes++;
      this.saveVotes();
    }
    this.closeVoteModal();
  }

  get topVoted(): PlayerVote | undefined {
    if (this.players.length === 0) return undefined;
    return this.players.reduce((max, player) =>
      player.votes > max.votes ? player : max);
  }

  get sortedPlayers(): PlayerVote[] {
    return [...this.players].sort((a, b) => b.votes - a.votes);
  }

  resetVotes() {
    this.players.forEach(player => player.votes = 0);
    this.totalVotes = 0;
    this.saveVotes();
  }

  private saveVotes() {
    const votesData = {
      players: this.players,
      totalVotes: this.totalVotes
    };
    localStorage.setItem('nba-vote-ranking', JSON.stringify(votesData));
  }

  private loadVotes() {
    const savedData = localStorage.getItem('nba-vote-ranking');
    if (savedData) {
      const votesData = JSON.parse(savedData);
      this.players = votesData.players || this.players;
      this.totalVotes = votesData.totalVotes || 0;
    }
  }
}