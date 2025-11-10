import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { Menu } from '../menu/menu';
import { DinoServ } from '../../services/dino-serv';
import { Dino } from '../../model/dinoInterface';
import { FavoritosService } from '../../services/favoritos.service';
import { filter } from 'rxjs';

/**
 * Componente principal de la sección Calinescu.
 * Gestiona el estado del usuario logueado, su dinosaurio favorito,
 * y controla la visibilidad del contenido según la ruta activa.
 * Actúa como componente padre que contiene el menú y las rutas hijas.
 */
@Component({
  selector: 'app-calinescu',
  imports: [Menu, RouterOutlet, RouterLink],
  templateUrl: './calinescuComponent.html',
  styleUrl: './calinescuComponent.css',
  standalone: true
})
export class CalinescuComponent {
  /** Nombre del usuario que ha iniciado sesión, null si no hay sesión activa */
  usuarioLogueado: string | null = null;
  
  /** Objeto Dino con toda la información del dinosaurio favorito del usuario */
  dinoFavorito: Dino | undefined;
  
  /** Nombre del dinosaurio favorito seleccionado por el usuario */
  nombreDinoFav: string | null = null;
  
  /** Flag que controla si se muestra el bloque del dinosaurio favorito según la ruta */
  mostrarDinoFavorito: boolean = true;
  
  /** Lista completa de dinosaurios para estadísticas */
  totalDinosaurios: number = 0;
  
  /** Dinosaurios destacados para mostrar en la página de inicio */
  dinosauriosDestacados: Dino[] = [];

  /**
   * Constructor del componente.
   * Inyecta el servicio de dinosaurios y el router.
   * Configura un listener para detectar cambios de navegación y controlar
   * la visibilidad del dinosaurio favorito solo en la ruta raíz /calinescu.
   * @param dinoServ - Servicio para obtener información de dinosaurios desde APIs
   * @param router - Router de Angular para detectar cambios de navegación
   * @param favoritosService - Servicio para gestionar favoritos
   */
  constructor(
    private dinoServ: DinoServ, 
    private router: Router,
    public favoritosService: FavoritosService
  ) {
    // Escuchar cambios de ruta para controlar visibilidad del dino favorito
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Solo mostrar el dino favorito si estamos en la ruta exacta /calinescu
      this.mostrarDinoFavorito = event.url === '/calinescu';
    });
    
    // Cargar estadísticas y dinosaurios destacados
    this.cargarDatosInicio();
  }

  /**
   * Recibe los datos del login desde el componente hijo Menu.
   * Almacena el nombre del usuario y el dinosaurio favorito seleccionado,
   * y luego busca la información completa del dinosaurio.
   * Implementa comunicación bidireccional padre-hijo mediante @Output.
   * @param datos - Objeto con nombre, email y dinosaurio favorito del usuario
   * @param datos.nombre - Nombre completo del usuario
   * @param datos.email - Correo electrónico del usuario
   * @param datos.dinoFav - Nombre del dinosaurio favorito seleccionado
   * @example
   * // Desde el template con event binding
   * <app-menu (loginRealizado)="recibirLogin($event)"></app-menu>
   */
  recibirLogin(datos: {nombre: string, email: string, dinoFav: string}) {
    this.usuarioLogueado = datos.nombre;
    this.nombreDinoFav = datos.dinoFav;
    console.log('Usuario logueado:', datos);
    
    // Buscar el dinosaurio favorito completo
    this.buscarDinosaurioFavorito(datos.dinoFav);
  }

  /**
   * Busca y carga la información completa del dinosaurio favorito desde Wikipedia.
   * Realiza una petición asíncrona a la API de Wikipedia y construye
   * el objeto Dino con toda la información disponible.
   * @param nombreDino - Nombre del dinosaurio a buscar (ej: "Tyrannosaurus")
   * @returns void - El resultado se almacena en la propiedad dinoFavorito
   * @example
   * this.buscarDinosaurioFavorito('Velociraptor');
   * // Después de la respuesta, this.dinoFavorito contendrá los datos
   */
  buscarDinosaurioFavorito(nombreDino: string) {
    // Obtener detalles directamente de Wikipedia con el nombre
    this.dinoServ.getDinoDescription(nombreDino).subscribe(detalles => {
      this.dinoFavorito = {
        Name: nombreDino,
        Description: '', // Wikipedia no devuelve description, solo extract
        extract: detalles.extract,
        thumbnail: detalles.thumbnail
      };
      console.log('Dinosaurio favorito cargado:', this.dinoFavorito);
    });
  }
  
  /**
   * Carga los datos iniciales para la página de inicio:
   * - Total de dinosaurios disponibles
   * - Dinosaurios destacados aleatorios
   */
  cargarDatosInicio() {
    this.dinoServ.getAllDinos().subscribe(dinos => {
      this.totalDinosaurios = dinos.length;
      
      // Seleccionar 4 dinosaurios aleatorios para destacados
      this.dinosauriosDestacados = this.obtenerDinosAleatorios(dinos, 4);
    });
  }
  
  /**
   * Obtiene un número específico de dinosaurios aleatorios de una lista.
   * @param dinos - Array de dinosaurios completo
   * @param cantidad - Cantidad de dinosaurios a obtener
   * @returns Array con dinosaurios seleccionados aleatoriamente
   */
  obtenerDinosAleatorios(dinos: Dino[], cantidad: number): Dino[] {
    const shuffled = [...dinos].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, cantidad);
  }
  
  /**
   * Cierra la sesión del usuario actual.
   * Limpia todos los datos del usuario logueado y del dinosaurio favorito.
   * También limpia los favoritos del servicio.
   * Redirige a la página de inicio de Calinescu.
   */
  cerrarSesion() {
    this.usuarioLogueado = null;
    this.nombreDinoFav = null;
    this.dinoFavorito = undefined;
    this.favoritosService.limpiarFavoritos();
    
    // Redirigir a la página de inicio después de cerrar sesión
    this.router.navigate(['/calinescu']);
    
    console.log('Sesión cerrada');
  }
}
