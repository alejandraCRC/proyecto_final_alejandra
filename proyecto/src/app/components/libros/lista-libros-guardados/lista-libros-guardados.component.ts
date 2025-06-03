import { Component, inject } from '@angular/core';
import { LibrosUsuarioService } from '../../../services/libros-usuario.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import Swal from 'sweetalert2';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-libros-guardados',
  imports: [TranslateModule],
  templateUrl: './lista-libros-guardados.component.html',
  styles: ``
})
export class ListaLibrosGuardadosComponent {

  libros: any[] = [];
  idUsuarioActual?: number;
  idUsuarioDelPerfil?: number;

  private ruta = inject(ActivatedRoute);
  private router = inject(Router);
  private servicioLibrosUsuario = inject(LibrosUsuarioService);
  private authService = inject(AuthService); 
  private translate = inject(TranslateService);

  ngOnInit() {
    this.idUsuarioDelPerfil = this.ruta.snapshot.params['idUsuario'];
    const usuario = this.authService.getUsuario();
    console.log('Usuario actual:', usuario);
  this.idUsuarioActual = usuario?.id;
    this.libros = this.servicioLibrosUsuario.getLibros();
  }

eliminarLibro(id_libro: string) {
  Swal.fire({
    title: this.translate.instant('libro.eliminar_libro_warning_titulo'),
    text: this.translate.instant('libro.eliminar_libro_warning_texto'),
    icon: 'warning',
    iconColor: '#ef4444', // rojo Tailwind
    showCancelButton: true,
    confirmButtonText: this.translate.instant('sweetAlert_confirmar_eliminar'),
    cancelButtonText: this.translate.instant('sweetAlert_cancelar_eliminar'),
    background: '#f9fafb', // gris claro Tailwind
    color: '#1f2937', // texto gris oscuro
    confirmButtonColor: '#ef4444', // rojo Tailwind
    cancelButtonColor: '#6b7280', // gris neutro Tailwind
    buttonsStyling: false,
    customClass: {
      popup: 'rounded-lg shadow-lg',
      title: 'text-lg font-semibold',
      confirmButton: 'bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded mr-2',
      cancelButton: 'bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded'
    }
  }).then((result) => {
    if (result.isConfirmed) {
      this.servicioLibrosUsuario.eliminarLibroUsuario(id_libro).subscribe({
        next: () => {
          this.libros = this.libros.filter((l) => l.id !== id_libro);

          Swal.fire({
            title: this.translate.instant('libro.eliminado_libro'),
            text: this.translate.instant('libro.eliminado_libro_texto'),
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
          console.error('Error al eliminar libro:', err);
          Swal.fire({
            title: this.translate.instant('libro.error_eliminar_libro_titulo'),
            text: this.translate.instant('libro.error_eliminar_libro_texto'),
            icon: 'error',
            background: '#fef2f2', // rojo claro
            color: '#991b1b',
            iconColor: '#dc2626',
            confirmButtonColor: '#dc2626',
            confirmButtonText: this.translate.instant('sweetAlert_entendido'),
            customClass: {
              popup: 'rounded-lg shadow-md',
              confirmButton: 'bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded'
            }
          });
        }
      });
    }
  });
}


    // Método para manejar el clic en un libro y obtener sus detalles
  redirigirLibro(id: string) {
    this.router.navigate(['/app/detalle', id]);  // Navegar a la ruta de detalle pasando el ID
  }
}
