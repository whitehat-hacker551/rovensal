import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { LoginHijo } from '../login-hijo/login-hijo';

@Component({
  selector: 'app-menu',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu {
  private oRouter = inject(Router);
  private dialog = inject(MatDialog);
  
  activeRoute: string = '';
  
  // @Input - Recibe el usuario actual desde CalinescuComponent (padre)
  @Input() usuarioActual: string | null = null;
  
  // @Output - Emite los datos del login hacia CalinescuComponent (padre)
  @Output() loginRealizado = new EventEmitter<{nombre: string, email: string}>();

  constructor() {
    // obtener la ruta activa a partir del router
    this.oRouter.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.activeRoute = event.url;
      }
    });
  }

  // Método que abre el modal de LoginHijo
  abrirLoginModal() {
    const dialogRef = this.dialog.open(LoginHijo, {
      width: '500px',
      disableClose: false,
      data: { usuarioActual: this.usuarioActual } // Pasar usuario actual al modal
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Emitir al padre (CalinescuComponent)
        this.loginRealizado.emit(result);
      }
    });
  }
}
