import { Component, inject } from '@angular/core';
import { LibrosService } from '../../../services/libros.service';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-libros.component',
  imports: [TranslateModule],
  templateUrl: './buscarLibros.component.html',
  styles: ``
})
export class BuscarLibrosComponent {

//variables
  aLibros: any[] = [];
  libroSeleccionado: any = null;  

 private servicioLibros = inject(LibrosService);
 private router = inject(Router);

// Método para el buscador de libros
  buscar(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.servicioLibros.buscarLibros(value).subscribe((res: any) => {
      console.log(res);
      this.aLibros = res.items ?? [];  // Guardalos libros en un array
    });
  }

  // Método para manejar el clic en un libro y obtener sus detalles
  redirigirLibro(id: string) {
    this.router.navigate(['/app/libro', id]);  // LLeva a la página de detalles del libro
  }
  
}
