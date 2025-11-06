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
export class CalinescuComponent {}
