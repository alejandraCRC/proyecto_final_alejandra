import { Component, inject } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Club } from '../../models/club';
import { Usuario } from '../../models/usuario';
import { ClubsService } from '../../services/clubs.service';
import { Libro } from '../../models/libro';
import { LibrosUsuarioService } from '../../services/libros-usuario.service';
import { LibrosService } from '../../services/libros.service';
import { PublicacionesService } from '../../services/publicaciones.service';
import { ReseniasService } from '../../services/resenias.service';
import { UsuariosService } from '../../services/usuarios.service';
import { AuthService } from '../../services/auth.service';
import { EstrellasPipe } from '../../pipes/estrellas.pipe';
import { FormatoFechaPipe } from '../../pipes/fecha.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule, EstrellasPipe, FormatoFechaPipe, TranslateModule],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  //variables

  public aClubs: any[] = [];
  public aUsuarios: Usuario[] = [];
  public publicacionesResenias: any[] = [];

  // libros
  librosUsuarios: any[] = [];
  libro: any = null;
  aLibros: any[] = [];
  quieroLeer: any[] = [];
  leyendo: any[] = [];
  leidos: any[] = [];

  private servicioClubs = inject(ClubsService);
  private servicioLibrosUsuario = inject(LibrosUsuarioService);
  private servicioLibros = inject(LibrosService);
  private servicioPublicaciones = inject(PublicacionesService);
  private servicioUsuarios = inject(UsuariosService);
  private servicioResenias = inject(ReseniasService);
  private authService = inject(AuthService);

  private router = inject(Router);
  private ruta = inject(ActivatedRoute);

  idUsuario: number =
    this.ruta.snapshot.params['idUsuario'] ||
    this.authService.getUsuario()?.id_usuario; // Obtiene el ID del usuario actual

  ngOnInit() {
    this.mostrarClubs();
    this.mostrarLibrosUsuario();
    this.getIdsLibros(); //obtiene los libros guardados por el usuario
    this.llenarArrayLibros(); //llena el array de libros con los libros guardados por el usuario
    this.ObtenerPublicacionesYResenias(); //obtiene las publicaciones y reseñas de los usuarios seguidos
  }

  /**
   * @description Muestra los clubs a los que pertenece el usuario
   */
  private mostrarClubs() {
    this.servicioClubs.getClubsUsuario().subscribe({
      next: (data) => {
        this.aClubs = data; //almacena las Clubs en el array de Clubs
        console.log(this.aClubs);
      },
      error: (err) => {
        console.log(err.message);
      },
    });
  }

  // Método para llevar al club correspondiente
  redirigirClub(id: Number) {
    this.router.navigate(['/app/club', id]); // Navegar a la pagina del club
  }

  private mostrarLibrosUsuario() {
    this.servicioLibrosUsuario.getLibrosUsuario().subscribe({
      next: (data) => {
        this.aLibros = data; //almacena los libros en el array de libros
        console.log(this.aLibros);
      },
      error: (err) => {
        console.log(err.message);
      },
    });
  }
  //obtencion de los libros guardados por el usuario
  getIdsLibros = () => {
    this.servicioLibrosUsuario.getLibrosUsuario().subscribe({
      next: (data) => {
        this.librosUsuarios = data; //almacena los libros guardados por el usuario
        console.log(this.librosUsuarios);
      },
    });
  };
  //obtiene el libro por id
  getLibroPorId = (idLibro: string) => {
    this.servicioLibros.obtenerLibroPorId(idLibro).subscribe((res: any) => {
      this.libro = res; // Almacena los detalles del libro
      console.log(this.libro); // Ver en consola los detalles del libro
    });
  };

  llenarArrayLibros = () => {
    this.servicioLibrosUsuario.getLibrosUsuario().subscribe({
      next: (data) => {
        this.librosUsuarios = data;
        const librosTemp: any[] = [];
        let totalCargados = 0;

        // Recorrer cada id y hacer la petición del libro por separado
        this.librosUsuarios.forEach((item, index, array) => {
          this.servicioLibros.obtenerLibroPorId(item.id_libro).subscribe({
            next: (libro) => {
              librosTemp.push({
                //crea un objeto con los datos de libro y del objeto item y lo almacena en el array temporal
                ...libro,
                estado: item.estado,
                fecha: item.fecha,
              });

              totalCargados++;

              // Cuando todos los libros estén cargados
              if (totalCargados === array.length) {
                // Ordena por fecha
                librosTemp.sort((a, b) => {
                  return (
                    new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
                  );
                });

                this.aLibros = librosTemp;

                // Filtra los tres más recientes por estado
                this.quieroLeer = librosTemp
                  .filter((l) => l.estado === 'quiero leer')
                  .slice(0, 3);
                this.leyendo = librosTemp
                  .filter((l) => l.estado === 'leyendo')
                  .slice(0, 3);
                this.leidos = librosTemp
                  .filter((l) => l.estado === 'leido')
                  .slice(0, 3);
              }
            },
            error: (err) => {
              console.error('Error al obtener libro por ID:', err);
            },
          });
        });
      },
      error: (err) => {
        console.error('Error al obtener IDs de libros:', err);
      },
    });
  };

  //Dirigir a los libros guardados
  redirigirLibrosGuardados(tipo: string) {
    if (tipo === 'quiero leer') {
      this.servicioLibrosUsuario.setLibros(this.quieroLeer);
    }
    if (tipo === 'leyendo') {
      this.servicioLibrosUsuario.setLibros(this.leyendo);
    }
    if (tipo === 'leidos') {
      this.servicioLibrosUsuario.setLibros(this.leidos);
    }
    this.router.navigate(['app/libros-guardados']);
  }

  //publicaciones y reseñas

  ObtenerPublicacionesYResenias() {
    this.servicioUsuarios.getSeguidos(this.idUsuario).subscribe({
      next: (seguidos) => {
        const idsSeguidos = seguidos.map((u) => Number(u.id_usuario));

        const publicaciones$ = forkJoin(
          idsSeguidos.map((id) =>
            this.servicioPublicaciones.getPublicacionesUsuario(id)
          )
        );

        const resenias$ = forkJoin(
          idsSeguidos.map((id) =>
            this.servicioResenias.getReseniasPorUsuarioId(id)
          )
        );

        forkJoin([publicaciones$, resenias$]).subscribe({
          next: ([publicacionesArray, reseniasArray]) => {
            // Flatten arrays y agregar tipo
            const publicaciones = publicacionesArray.flat().map((pub) => ({
              ...pub,
              tipo: 'publicacion',
            }));

            const resenias = reseniasArray.flat().map((resenia) => ({
              ...resenia,
              tipo: 'resenia',
            }));

            this.publicacionesResenias = [...publicaciones, ...resenias];

            // Ordena por fecha descendente
            this.publicacionesResenias.sort(
              (a, b) =>
                new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
            );
            console.log(this.publicacionesResenias); // Ver en consola las publicaciones y reseñas
          },
          error: (err) => {
            console.error('Error al obtener publicaciones o reseñas:', err);
          },
        });
      },
      error: (err) => {
        console.error('Error al obtener usuarios seguidos:', err);
      },
    });
  }

  //Método para redirigir al perfil del usuario
  redirigirPerfil(id: number) {
    this.router.navigate(['/app/perfil', id]); // Navegar a la ruta de detalle pasando el ID
  }

  crearClub(){
    this.router.navigate(['/app/form-club']);
  }


}
