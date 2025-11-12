import { Component } from '@angular/core';

import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../soares/component/header/header.component';
import { FooterComponent } from '../../soares/component/footer/footer.component';

@Component({
  selector: 'app-soares',
  // ...existing code...
  templateUrl: './soaresComponent.html',
  styleUrl: './soaresComponent.css',
  imports: [RouterOutlet, HeaderComponent, FooterComponent]
})
export class SoaresComponent {}
