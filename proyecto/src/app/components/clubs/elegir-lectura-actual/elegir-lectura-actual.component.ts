import { Component, inject } from '@angular/core';
import { ClubsService } from '../../../services/clubs.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LibrosService } from '../../../services/libros.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-elegir-lectura-actual',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, TranslateModule, ReactiveFormsModule],
  templateUrl: './elegir-lectura-actual.component.html',
  styles: ``,
})
export class ElegirLecturaActualComponent {
  //variables
  formLectura!: FormGroup;
  libroSeleccionado: any = null;
  aLibros: any[] = [];
  id_club: number = 0;
  fechaMinima: string = '';
//servicios
  private servicioClubs = inject(ClubsService);
  private servicioLibros = inject(LibrosService);
  private ruta = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private translate = inject(TranslateService);

  ngOnInit() {
    const hoy = new Date(); //obtiene fecha actual para establecer la fecha mínima
  this.fechaMinima = hoy.toISOString().split('T')[0];
    this.id_club = Number(this.ruta.snapshot.paramMap.get('idClub'));
    this.formLectura = this.fb.group({
      fecha_fin: ['', Validators.required],
    });
  }
//metodo para el buscador de libros
  buscar(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    if (value.trim() === '') {
      this.aLibros = [];
      return;
    }

    this.servicioLibros.buscarLibros(value).subscribe((res: any) => {
      this.aLibros = res.items ?? [];
    });
  }
//metodo para seleccionar un libro
  libroElegido(libro: any) {
    this.libroSeleccionado = libro;
    this.aLibros = [];
  }
//Método para guardar la lectura actual
  guardarLectura() {
    // Verifica si el formulario es válido y si hay un libro seleccionado
    if (this.formLectura.invalid || !this.libroSeleccionado) {
      this.formLectura.markAllAsTouched(); //hace como que los inputs han sido tocados para que salga el aviso
        Swal.fire({
      icon: 'warning',
      title: this.translate.instant('lectura.error_titulo'),
      text: this.translate.instant('lectura.error_texto'),
      confirmButtonColor: '#A6175A'
    });
      return;
    }
    // Si el formulario es válido, procede a guardar la lectura
    const fecha_fin = this.formLectura.value.fecha_fin;
    const id_libro = this.libroSeleccionado.id;

    this.servicioClubs.crearLecturaActual(this.id_club, id_libro, fecha_fin).subscribe({
      next: () => {
        console.log('Lectura guardada correctamente');
        this.router.navigate(['/app/club', this.id_club]);
      },
      error: (err) => {
        console.error('Error al guardar la lectura:', err);
      },
    });
  }
}