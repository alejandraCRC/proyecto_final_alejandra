import { Component, inject } from '@angular/core';
import { LibrosService } from '../../../services/libros.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LibrosUsuarioService } from '../../../services/libros-usuario.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReseniaModalComponent } from '../resenia-modal/resenia-modal.component';
import { ReseniasService } from '../../../services/resenias.service';
import { Resenia } from '../../../models/resenia';
import { EstrellasPipe } from '../../../pipes/estrellas.pipe';
import { FormatoFechaPipe } from '../../../pipes/fecha.pipe';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { UsuariosService } from '../../../services/usuarios.service';

@Component({
  selector: 'app-libros.component',
  imports: [
    CommonModule,
    FormsModule,
    ReseniaModalComponent,
    EstrellasPipe,
    FormatoFechaPipe,
    TranslateModule,
  ],
  templateUrl: './libro.component.html',
  styles: ``,
})
export class LibroComponent {
  //variables
  libro: any = null;
  estadoSeleccionado: string = '';
  mostrarModalResenia: boolean = false;
  datos: { id_libro: string | null; fecha: Date; estado: any } | null = null;
  resenias: Resenia[] = []; // Almacena las reseñas del libro
  ordenSeleccionado: string = 'fecha';
  usuario: any = null; // Almacena el usuario logueado
  //variables de  paginacion
  reseniasPaginadas: any[] = []; 
   paginaActual: number = 1;
   reseniasPorPagina: number = 10;
   totalPaginas: number = 0;

   //srvicios
  private ruta = inject(ActivatedRoute);
  private router = inject(Router);
  private translate = inject(TranslateService);
  private servicioLibros = inject(LibrosService);
  private servicioLibrosUsuario = inject(LibrosUsuarioService);
  private servicioResenia = inject(ReseniasService);
  private servicioUsuarios = inject(UsuariosService);

  ngOnInit(): void {
    this.usuario = this.servicioUsuarios.getUsuario(); // Obtiene el usuario logueado
    console.log('Usuario actual:', this.usuario);
    const idLibro = this.ruta.snapshot.paramMap.get('idLibro'); // Obtener el ID del libro desde la URL
    if (idLibro) {
      this.servicioLibros.obtenerLibroPorId(idLibro).subscribe((res: any) => {
        this.libro = res; // Almacena los detalles del libro
        console.log(this.libro); // Ver en consola los detalles del libro
      });
    }

    this.reseniasDelLibro();
  }


  // Método para manejar el guardado de la reseña
  recibirResenia(resenia: string, calificacion: number) {
    const id_libro = this.ruta.snapshot.paramMap.get('idLibro');
    if (!id_libro) return;

    const nuevaResenia = {
      id_libro,
      resenia: resenia || '',
      calificacion: calificacion || 0,
      fecha: new Date(),
    };

    this.servicioResenia
      .guardarResenia(
        nuevaResenia.id_libro,
        nuevaResenia.calificacion,
        nuevaResenia.resenia,
        nuevaResenia.fecha
      )
      .subscribe({
        next: () => {
          console.log('Reseña guardada');
          this.guardarLibro(); // Llama al método para guardar el libro
          this.cerrarModalResenia();
        },
        error: (err) => console.error('Error al guardar reseña:', err),
      });
  }

