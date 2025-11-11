import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  imports: [FormsModule],
  templateUrl: './homePageComponent.html',
  styleUrl: './homePageComponent.css',
})
export class HomePageComponent {
  
  terminoBusqueda: string = '';

  constructor(private router: Router) { }

  buscarProductosRouted(){
    if(this.terminoBusqueda.trim()){
      this.router.navigate(['sempertegui/catalog'], {
        queryParams: { busqueda: this.terminoBusqueda }
      })
    }
  }

}
