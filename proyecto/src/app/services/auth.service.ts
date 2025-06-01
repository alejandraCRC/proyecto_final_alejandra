import { Injectable, inject } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000'; // Asegurate que coincida con tu backend

  private http = inject(HttpClient);

  constructor( private cookies: CookieService) {}

  // Login
  login(email: string, password: string): Observable<any> {
  const body = { email, password };
  return this.http.post<{ token: string, usuario: any }>(`${this.apiUrl}/login`, body, {
    withCredentials: true,
  }).pipe(
    map(response => {
      localStorage.setItem('access_token', response.token);
      this.setUsuario(response.usuario);
      return response;
    }),
    catchError(this.handleError)
  );
}

  // Registro
  register(
    nombre: string,
    email: string,
    contrasenia: string,
    fecha_registro: string
  ): Observable<any> {
    const body = { nombre, email, contrasenia, fecha_registro };
    return this.http
      .post(`${this.apiUrl}/register`, body)
      .pipe(catchError(this.handleError));
  }

  setToken(token: any) {
    this.cookies.set('token', token);
  }

  getToken() {
    return this.cookies.get('token');
  }

  setUsuario(usuario: any) {
  localStorage.setItem('usuario', JSON.stringify(usuario));
}

getUsuario() {
  const usuario = localStorage.getItem('usuario');
  return usuario ? JSON.parse(usuario) : null;
}

  estaAutenticado(): boolean {
    const token = this.getToken();
    return !!token; // Retorna true si hay token, false si no
  }

  refreshToken(): Observable<string> {
  return this.http.get<{ accessToken: string }>(`${this.apiUrl}/refresh-token`, {
    withCredentials: true,
  }).pipe(
    map(response => {
      localStorage.setItem('access_token', response.accessToken);
      return response.accessToken;
    }),
    catchError(this.handleError)
  );
}

  logout() {
    this.cookies.delete('token');
    localStorage.removeItem('usuario');
    window.location.href = '/login';
  }
  // Manejo de errores
  private handleError(error: HttpErrorResponse) {
    console.error('Error desde AuthService:', error);
    return throwError(
      () =>
        new Error(error.error?.message || 'Error de conexión con el servidor')
    );
  }
}
