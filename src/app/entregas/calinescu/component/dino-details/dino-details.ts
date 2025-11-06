import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DinoServ } from '../../services/dino-serv';
import { Dino } from '../../model/dinoInterface';

@Component({
  selector: 'app-dino-details',
  imports: [CommonModule, RouterLink],
  templateUrl: './dino-details.html',
  styleUrl: './dino-details.css',
  standalone: true
})
export class DinoDetails {
  nombreDino: string | null = null;
  dino: Dino | undefined;

  constructor(private route: ActivatedRoute, private dinoServ: DinoServ) {}

  ngOnInit() {
    // Leer el parámetro de la URL
    this.nombreDino = this.route.snapshot.paramMap.get('nombre');
    
    if (this.nombreDino) {
      this.getDinoDetails(this.nombreDino);
    }
  }

  getDinoDetails(name: string) {
    this.dinoServ.getDinoDescription(name).subscribe(dinoDetails => {
      console.log('Detalles recibidos de Wikipedia:', dinoDetails);
      // Crear el objeto Dino con los detalles de Wikipedia
      this.dino = {
        Name: name,
        Description: '',
        extract: dinoDetails.extract,
        thumbnail: dinoDetails.thumbnail
      };
      console.log('Dino cargado:', this.dino);
    });
  }
}
