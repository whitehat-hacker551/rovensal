import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Menu } from '../menu/menu';

@Component({
  selector: 'app-calinescu',
  imports: [Menu, RouterOutlet],
  templateUrl: './calinescuComponent.html',
  styleUrl: './calinescuComponent.css',
  standalone: true
})
export class CalinescuComponent {
  // Almacena el nombre del usuario logueado
  usuarioLogueado: string | null = null;

  // Método que recibe los datos del login desde el Menu (hijo)
  recibirLogin(datos: {nombre: string, email: string}) {
    this.usuarioLogueado = datos.nombre;
    console.log('Usuario logueado:', datos);
  }
}
