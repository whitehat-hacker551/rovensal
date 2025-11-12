import { Component, Input, SimpleChanges} from '@angular/core';
import { Products, Product } from '../../model/productsInterface';
import { ApiCallService } from '../../services/api-call-service';
import { ProductCardComponent } from '../productCardComponent/productCardComponent';

@Component({
  selector: 'app-product-list',
  imports: [ProductCardComponent],
  templateUrl: './productListComponent.html',
  styleUrls: ['./productListComponent.css'],
})
export class ProductListComponent {

  @Input() terminoBusqueda: string | null = '';
  @Input() categoriaSeleccionada: string | null = '';
  products: Product[] = [];

  constructor(private apiCall: ApiCallService){ }

  ngOnInit(){
    this.getProducts();
  }

  ngOnChanges(changes: SimpleChanges){
    if(changes['terminoBusquedaSubmit']){
      this.ProductosFiltrados;
    }
  }

  getProducts(){
    this.apiCall.getProducts().subscribe((products: Products) =>{
      this.products = products.products;
    })
  }

get ProductosFiltrados(): Product[] {
  return this.products.filter(p => {

    const coincideBusqueda = this.terminoBusqueda
      ? p.title.toLowerCase().includes(this.terminoBusqueda.toLowerCase())
      : true;

    const coincideCategoria = this.categoriaSeleccionada
      ? p.category === this.categoriaSeleccionada
      : true;

    return coincideBusqueda && coincideCategoria;
  });
}


}
