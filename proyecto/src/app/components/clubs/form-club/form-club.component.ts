import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuariosService } from '../../../services/usuarios.service';
import { Usuario } from '../../../models/usuario';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ClubsService } from '../../../services/clubs.service';
import { MiembrosClubService } from '../../../services/club-miembros.service';
import { AuthService } from '../../../services/auth.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-form-club',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, TranslateModule],
  templateUrl: './form-club.component.html',
  styles: ``,
})
export class FormClubComponent {
  //variables
  club: any = {
    nombre: '',
    descripcion: '',
    fecha_creacion: new Date()
  };
  usuario: any = null;
  idClub: any = null;

  //servicios
  private ruta = inject(ActivatedRoute);
  private router = inject(Router);
  private servicioClubs = inject(ClubsService);
  private servicioMiembrosClub = inject(MiembrosClubService);
  private servicioAuth = inject(AuthService);
  private fb = inject(FormBuilder);
  private translate = inject(TranslateService);
  public formClub!: FormGroup;

  ngOnInit() {
    this.usuario = this.servicioAuth.getUsuario(); //obtiene usuario logueado

    //campos requeridos del formulario
    this.formClub = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
    });

    this.idClub = this.ruta.snapshot.paramMap.get('idClub'); //obtiene el id del club desde la ruta
    if (this.idClub) {
      this.cargarDatosClub(this.idClub);
    }
  }
//carga los datos del club si se edita
  cargarDatosClub(id_club: any) {
    this.servicioClubs.obtenerClubPorId(id_club).subscribe({
      next: (data) => {
        this.club = data[0];
        this.formClub.patchValue({
          nombre: this.club.nombre,
          descripcion: this.club.descripcion,
        });
      },
      error: (err) => console.error('Error al cargar club', err),
    });
  }
// Método para validar y guardar los datos del club
  guardarCambios() {
    if (this.formClub.invalid) {
      this.formClub.markAllAsTouched(); // marcar para mostrar errores si hay
      return;
    }

    const datos = this.formClub.value;
    //si está definido el id del club, se actualiza
    if (this.club.id_club) {
      datos.id_club = this.club.id_club;
      this.servicioClubs.actualizarClub(datos).subscribe({
        next: () => {
          Swal.fire({
            toast: true,
            position: 'top-start',
            icon: 'success',
            title: this.translate.instant('formClub.alert_actualizado_exito'),
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
          this.router.navigate(['/app/club', this.club.id_club]);
        },
        error: (err) => {
          Swal.fire({
            toast: true,
            position: 'top-start',
            icon: 'error',
            title: this.translate.instant('formClub.alert_actualizado_error'),
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
        },
      });
    } else { //si no, se crea uno nuevo
      datos.fecha_creacion = new Date();
      this.servicioClubs.crearClub(datos).subscribe({
        next: (nuevoClub) => {
          Swal.fire({
            toast: true,
            position: 'top-start',
            icon: 'success',
            title: this.translate.instant('formClub.alert_creado_exito'),
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
          this.servicioMiembrosClub
            .unirseClub(nuevoClub.id_club, this.usuario.id_usuario, 'administrador')
            .subscribe({
              next: () => {
                console.log('Usuario se ha unido al club');
              },
              error: (err) => console.error('Error al unirse al club:', err),
            });
          this.router.navigate(['/app/club', nuevoClub.id_club]);
        },
        error: (err) => {
          Swal.fire({
            toast: true,
            position: 'top-start',
            icon: 'error',
            title: this.translate.instant('formClub.alert_creado_error'),
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
        },
      });
    }
  }
}
