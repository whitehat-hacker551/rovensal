import { Component, inject } from '@angular/core';
import { Product } from '../../model/productsInterface'
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';

@Component({
  selector: 'app-product-dialog',
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule],
  templateUrl: './productDialogComponent.html',
  styleUrls: ['./productDialogComponent.css'],
})
export class ProductDialogComponent {

  data: Product = inject(MAT_DIALOG_DATA)

  ngOnInit(){
    console.log(this.data)
  }
}
