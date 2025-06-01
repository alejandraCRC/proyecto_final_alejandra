import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class IdiomaService {
  private translate = inject(TranslateService);

  constructor() {
    const lang = localStorage.getItem('idioma') || 'es';
    this.translate.setDefaultLang('es');
    this.translate.use(lang);
  }

  cambiarIdioma(idioma: string) {
    this.translate.use(idioma);
    localStorage.setItem('idioma', idioma);
  }

  obtenerIdiomaActual() {
    return this.translate.currentLang || 'es';
  }
}
