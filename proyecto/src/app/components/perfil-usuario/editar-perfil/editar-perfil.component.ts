import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UsuariosService } from '../../../services/usuarios.service';
import { Usuario } from '../../../models/usuario';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-editar-perfil',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, TranslateModule],
  templateUrl: './editar-perfil.component.html',
  styles: ``,
})
export class EditarPerfilComponent {
  usuario:any = null;

  private router = inject(Router);
  private servicioUsuarios = inject(UsuariosService);
  private translate = inject(TranslateService);

  ngOnInit(){
    this.cargarDatosUsuario();
  }

  cargarDatosUsuario() {
    this.servicioUsuarios.getUsuario().subscribe({
      next: (data) => {
        this.usuario = data; //almacena los detalles del usuario
        console.log(this.usuario); // Ver en consola los detalles del usuario
      },
    });
  }

 avatarSeleccionado: File | null = null;

cambiarImagen(event: any) {
  const file = event.target.files[0];
  if (file) {
    this.avatarSeleccionado = file;

    const reader = new FileReader();
    reader.onload = () => {
      if (this.usuario) {
        this.usuario.avatar = reader.result as string;
      }
    };
    reader.readAsDataURL(file);
  }
}

  guardarCambios() {
  const formData = new FormData();
  formData.append('nombre', this.usuario.nombre);
  formData.append('email', this.usuario.email);
  formData.append('biografia', this.usuario.biografia || '');

  if (this.avatarSeleccionado) {
    formData.append('avatar', this.avatarSeleccionado);
  }

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

}
