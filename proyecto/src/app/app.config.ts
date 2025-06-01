import { ApplicationConfig, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

//localización española
import { registerLocaleData } from '@angular/common'; 
//función que se usa para registrar los datos locales
import localeES from '@angular/common/locales/es';
import localeEN from '@angular/common/locales/en';
import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { CookieService } from "ngx-cookie-service";
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { HttpClient } from '@angular/common/http';
import {
  TranslateLoader,
  TranslateModule,
  TranslateService
} from '@ngx-translate/core';
import { provideTranslate } from './app.translate.config';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
 //archivos que contienen la información necesaria para trabajar con la localizción española

 registerLocaleData(localeES, 'es'); //registrar el idioma español en la aplicación
registerLocaleData(localeEN, 'en');



export function localeIdFactory() {
  return localStorage.getItem('idioma') || 'es';
}
// carga los archivos JSON de traducción
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    { provide: LOCALE_ID, useFactory: localeIdFactory },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    provideHttpClient(withFetch()),
    provideTranslate(),
    CookieService,
  ]
};