  //Método que comprueba si el estado seleccionado es "leído" y muestra el modal de reseña
  CambioDeEstado() {
    //comprueba si el estado seleccionado es "leído" y muestra el modal de reseña
    this.mostrarModalResenia = this.estadoSeleccionado === 'leido';
  }
  //Metodo que controla el cierre del modal
  cerrarModalResenia() {    
    this.mostrarModalResenia = false;
  }
// Método para guardar el libro con el estado seleccionado
  guardarLibro() {
    this.datos = {
      id_libro: this.ruta.snapshot.paramMap.get('idLibro'),
      fecha: new Date(),
      estado: this.estadoSeleccionado,
    };
    console.log('Datos a guardar:', this.datos),
      this.servicioLibrosUsuario
        .guardarLibroUsuario(
          this.datos.id_libro ?? '',
          this.datos.fecha,
          this.datos.estado
        )
        .subscribe({
          next: (respuesta) => {
            Swal.fire({
              toast: true,
              position: 'top-start',
              icon: 'success',
              title: this.translate.instant('libro.alert_guardado_exito'),
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
            });
            console.log('libro guardado:', respuesta);
            // podrías mostrar un mensaje, redirigir, etc.
          },
          error: (error) => {
            Swal.fire({
              toast: true,
              position: 'top-start',
              icon: 'error',
              title: this.translate.instant('libro.alert_guardado_error'),
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
            });
            console.error('Error al guardar libro:', error);
            // aquí podrías mostrar un mensaje de error al usuario
          },
        });
  }
// Método para obtener las reseñas del libro
  reseniasDelLibro() {
    const id_libro = this.ruta.snapshot.paramMap.get('idLibro');
    if (id_libro) {
      this.servicioResenia.getReseniasPorLibroId(id_libro).subscribe({
        next: (data) => {
          this.resenias = data; //rellena el array de reseñas
          this.resenias.sort(
            (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
          ); // Ordenar por fecha
          this.actualizarPaginacion(); // Actualiza la paginación después de obtener las reseñas
        },
        error: (error) => {
          console.error('Error al obtener las reseñas:', error);
        },
      });
    }
  }

    //funciones para paginacion de resenias
  //metodos para la paginacion de las resenias
  actualizarPaginacion() {
    this.totalPaginas = Math.ceil(
      this.resenias.length / this.reseniasPorPagina
    );
    const inicio = (this.paginaActual - 1) * this.reseniasPorPagina;
    const fin = inicio + this.reseniasPorPagina;
    this.reseniasPaginadas = this.resenias.slice(inicio, fin);
  }

  cambiarPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
      this.actualizarPaginacion();
    }
  }

  //metodo para ordenar las reseñas por calificacion
ordenarPorCalificacion(): void {
  if (this.ordenSeleccionado === 'asc') {
    this.resenias.sort((a, b) => a.calificacion - b.calificacion);
  } else if (this.ordenSeleccionado === 'desc') {
    this.resenias.sort((a, b) => b.calificacion - a.calificacion);
  }else {
    this.resenias.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  }
  this.paginaActual = 1; // Reinicia a la primera página
  this.actualizarPaginacion();
}

eliminarResenia(id_libro: string) {
  Swal.fire({
    title: this.translate.instant('libro.confirmar_eliminar_resenia'),
    text: this.translate.instant('libro.confirmar_eliminar_resenia_texto'),
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280',
    confirmButtonText: this.translate.instant('sweetAlert.confirmar_eliminar'),
    cancelButtonText: this.translate.instant('sweetAlert.cancelar'),
  }).then((result) => {
    if (result.isConfirmed) {
      this.servicioResenia.eliminarResenia(id_libro).subscribe({
        next: () => {
          this.reseniasDelLibro(); // Vuelve a cargar las reseñas del libro
          this.actualizarPaginacion(); // Actualiza la paginación después de eliminar
          Swal.fire({
            title: this.translate.instant('libro.resenia_eliminada'),
            text: this.translate.instant('libro.resenia_eliminada_texto'),
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
            background: '#f9fafb',
            color: '#1f2937',
            iconColor: '#10b981', // verde Tailwind
            customClass: {
              popup: 'rounded-lg shadow-lg'
            }
          });
        },
        error: (err) => {
          console.error('Error al eliminar reseña:', err);
          Swal.fire({
            title: this.translate.instant('libro.error_eliminar_resenia_titulo'),
            text: this.translate.instant('libro.error_eliminar_resenia_texto'),
            icon: 'error',
            background: '#fef2f2', // rojo claro
            color: '#991b1b',
            iconColor: '#dc2626',
            confirmButtonColor: '#dc2626',
            confirmButtonText: this.translate.instant('sweetAlert.entendido'),
            customClass: {
              popup: 'rounded-lg shadow-md',
              confirmButton:
                'bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded'
            }
          });
        }
      });
    }
  });
}

  //Método para redirigir al perfil del usuario
  redirigirPerfil(id: number) {
    this.router.navigate(['/app/perfil', id]); // Navegar a la ruta de detalle pasando el ID
  }
}
