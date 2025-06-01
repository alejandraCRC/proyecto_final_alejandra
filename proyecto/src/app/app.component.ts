import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service'; // Import CookieService
import { IdiomaService } from './services/idioma.service';
import { AuthService } from './services/auth.service';


@Component({
  selector: 'app-root',
  imports: [ RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'page2page';

   private translate = inject(TranslateService);
   private servicioAuth = inject(AuthService)
   private router = inject(Router)

  ngOnInit() {
    const lang = localStorage.getItem('idioma') || 'es';
    this.translate.setDefaultLang('es');
    this.translate.use(lang);
     this.servicioAuth.refreshToken().subscribe({
      next: token => {
        // Guarda el nuevo access token (en memoria, localStorage, etc.)
        localStorage.setItem('access_token', token);
        console.log('Token refrescado con éxito');
      },
      error: err => {
        console.error('Error al refrescar token:', err);
        // Redirige al login si lo ves necesario
         this.router.navigate(['/login']);
      }
    });
  }
}