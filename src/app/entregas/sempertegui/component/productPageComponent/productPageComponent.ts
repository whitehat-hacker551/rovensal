import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiCallService } from '../../services/api-call-service';
import { Product } from '../../model/productsInterface';
import { MatIcon } from '@angular/material/icon';
import { RouterModule } from '@angular/router'
import { DatePipe } from '@angular/common'

@Component({
  selector: 'app-product-page',
  imports: [RouterModule, MatIcon, DatePipe],
  templateUrl: './productPageComponent.html',
  styleUrl: './productPageComponent.css',
})
export class ProductPageComponent {

  id: number | null = null;
  product: Product = {} as Product;
  rating: number = 3.5;


  constructor(private route: ActivatedRoute, private apiCall: ApiCallService){
    this.id = Number(this.route.snapshot.params['id'])
  }

  ngOnInit(){
    this.getProductById();
  }

  getProductById(){
    this.apiCall.getProductById(this.id).subscribe({
      next: (product: Product) => this.product = product,
      error: err => console.error(err),
      complete: () => console.log("Los datos han llegado")
    })
  }

  
}
