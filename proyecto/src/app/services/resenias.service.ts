import {
  HttpClient,
  HttpErrorResponse,
  HttpHandler,
  HttpHeaders,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Usuario } from '../models/usuario';
import { Resenia } from '../models/resenia';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ReseniasService {
  public url: string = 'https://proyecto-final-alejandra.onrender.com';
  //crear el objeto http
  public http = inject(HttpClient);

  private authService = inject(AuthService);

  //obtener reseñas de un libro
  getReseniasPorLibroId(id_libro: string): Observable<Resenia[]> {
    //crear cabeceras
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`, //la autorizacion va con esta estructura
    });
    return this.http
      .get<Resenia[]>(`${this.url}/resenias/${id_libro}`, { headers })
      .pipe(catchError(this.handleError));
  }

  //obtener reseñas de un usuario
  getReseniasPorUsuarioId(id_usuario: number): Observable<Resenia[]> {
    //crear cabeceras
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`, //la autorizacion va con esta estructura
    });
    return this.http
      .get<Resenia[]>(`${this.url}/reseniasUsuario/${id_usuario}`, { headers })
      .pipe(catchError(this.handleError));
  }

  // //añadir reseña
  guardarResenia(
    id_libro: string,
    calificacion: number,
    resenia: string,
    fecha: Date
  ): Observable<any> {
    //crear cabeceras
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`, //la autorizacion va con esta estructura
    });
    const body = { id_libro, calificacion, resenia, fecha };
    return this.http
      .post(`${this.url}/resenias`, body, { headers })
      .pipe(catchError(this.handleError));
  }

  eliminarResenia(id_libro: string): Observable<any> {
    //crear cabeceras
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`, //la autorizacion va con esta estructura
    });
    return this.http
      .delete(`${this.url}/resenias/${id_libro}`, { headers })
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
