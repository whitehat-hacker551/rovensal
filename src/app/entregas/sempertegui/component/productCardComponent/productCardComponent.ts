import { Component, Input, inject } from '@angular/core';
import { Product } from '../../model/productsInterface';
import { ProductDialogComponent } from '../productDialogComponent/productDialogComponent'
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-product-card',
  imports: [RouterModule, MatButtonModule],
  templateUrl: './productCardComponent.html',
  styleUrls: ['./productCardComponent.css'],
})
export class ProductCardComponent {

  @Input() product: Product = {} as Product;
  readonly dialog = inject(MatDialog);

  constructor(private router: Router){
  }

  verProducto(product: Product){

    this.dialog.open(ProductDialogComponent, {
      height: '400px', //300
      width: '400px',   //400
      data : product,
    })
  }

  goToProductPage(){
    this.router.navigate(['sempertegui/catalog', this.product.id])

  }

}
