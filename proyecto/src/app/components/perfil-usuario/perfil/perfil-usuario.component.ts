import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuariosService } from '../../../services/usuarios.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Usuario } from '../../../models/usuario';
import { Libro } from '../../../models/libro';
import { LibrosUsuarioService } from '../../../services/libros-usuario.service';
import { LibrosService } from '../../../services/libros.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PublicacionesService } from '../../../services/publicaciones.service';
import { ReseniasService } from '../../../services/resenias.service';
import { forkJoin } from 'rxjs';
import { EstrellasPipe } from '../../../pipes/estrellas.pipe';
import { FormatoFechaPipe } from '../../../pipes/fecha.pipe';
import { AuthService } from '../../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil-usuario',
  imports: [
    CommonModule,
    RouterLink,
    TranslateModule,
    EstrellasPipe,
    FormatoFechaPipe,
  ],
  templateUrl: './perfil-usuario.component.html',
  styles: ``,
})
export class PerfilUsuarioComponent {
  //variables de usuarios
  usuario: any = null;
  perfilPropio?: boolean;
  sigueAlUsuario?: boolean;
  cantidadSeguidos: number = 0;
  cantidadSeguidores: number = 0;

  //variables de libros
  idsLibrosGuardados: any[] = [];
  libro: any = null;
  librosGuardados: any[] = [];
  librosUsuarios: any[] = [];
  aLibros: any[] = [];
  quieroLeer: any[] = [];
  leyendo: any[] = [];
  leidos: any[] = [];

  //variables de publicaciones y reseñas
   publicacionesResenias: any[] = [];
   publicacionesPaginadas: any[] = []; 
   paginaActual: number = 1;
   publicacionesPorPagina: number = 10;
   totalPaginas: number = 0;

