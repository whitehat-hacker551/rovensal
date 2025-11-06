import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DinoServ } from '../../services/dino-serv';
import { Dino } from '../../model/dinoInterface';

@Component({
  selector: 'app-dino-component',
  imports: [RouterLink],
  templateUrl: './dino-component.html',
  styleUrl: './dino-component.css',
})
export class DinoComponent {
 
  constructor(private dinoServ:DinoServ) { }
  dinos :Dino[] = [];  
  selectedDino:Dino | undefined
  
  ngOnInit(){
    this.getDinos();
  }

  getDinos(){
   this.dinoServ.getAllDinos().subscribe(dinos => {
         this.dinos = dinos;
    }); 
  }

  getDinoDetails(name: string){
    this.dinoServ.getDinoDescription(name).subscribe(dinoDetails => {
      console.log('Detalles recibidos de Wikipedia:', dinoDetails);
      // Buscar el dinosaurio por nombre
      const dino = this.dinos.find(d => d.Name === name);
      if (dino) {
        // Añadir los detalles de Wikipedia al dinosaurio
        dino.extract = dinoDetails.extract;
        dino.thumbnail = dinoDetails.thumbnail;
        this.selectedDino = dino;
        console.log('Dino actualizado:', this.selectedDino);
      }
    });
  }
  irADinoDetails() {
    window.location.href = 'dino-details/' + this.selectedDino?.Name;
  }
}
