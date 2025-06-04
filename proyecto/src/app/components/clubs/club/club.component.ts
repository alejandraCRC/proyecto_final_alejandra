import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClubsService } from '../../../services/clubs.service';
import { MiembrosClubService } from '../../../services/club-miembros.service';
import { PublicacionesService } from '../../../services/publicaciones.service';
import { FormatoFechaPipe } from '../../../pipes/fecha.pipe';
import { UsuariosService } from '../../../services/usuarios.service';
import { PublicacionModalComponent } from '../publicacion-modal/publicacion-modal.component';
import { AñadirComentarioPublicacionModalComponent } from '../añadirComentarioPublicacion-modal/añadirComentarioPublicacion-modal.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import Swal from 'sweetalert2';
import { LibrosService } from '../../../services/libros.service';
import { LibrosUsuarioService } from '../../../services/libros-usuario.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-club',
  imports: [
    CommonModule,
    FormatoFechaPipe,
    PublicacionModalComponent,
    AñadirComentarioPublicacionModalComponent,
    TranslateModule,
  ],
  templateUrl: './club.component.html',
  styles: ``,
})
export class ClubComponent {
  public club: any = null;
  public lecturaActual: any = null;
  public leido_lecturaActual: boolean = false;
  public libro: any = null;

  //variables para usuario y miembros
  public creador: any = null;
  public usuario: any = null;
  public miembros: any[] = [];
  public usuarioEsMiembro: boolean = false;
  public usuarioEsAdministrador: boolean = false;

  //variables para modal
  public mostrarModalPublicacion: boolean = false;
  public mostrarModalComentarioPublicacion: boolean = false;

  //variables para publicaciones y paginacion
  public publicaciones: any[] = [];
  public publicacionesPaginadas: any[] = []; // Las publicaciones que se muestran
  public paginaActual: number = 1;
  public publicacionesPorPagina: number = 10;
  public totalPaginas: number = 0;
  public publicacionSeleccionada: any = null;

  //manejar rutas
  private ruta = inject(ActivatedRoute);
  private router = inject(Router);
  //servicios
  private servicioClubs = inject(ClubsService);
  private servicioMiembrosClub = inject(MiembrosClubService);
  private servicioPublicaciones = inject(PublicacionesService);
  private servicioLibros = inject(LibrosService);
  private servicioLibrosUsuario = inject(LibrosUsuarioService);
  private servicioUsuarios = inject(UsuariosService);
  private servicioAuth = inject(AuthService);
  private translate = inject(TranslateService);

  ngOnInit() {
    this.usuario = this.servicioAuth.getUsuario();
    const idClub = this.ruta.snapshot.paramMap.get('idClub'); // Obtener el ID del libro desde la URL
    if (idClub) {
      this.servicioClubs
        .obtenerClubPorId(Number(idClub))
        .subscribe((data: any) => {
          this.club = data[0]; // Almacena los detalles del club
          console.log(this.club); // Ver en consola los detalles del club
          this.obtenerCreador();
          this.getMiembros();
          this.getPublicaciones();
          this.comprobarFechaFinalLectura();
        });
    }
  }

  //funciones para publicaciones
  getPublicaciones() {
    this.servicioPublicaciones
      .getPublicacionesClub(this.club.id_club)
      .subscribe((data: any[]) => {
        data.forEach((publi) => {
          this.servicioPublicaciones
            .getComentariosPublicacion(publi.id_publicacion)
            .subscribe((comentarios: any[]) => {
              publi.comentarios = comentarios;
              publi.mostrarComentarios = false; // por defecto no se muestran los comentarios
            });
        });
        this.publicaciones = data; //almacena las publicaciones en el array de publicaciones

        this.actualizarPaginacion(); //prepara el array de publicaciones paginadas
        this.obtenerLecturaActual();
      });
  }

  // modal publicacion
  cerrarModalPublicacion() {
    //controla el cierre del modal
    this.mostrarModalPublicacion = false;
  }

