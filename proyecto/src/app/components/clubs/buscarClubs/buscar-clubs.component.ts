import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClubsService } from '../../../services/clubs.service';
import { UsuariosService } from '../../../services/usuarios.service';
import { forkJoin } from 'rxjs'; //para llamadas en paralelo
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-clubs',
  imports: [TranslateModule],
  templateUrl: './buscar-clubs.component.html',
  styles: ``,
})
export class BuscarClubsComponent {
  resultadosClubs: any[] = [];
  resultadosUsuarios: any[] = [];
  terminoBusqueda: string = '';

  private servicioClubs = inject(ClubsService);
  private servicioUsuarios = inject(UsuariosService);
  private router = inject(Router);

  buscar(event: Event) {
    const value = (event.target as HTMLInputElement).value.trim(); //obtiene el valor del input
    this.terminoBusqueda = value;

    if (!value) {
      // Si el input está vacío, limpia los resultados
      this.resultadosClubs = [];
      this.resultadosUsuarios = [];
      return;
    }

    // Ejecutar ambas búsquedas en paralelo
    forkJoin({
      clubs: this.servicioClubs.buscarClubsPorNombre(value),
      usuarios: this.servicioUsuarios.buscarUsuariosPorNombre(value),
    }).subscribe({
      next: ({ clubs, usuarios }) => {
        this.resultadosClubs = clubs;
        this.resultadosUsuarios = usuarios;
      },
      error: (err) => {
        console.error('Error en la búsqueda:', err);
      },
    });
  }

  //Método para redirigir al perfil del usuario
  redirigirPerfil(id: number) {
    this.router.navigate(['/app/perfil', id]);  // Navegar a la ruta de perfil pasando el ID
  }

  // Método para redirigir al club seleccionado
  redirigirClub(id: number) {
    this.router.navigate(['/app/club', id]); // Navegar a la ruta de club pasando el ID
  }

}
