import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UsuariosService } from '../../../services/usuarios.service';
import { Usuario } from '../../../models/usuario';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-editar-perfil',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, TranslateModule, FormsModule],
  templateUrl: './editar-perfil.component.html',
  styles: ``,
})
export class EditarPerfilComponent {
 // Servicios
  private fb = inject(FormBuilder);
  private servicioUsuarios = inject(UsuariosService);
  private router = inject(Router);
  private translate = inject(TranslateService);

  // Variables
  perfilForm!: FormGroup;
  usuario: any = null;

  ngOnInit(): void {
    this.cargarDatosUsuario();
  }

  cargarDatosUsuario() {
    this.servicioUsuarios.getUsuario().subscribe({
      next: (data) => {
        this.usuario = data;
        this.inicializarFormulario();
      },
      error: (err) => {
        console.error('Error al cargar usuario', err);
      }
    });
  }

  inicializarFormulario() {
    this.perfilForm = this.fb.group({
      nombre: [this.usuario?.nombre || '', Validators.required],
      email: [this.usuario?.email || '', [Validators.required, Validators.email]],
      biografia: [this.usuario?.biografia || '']
    });
  }


  guardarCambios() {
    if (this.perfilForm.invalid) {
      this.perfilForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    formData.append('nombre', this.perfilForm.get('nombre')?.value);
    formData.append('email', this.perfilForm.get('email')?.value);
    formData.append('biografia', this.perfilForm.get('biografia')?.value || '');


    this.servicioUsuarios.actualizarUsuario(this.usuario.id_usuario, formData).subscribe({
      next: () => {
        Swal.fire({
          toast: true,
          position: 'top-start',
          icon: 'success',
          title: this.translate.instant('perfil.actualizado_exito'),
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true
        });
        this.router.navigate(['/app/perfil']);
      },
      error: (err) => {
        console.error('Error al actualizar', err);
        Swal.fire({
          toast: true,
          position: 'top-start',
          icon: 'error',
          title: this.translate.instant('perfil.actualizado_error'),
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true
        });
      }
    });
  }

  // Getters para validaciones
  get nombreInvalido() {
    return this.perfilForm.get('nombre')?.invalid && this.perfilForm.get('nombre')?.touched;
  }

  get emailInvalido() {
    return this.perfilForm.get('email')?.invalid && this.perfilForm.get('email')?.touched;
  }

  get emailFormatoInvalido() {
    return this.perfilForm.get('email')?.errors?.['email'] && this.perfilForm.get('email')?.touched;
  }

  //Método para eliminar el usuario
  eliminarCuenta() {
    Swal.fire({
      title: this.translate.instant('perfil.eliminar_titulo'),
      text: this.translate.instant('perfil.eliminar_texto'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('sweetAlert.confirmar_eliminar'),
      cancelButtonText: this.translate.instant('sweetAlert.cancelar')
    }).then((result) => {
      if (result.isConfirmed) {
        this.servicioUsuarios.eliminarUsuario().subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: this.translate.instant('perfil.eliminado_exito'),
              showConfirmButton: false,
              timer: 3000
            });
            this.router.navigate(['/login']);
          },
          error: (err) => {
            console.error('Error al eliminar usuario', err);
            Swal.fire({
              icon: 'error',
              title: this.translate.instant('perfil.eliminado_error'),
              text: err.message
            });
          }
        });
      }
    });
  }
}