  // Método para manejar el guardado de la publicacion
  recibirPublicacion(titulo: string, contenido: string) {
    const id_club = Number(this.ruta.snapshot.paramMap.get('idClub'));

    const nuevaPublicacion = {
      id_club,
      titulo: titulo,
      contenido: contenido,
      fecha_publicacion: new Date(),
    };

    this.servicioPublicaciones
      .guardarPublicacion(
        nuevaPublicacion.id_club,
        nuevaPublicacion.titulo,
        nuevaPublicacion.contenido,
        nuevaPublicacion.fecha_publicacion
      )
      .subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: this.translate.instant('club.publicacion_guardada'),
            text: this.translate.instant('club.publicacion_guardada_texto'),
            toast: true,
            position: 'top-start',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
          console.log('Publicacion guardada');
          this.cerrarModalPublicacion();
        },
        error: (err) => console.error('Error al guardar Publicacion:', err),
      });
  }

  //eliminar publicacion
  eliminarPublicacion(id_publicacion: number) {
    Swal.fire({
      title: this.translate.instant('club.alert_seguro_eliminar_publicacion'),
      text: this.translate.instant('club.alert_texto_eliminar_publicacion'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: this.translate.instant('sweetAlert.confirmar_eliminar'),
      cancelButtonText: this.translate.instant('sweetAlert.cancelar'),
    }).then((result) => {
      if (result.isConfirmed) {
        // Solo si el usuario confirma, se hace la petición
        this.servicioPublicaciones
          .eliminarPublicacion(id_publicacion)
          .subscribe({
            next: () => {
              console.log('Publicación eliminada');
              this.getPublicaciones(); // Actualiza las publicaciones
            },
            error: (err) =>
              console.error('Error al eliminar la publicación:', err),
          });
      }
    });
  }

  // modal comentario publicacion
  cerrarModalComentarioPublicacion() {
    //controla el cierre del modal
    this.mostrarModalComentarioPublicacion = false;
    this.publicacionSeleccionada = null; // Reinicia la publicacion seleccionada
  }

  abrirModalComentario(publicacion: any) {
    this.publicacionSeleccionada = publicacion;
  }

  // Método para manejar el guardado de la publicacion
  recibirComentarioPublicacion(contenido: string, id_publicacion: number) {
    const nuevoComentario = {
      id_publicacion: id_publicacion,
      contenido: contenido,
      fecha_comentario: new Date(),
    };
    console.log(nuevoComentario);
    this.servicioPublicaciones
      .guardarComentarioPublicacion(
        nuevoComentario.id_publicacion,
        nuevoComentario.contenido,
        nuevoComentario.fecha_comentario
      )
      .subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: this.translate.instant('club.comentario_guardado'),
            text: this.translate.instant('club.comentario_guardado_texto'),
            toast: true,
            position: 'top-start',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
          console.log('Comentario enviado');
          this.cerrarModalPublicacion();
        },
        error: (err) => console.error('Error al guardar el comentario:', err),
      });
  }

  eliminarComentario(id_comentario: number) {
    Swal.fire({
      title: this.translate.instant('club.alert_seguro_eliminar_comentario'),
      text: this.translate.instant('club.alert_texto_eliminar_comentario'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: this.translate.instant('sweetAlert.confirmar_eliminar'),
      cancelButtonText: this.translate.instant('sweetAlert.cancelar'),
    }).then((result) => {
      if (result.isConfirmed) {
        // Solo si el usuario confirma, se hace la petición
        this.servicioPublicaciones
          .eliminarComentarioPublicacion(id_comentario)
          .subscribe({
            next: () => {
              console.log('Comentario eliminado');
              this.getPublicaciones(); // Actualiza las publicaciones
            },
            error: (err) =>
              console.error('Error al eliminar el comentario:', err),
          });
      }
    });
  }


  //funciones para paginacion de publicaciones
  //metodos para la paginacion de las publicaciones
  actualizarPaginacion() {
    this.totalPaginas = Math.ceil(
      this.publicaciones.length / this.publicacionesPorPagina
    );
    const inicio = (this.paginaActual - 1) * this.publicacionesPorPagina;
    const fin = inicio + this.publicacionesPorPagina;
    this.publicacionesPaginadas = this.publicaciones.slice(inicio, fin);
  }

  cambiarPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
      this.actualizarPaginacion();
    }
  }

  //funciones para miembros
  getMiembros() {
    this.servicioMiembrosClub
      .getMiembrosClub(this.club.id_club)
      .subscribe((data: any) => {
        console.log(data);
        this.miembros = data; //almacena los miembros en el array de miembros
        this.ComprobarUsuarioEsAdministrador();
        this.ComprobarUsuarioEsMiembro();
      });
  }

  obtenerCreador() {
    this.servicioUsuarios
      .getUsuario(this.club.id_creador)
      .subscribe((data: any) => {
        this.creador = data;
        console.log(this.creador);
      });
  }

  ComprobarUsuarioEsMiembro() {
    // Verifica si el usuario es miembro del club
    console.log('miembros', this.miembros);
    if (
      this.miembros.some(
        (miembro) => miembro.id_miembro === this.usuario.id_usuario
      )
    ) {
      this.usuarioEsMiembro = true; // El usuario es miembro del club
    } else {
      this.usuarioEsMiembro = false; // El usuario no es miembro del club
    }
  }

  ComprobarUsuarioEsAdministrador() {
    // Verifica si el usuario tiene rol de 'admin'
    console.log('id', this.usuario.id_usuario);
    const miembro = this.miembros.find(
      (miembro) => miembro.id_miembro === this.usuario.id_usuario
    );
    console.log('miembro', miembro);
    if (miembro && miembro.rol === 'administrador') {
      this.usuarioEsAdministrador = true;
    } else {
      this.usuarioEsAdministrador = false;
    }
    console.log('admin', this.usuarioEsAdministrador);
  }

  unirseClub() {
    const id_club = this.club.id_club;

    this.servicioMiembrosClub
      .unirseClub(id_club, this.usuario.id_usuario)
      .subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: this.translate.instant('club.unido_exito'),
            text: this.translate.instant('club.unido_exito_texto'),
            toast: true,
            position: 'top-start',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
          console.log('Usuario se ha unido al club');
          this.getMiembros(); // Actualiza la lista de miembros
        },
        error: (err) => console.error('Error al unirse al club:', err),
      });
  }

  dejarClub() {
    const id_club = this.club.id_club;
    this.servicioMiembrosClub
      .salirClub(id_club, this.usuario.id_usuario)
      .subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: this.translate.instant('club.salido_exito'),
            text: this.translate.instant('club.salido_exito_texto'),
            toast: true,
            position: 'top-start',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
          console.log('Usuario ha salido del club');
          this.getMiembros(); // Actualiza la lista de miembros
        },
        error: (err) => console.error('Error al salir del club:', err),
      });
  }

  //funciones para el club
  editarClub() {
    this.router.navigate(['/app/form-club', this.club.id_club]);
  }

  eliminarClub() {
    Swal.fire({
      title: this.translate.instant('club.alert_seguro_eliminar'),
      text: this.translate.instant('club.alert_texto_eliminar'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: this.translate.instant('sweetAlert.confirmar_eliminar'),
      cancelButtonText: this.translate.instant('sweetAlert.cancelar'),
      // confirmButtonText: 'Sí, eliminar',
      // cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        // Solo si el usuario confirma, se hace la petición
        this.servicioClubs.eliminarClub(this.club.id_club).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: this.translate.instant('club.eliminado'),
              text: this.translate.instant('club.eliminado_texto'),
              toast: true,
              position: 'top-start',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
            });
            this.router.navigate(['/app/clubs']); // Redirige tras eliminar
          },
          error: (err) => {
            console.error('Error al eliminar club', err);
            Swal.fire({
              icon: 'error',
              title: this.translate.instant('club.titulo_error'),
              text: this.translate.instant('club.texto_error'),
              toast: true,
              position: 'top-start',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
            });
          },
        });
      }
    });
  }

  //funciones de lectura actual
  obtenerLecturaActual() {
    this.servicioClubs.getLecturaActual(this.club.id_club).subscribe({
      next: (data) => {
        this.lecturaActual = data[0];
        if (this.lecturaActual) {
          console.log('lectura actual', this.lecturaActual);
          this.servicioLibros
            .obtenerLibroPorId(this.lecturaActual.id_libro)
            .subscribe((res: any) => {
              this.libro = res; // Almacena los detalles del libro
              this.comprobarLeidoLecturaActual();
            });
        }
      },
    });
  }

  crearLecturaActual() {
    this.router.navigate(['/app/lectura-actual', this.club.id_club]);
  }

  comprobarFechaFinalLectura() {
    //solo si existe la lectura actual
    if (this.lecturaActual) {
      const fechaHoy = new Date();
      const fechaFin = new Date(this.lecturaActual.fecha_fin);

      if (fechaFin <= fechaHoy) {
        this.finalizarLecturaActual();
      }
    }
  }

  finalizarLecturaActual() {
    this.servicioClubs.finalizarLecturaActual(this.club.id_club).subscribe({
      next: () => {
        console.log('Lectura actual eliminada por llegar a su fecha fin');
        this.crearPulicacionAutomática();
      },
    });
  }

  crearPulicacionAutomática() {
    // Crear publicación automáticamente
    const publicacionAutomatica = {
      id_club: this.club.id_club,
      titulo: '¡Lectura Finalizada!',
      contenido: `La lectura del libro "${
        this.libro?.volumeInfo?.title || 'libro'
      }" ha finalizado ¡Esperamos que la hayas disfrutado!`,
      fecha_publicacion: new Date(),
    };

    this.servicioPublicaciones
      .guardarPublicacion(
        publicacionAutomatica.id_club,
        publicacionAutomatica.titulo,
        publicacionAutomatica.contenido,
        publicacionAutomatica.fecha_publicacion
      )
      .subscribe({
        next: () => {
          console.log('Publicación automática creada');
          this.getPublicaciones();
        },
        error: (err) =>
          console.error('Error al crear la publicación automática:', err),
      });
  }

  confirmarGuardarLibro(): void {
  Swal.fire({
    title: this.translate.instant('club.pregunta_guardar_libro'),
    text: this.translate.instant('club.pregunta_guardar_libro_texto'),
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: this.translate.instant('sweetAlert.confirmar_guardar'),
    cancelButtonText: this.translate.instant('sweetAlert.cancelar'),
  }).then((result) => {
    if (result.isConfirmed) {
      this.navegarADetalleLibro();
    }
  });
}

