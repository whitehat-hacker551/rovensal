import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { LoginHijo } from '../login-hijo/login-hijo';
import { DinoSelector } from '../dino-selector/dino-selector';
import { Dino } from '../../model/dinoInterface';
import { DinoServ } from '../../services/dino-serv';
import { FavoritosService } from '../../services/favoritos.service';

/**
 * Componente de menú de navegación para la sección Calinescu.
 * Proporciona navegación entre rutas y gestiona el login mediante ventana emergente.
 * Implementa comunicación bidireccional con el componente padre (CalinescuComponent).
 * Componente no enrutado, reutilizable.
 */
@Component({
  selector: 'app-menu',
  imports: [RouterLink],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu {
  /** Router inyectado para detectar cambios de navegación */
  private oRouter = inject(Router);
  
  /** Lista de dinosaurios disponibles */
  dinos: Dino[] = [];
  
  /** Servicio MatDialog para abrir ventanas emergentes */
  private dialog = inject(MatDialog);
  
  /** Servicio de favoritos inyectado */
  favoritosService = inject(FavoritosService);
  
  /** URL de la ruta actualmente activa, usada para resaltar el link del menú */
  activeRoute: string = '';
  
  /**
   * @Input - Recibe el nombre del usuario logueado desde CalinescuComponent (padre).
   * Permite mostrar información del usuario en el menú.
   */
  @Input() usuarioActual: string | null = null;
  
  /**
   * @Output - Emite los datos del login hacia CalinescuComponent (padre).
   * Implementa comunicación bidireccional hijo → padre mediante EventEmitter.
   */
  @Output() loginRealizado = new EventEmitter<{nombre: string, email: string, dinoFav: string}>();

  /**
   * Constructor del componente.
   * Configura un listener para detectar cambios de navegación
   * y actualizar la ruta activa para el resaltado del menú.
   */
  constructor(private oDinoService: DinoServ) {
    // obtener la ruta activa a partir del router
    this.oRouter.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.activeRoute = event.url;
      }
    });
  }
  ngOnInit(){
  this.getDinos();
  }

  getDinos(){
    this.oDinoService.getAllDinos().subscribe((dinos:Dino[]) => {
      this.dinos = dinos;
    });
  }

  /**
   * Abre una ventana emergente (MatDialog) con el formulario de login.
   * Pasa datos al diálogo (usuarioActual) y recibe los datos del formulario al cerrar.
   * Implementa comunicación bidireccional con ventana emergente.
   * Al recibir los datos del login, los emite al componente padre.
   * @returns void
   * @example
   * // Desde el template
   * <button (click)="abrirLoginModal()">Iniciar Sesión</button>
   */
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
  /**
   * Abre una ventana emergente (MatDialog) con el selector de dinosaurios.
   * Permite al usuario seleccionar dinosaurios para añadir a favoritos.
   * Pasa la lista de dinosaurios disponibles al diálogo.
   * Solo disponible para usuarios logueados.
   * @returns void
   * @example
   * // Desde el template
   * <button (click)="abrirSelectorDinos()">Añadir a favoritos</button>
   */
  abrirSelectorDinos(){
    const dialogRef = this.dialog.open(DinoSelector, {
      width: '1000px',
      height: '700px',
      maxWidth: '95vw',
      data: {
        dinosaurios: this.dinos
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.success) {
        console.log('✅ Dinosaurio añadido a favoritos:', result.dino.Name);
        // Aquí podrías mostrar un mensaje de éxito al usuario
      } else if (result && !result.success) {
        console.log('⚠️ ' + result.message);
        // Aquí podrías mostrar el mensaje de que ya está en favoritos
      }
    });
  }
}
