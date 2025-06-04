import {
  HttpClient,
  HttpErrorResponse,
  HttpHandler,
  HttpHeaders,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Usuario } from '../models/usuario';
import { Publicacion, Comentario } from '../models/club';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class PublicacionesService {
  public url: string = 'https://proyecto-final-alejandra.onrender.com';
  //crear el objeto http
  public http = inject(HttpClient);
  private authService = inject(AuthService);

  //solicitar las publicaciones del clubs
  getPublicacionesClub(id_club: Number): Observable<Publicacion[]> {
    return this.http
      .get<Publicacion[]>(`${this.url}/publicaciones/${id_club}`)
      .pipe(catchError(this.handleError));
  }

  getPublicacionesUsuario(id_usuario: number): Observable<Publicacion[]> {
    //crear cabeceras
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`, //la autorizacion va con esta estructura
    });
    return this.http
      .get<Publicacion[]>(`${this.url}/publicacionesUsuario/${id_usuario}`, { headers })
      .pipe(catchError(this.handleError));
  }

  //añadir publicacion
  guardarPublicacion(
    id_club: Number,
    titulo: String,
    contenido: String,
    fecha_publicacion: Date
  ): Observable<any> {
    //crear cabeceras
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`, //la autorizacion va con esta estructura
    });
    const body = { id_club, titulo, contenido, fecha_publicacion };
    return this.http
      .post(`${this.url}/publicaciones`, body, { headers })
      .pipe(catchError(this.handleError));
  }

  //eliminar publicacion
  eliminarPublicacion(id_publicacion: Number): Observable<any> {
    //crear cabeceras
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`, //la autorizacion va con esta estructura
    });
    return this.http
      .delete(`${this.url}/publicaciones/${id_publicacion}`, { headers })
      .pipe(catchError(this.handleError));
  }

  //solicitar las publicaciones del clubs
  getComentariosPublicacion(id_publicacion: Number): Observable<Comentario[]> {
    return this.http
      .get<Comentario[]>(`${this.url}/comentarios/${id_publicacion}`)
      .pipe(catchError(this.handleError));
  }

  //añadir comentario de publicacion
  guardarComentarioPublicacion(
    id_publicacion: Number,
    contenido: String,
    fecha_comentario: Date
  ): Observable<any> {
    //crear cabeceras
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`, //la autorizacion va con esta estructura
    });
    const body = { id_publicacion, contenido, fecha_comentario };
    return this.http
      .post(`${this.url}/comentarios`, body, { headers })
      .pipe(catchError(this.handleError));
  }

  //eliminar comentario de publicacion
  eliminarComentarioPublicacion(id_comentario: Number): Observable<any> {
    //crear cabeceras
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`, //la autorizacion va con esta estructura
    });
    return this.http
      .delete(`${this.url}/comentarios/${id_comentario}`, { headers })
      .pipe(catchError(this.handleError));
  }

  // //metodo para manejar los errores
  private handleError(err: HttpErrorResponse) {
    let errorMessage: string = '';
    if (err.error instanceof ErrorEvent) {
      errorMessage = `Error del cliente ${err.error.message}`;
    } else {
      errorMessage = `Error del servidor ${err.error.message}`;
    }
    return throwError(() => {
      new Error(errorMessage);
    });
  }
}