navegarADetalleLibro(): void {
  if (this.libro?.id) {
    this.router.navigate(['/app/libro', this.libro.id]);
  } else {
    console.error('Libro no definido o sin ID');
    Swal.fire({
      icon: 'error',
      title: this.translate.instant('sweetAlert.error'),
      text: this.translate.instant('club.error_libro_no_definido'),
    });
  }
}

comprobarLeidoLecturaActual(): void {
  this.servicioLibrosUsuario.getLibrosUsuario().subscribe({
    next: (data) => {
      this.leido_lecturaActual = data.some(
        (libro: any) => libro.id_libro === this.libro?.id
      );
    },
    error: (err) => {
      console.error('Error al obtener libros del usuario:', err);
      Swal.fire({
        icon: 'error',
        title: this.translate.instant('sweetAlert.error'),
        text: this.translate.instant('club.error_obtener_libros_usuario'),
      });
    },
  });
}

marcarComoLeido(): void {
  if (!this.leido_lecturaActual && this.club?.id_club) {
    this.servicioClubs.actualizarLecturaActual(this.club.id_club).subscribe({
      next: () => {
        this.confirmarGuardarLibro(); // Abre diálogo para guardar
      },
      error: (err) => {
        console.error('Error al marcar como leído:', err);
        Swal.fire({
          icon: 'error',
          title: this.translate.instant('sweetAlert.error'),
          text: this.translate.instant('club.error_marcar_leido'),
        });
      },
    });
  }
}


  //Método para redirigir al perfil del usuario
  redirigirPerfil(id: number) {
    this.router.navigate(['/app/perfil', id]); // Navegar a la ruta de detalle pasando el ID
  }
}