  private ruta = inject(ActivatedRoute);
  private servicioUsuarios = inject(UsuariosService);
  private servicioLibrosUsuario = inject(LibrosUsuarioService);
  private servicioLibros = inject(LibrosService);
  private servicioPublicaciones = inject(PublicacionesService);
  private servicioResenias = inject(ReseniasService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private translate = inject(TranslateService);

  idUsuario =
    this.ruta.snapshot.paramMap.get('idUsuario') 

  ngOnInit() {
    this.getUsuario(); //obtiene el usuario
    this.llenarArrayLibrosSegunUsuario(); //llena el array de libros con los libros guardados por el usuario
    this.sigueUsuario(); //comprobar si el usuario registrado sigue a este usuario
    this.getSeguidores();
    this.getSeguidos();
    this.ObtenerPublicacionesYResenias();
  }

  //obtención del usuario
  getUsuario = () => {
    if (this.idUsuario) {
      this.servicioUsuarios.getUsuario(this.idUsuario).subscribe({
        next: (data) => {
          this.usuario = data; //almacena los detalles del usuario
          this.perfilPropio = false;
          console.log(this.usuario); // Ver en consola los detalles del usuario
        },
      });
    } else {
      this.servicioUsuarios.getUsuario().subscribe({
        next: (data) => {
          this.usuario = data; //almacena los detalles del usuario
          this.perfilPropio = true;
          console.log(this.usuario); // Ver en consola los detalles del usuario
        },
      });
    }
  };
  getSeguidores = () => {
    if (this.idUsuario) {
      this.servicioUsuarios.getSeguidores(Number(this.idUsuario)).subscribe({
        next: (data) => {
          const aSeguidores = data; //almacena los seguidores del usuario
          this.cantidadSeguidores = aSeguidores.length; //almacena la cantidad de seguidores
        },
      });
    } else {
      this.servicioUsuarios.getSeguidores().subscribe({
        next: (data) => {
          const aSeguidores = data; //almacena los seguidores del usuario
          this.cantidadSeguidores = aSeguidores.length; //almacena la cantidad de seguidores
        },
      });
    }
  };
  getSeguidos = () => {
    if (this.idUsuario) {
      this.servicioUsuarios.getSeguidos(Number(this.idUsuario)).subscribe({
        next: (data) => {
          const aSeguidos = data; //almacena los Seguidos del usuario
          this.cantidadSeguidos = aSeguidos.length; //almacena la cantidad de Seguidos
        },
      });
    } else {
      this.servicioUsuarios.getSeguidos().subscribe({
        next: (data) => {
          const aSeguidos = data; //almacena los Seguidos del usuario
          this.cantidadSeguidos = aSeguidos.length; //almacena la cantidad de Seguidos
        },
      });
    }
  };
  //comprobar si el usuario registrado sigue a este usuario
  sigueUsuario = () => {
    if (this.idUsuario) {
      this.servicioUsuarios.getSeguidos(Number(this.idUsuario)).subscribe({
        next: (data) => {
          const aSeguidos = data; //almacena los usuarios seguidos por el usuario
          console.log('seguidos', aSeguidos);
          aSeguidos.forEach((seguido) => {
            console.log('seguido', seguido);
            if (seguido.id_usuario === Number(this.idUsuario)) {
              this.sigueAlUsuario = true; //si el usuario sigue al usuario mostrado en el perfil
            } else {
              this.sigueAlUsuario = false; //si el usuario no sigue al usuario mostrado en el perfil
            }
          });
        },
      });
    } else {
      this.servicioUsuarios.getSeguidos().subscribe({
        next: (data) => {
          const aSeguidos = data; //almacena los usuarios seguidos por el usuario
          console.log('seguidos', aSeguidos);
          aSeguidos.forEach((seguido) => {
            console.log('seguido', seguido);
            if (seguido.id_usuario === this.authService.getUsuario().id_usuario) {
              this.sigueAlUsuario = true; //si el usuario sigue al usuario mostrado en el perfil
            } else {
              this.sigueAlUsuario = false; //si el usuario no sigue al usuario mostrado en el perfil
            }
          });
        },
      });
    }
  };

  seguir = () => {
    this.servicioUsuarios.seguirUsuario(Number(this.idUsuario)).subscribe({
      next: (data) => {
        Swal.fire({
          toast: true,
          position: 'top-start',
          icon: 'success',
          title: this.translate.instant('perfil.alert_seguir_exito'),
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
        console.log(data); // Ver en consola la respuesta del servidor
        this.sigueAlUsuario = true; //actualiza el estado de seguimiento
      },
      error: (error) => {
        Swal.fire({
          toast: true,
          position: 'top-start',
          icon: 'error',
          title: this.translate.instant('perfil.alert_seguir_error'),
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
        console.error('Error al seguir al usuario:', error);
      },
    });
  };

  dejarSeguir = () => {
    if (this.idUsuario) {
      this.servicioUsuarios.dejarDeSeguir(Number(this.idUsuario)).subscribe({
        next: (data) => {
          Swal.fire({
            toast: true,
            position: 'top-start',
            icon: 'success',
            title: this.translate.instant('perfil.alert_dejar_seguir_exito'),
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
          console.log(data); // Ver en consola la respuesta del servidor
          this.sigueAlUsuario = false; //actualiza el estado de seguimiento
        },
        error: (error) => {
          Swal.fire({
            toast: true,
            position: 'top-start',
            icon: 'error',
            title: this.translate.instant('perfil.alert_dejar_seguir_error'),
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
          console.error('Error al dejar de seguir al usuario:', error);
        },
      });
    }
  };

  //redirije a la pagina de edicion del perfil
  editarPerfil = () => {
    this.router.navigate(['/app/editar-perfil', this.usuario.id_usuario]);
  };

  llenarArrayLibros = () => {
    const librosTemp: any[] = [];
    let totalCargados = 0;

    // Recorre cada id y hace la petición del libro por separado
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
              return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
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
      });
    });
  };

  llenarArrayLibrosSegunUsuario = () => {
    if (this.idUsuario) {
      this.servicioLibrosUsuario.getLibrosUsuario(this.idUsuario).subscribe({
        next: (data) => {
          this.librosUsuarios = data;
          this.llenarArrayLibros();
        },
        error: (err) => {
          console.error('Error al obtener libro por ID:', err);
        },
      });
    } else {
      this.servicioLibrosUsuario.getLibrosUsuario().subscribe({
        next: (data) => {
          this.librosUsuarios = data;
          this.llenarArrayLibros();
        },
        error: (err) => {
          console.error('Error al obtener libro por ID:', err);
        },
      });
    }
  };

  //Dirigir a los libros guardados
  redirigirLibrosGuardados(tipo: string) {
    let idUsuario: number;
    if(!this.idUsuario) {
       idUsuario = this.authService.getUsuario().id_usuario;
    }else{
      idUsuario = Number(this.idUsuario);
    }   
    if (tipo === 'quiero leer') {
      this.servicioLibrosUsuario.setLibros(this.quieroLeer);
    }
    if (tipo === 'leyendo') {
      this.servicioLibrosUsuario.setLibros(this.leyendo);
    }
    if (tipo === 'leidos') {
      this.servicioLibrosUsuario.setLibros(this.leidos);
    }
    if( this.idUsuario) {
    this.router.navigate(['app/libros-guardados', idUsuario]);
    }else{
      this.router.navigate(['app/libros-guardados']);
    }
  }

  //publicaciones y reseñas
  ObtenerPublicacionesYResenias() {
    let idUsuario: number;
    if(!this.idUsuario) {
       idUsuario = this.authService.getUsuario().id_usuario;
    }else{
      idUsuario = Number(this.idUsuario);
    }    
    const publicaciones$ = this.servicioPublicaciones.getPublicacionesUsuario(
      idUsuario
    );
    const resenias$ = this.servicioResenias.getReseniasPorUsuarioId(
      idUsuario
    );

    forkJoin([publicaciones$, resenias$]).subscribe({
      next: ([publicaciones, resenias]) => {
        const publicacionesConTipo = publicaciones.map((pub) => ({
          ...pub,
          tipo: 'publicacion',
          fecha: pub.fecha_publicacion
        }));

        const reseniasConTipo = resenias.map((resenia) => ({
          ...resenia,
          tipo: 'resenia',
        }));

        this.publicacionesResenias = [
          ...publicacionesConTipo,
          ...reseniasConTipo,
        ];

        // Ordenar por fecha descendente
        this.publicacionesResenias.sort(
          (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
        );
this.actualizarPaginacion(); //prepara el array de publicaciones paginadas

        console.log(this.publicacionesResenias); // Ver en consola
      },
      error: (err) => {
        console.error('Error al obtener publicaciones o reseñas:', err);
      },
    });
  }

  //funciones para paginacion de reseñas y publicaciones
  //metodos para la paginacion de las reseñas y publicaciones
  actualizarPaginacion() {
    this.totalPaginas = Math.ceil(
      this.publicacionesResenias.length / this.publicacionesPorPagina
    );
    const inicio = (this.paginaActual - 1) * this.publicacionesPorPagina;
    const fin = inicio + this.publicacionesPorPagina;
    this.publicacionesPaginadas = this.publicacionesResenias.slice(inicio, fin);
  }

  cambiarPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
      this.actualizarPaginacion();
    }
  }


  // Método para llevar al club correspondiente
  redirigirClub(id: Number) {
    this.router.navigate(['/app/club', id]); // Navegar a la pagina del club
  }
}
