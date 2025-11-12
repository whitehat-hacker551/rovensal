import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ApiCallService } from '../../services/api-call-service';
import { Products, Product } from '../../model/productsInterface';
import { ProductListComponent } from '../productListComponent/productListComponent';
import { ActivatedRoute } from '@angular/router'
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-catolog-page',
  imports: [MatButtonModule, MatIconModule, ProductListComponent, FormsModule, MatSlideToggleModule, MatFormFieldModule, MatSelectModule, MatInputModule],
  templateUrl: './catalogPageComponent.html',
  styleUrl: './catalogPageComponent.css',
  standalone: true
})
export class CatalogPageComponent {

  terminoBusqueda: string | null = '';
  terminoBusquedaSubmit: string | null = '';
  isChecked: boolean = false;

  categoriaSeleccionada: string | null = null;
  products: Product[] = [];

  constructor(private apiCall: ApiCallService, private route: ActivatedRoute){ }

  ngOnInit(){
    this.getProducts();
    this.buscarProductosRouted();
    this.terminoBusquedaSubmit = this.terminoBusqueda
  }

  getProducts(){
    this.apiCall.getProducts().subscribe((products: Products) =>{
      this.products = products.products;
    })
  }

  buscarProductos(){
    this.terminoBusqueda = this.terminoBusquedaSubmit;
  }

  buscarProductosRouted(){
    this.route.queryParamMap.subscribe(params => {
      this.terminoBusqueda = params.get('busqueda');
    })
  }
  filtrarDinamico(){
    this.terminoBusqueda = this.terminoBusquedaSubmit;
  }

  clearSelection() {
    this.categoriaSeleccionada = null;
  }

}
