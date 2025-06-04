import { Component, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UsuariosService } from '../../../services/usuarios.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-lista-usuarios',
  imports: [TranslateModule],
  templateUrl: './lista-usuarios.component.html',
  styles: [],
})
export class ListaUsuariosComponent {
 tipoLista: 'seguidores' | 'seguidos' | null = null;
  listaUsuarios: any[] = [];

  private ruta = inject(ActivatedRoute);
  private router = inject(Router);
  private servicioUsuarios = inject(UsuariosService);

  ngOnInit() {
    this.ruta.paramMap.subscribe((params) => {
      const idUsuario = params.get('idUsuario');
      const url = this.ruta.snapshot.url.map(segment => segment.path);

      if (url.includes('seguidos')) {
        this.tipoLista = 'seguidos';
        this.cargarSeguidos(idUsuario);
      } else if (url.includes('seguidores')) {
        this.tipoLista = 'seguidores';
        this.cargarSeguidores(idUsuario);
      } else {
        this.tipoLista = null;
        this.redirigirPerfil(Number(idUsuario));
      }
    });
  }

  cargarSeguidos(idUsuario: string | null) {
    this.servicioUsuarios.getSeguidos(Number(idUsuario)).subscribe({
      next: (data) => {
        this.listaUsuarios = data; //almacena los seguidores del usuario
      }
    });
  }

  cargarSeguidores(idUsuario: string | null) {
     this.servicioUsuarios.getSeguidores(Number(idUsuario)).subscribe({
      next: (data) => {
        this.listaUsuarios = data; //almacena los seguidores del usuario
      }
    });
  }

  redirigirPerfil(id: number) {
    this.router.navigate(['/app/perfil', id]);  // Navegar a la ruta de detalle pasando el ID
  }

}
