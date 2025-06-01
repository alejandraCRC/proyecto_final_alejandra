import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service'; // Importar el servicio de cookies
import { IdiomaService } from '../../services/idioma.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, TranslateModule],
  templateUrl: './header.component.html',
  styleUrl: `./header.component.css`,
  standalone: true
})
export class HeaderComponent {
  idiomaActual = 'es';
  usuario: any = null;
  // private servicioIdioma = inject(LanguageService)
  private translate = inject(TranslateService);
  private servicioAuth = inject(AuthService);
  private router = inject(Router);

  ngOnInit() {
    this.usuario = this.servicioAuth.getUsuario();
  }
  traducir(idioma: string) {
  this.translate.use(idioma);
  localStorage.setItem('idioma', idioma);
}
cerrarSesion() {
    this.servicioAuth.logout(); 
    this.router.navigate(['/login']); // redirige al login
  }
//Método para redirigir al perfil del usuario
  redirigirPerfil(id: number) {
    this.router.navigate(['/app/perfil', id]); // Navegar a la ruta de detalle pasando el ID
  }

}
