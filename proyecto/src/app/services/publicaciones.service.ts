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
  public url: string = 'http://localhost:3000';
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
  //     //   //solicitar una tarea segun su usuario
  //   getClubsUsuario():Observable<Club[]>{
  //     //crear cabeceras
  //     const headers=new HttpHeaders({
  //       'Authorization': `Bearer ${this.authService.getToken()}` //la autorizacion va con esta estructura
  //     })
  //     return this.http.get<Club[]>(`${this.url}/clubsUsuario`, { headers }).pipe(
  //       catchError(this.handleError)
  //     );
  //   }

  //     //solicitar un club
  // obtenerClubPorId(id_club:number):Observable<Club[]>{
  //   return this.http.get<Club[]>(`${this.url}/club/${id_club}`).pipe(
  //     catchError(this.handleError)
  //   )
  // }

  //   //solicitar una tarea segun su estado
  //   getTareasEstado(estado:string):Observable<Tarea[]>{
  //     //crear cabeceras
  //     return this.http.get<Tarea[]>(`${this.url}/tareas/estado/${estado}`).pipe(
  //       catchError(this.handleError)
  //     );
  //   }

  //   //eliminar tarea
  // deleteTarea(id:number):Observable<{message:string}>{
  //   return this.http.delete<{message:string}>(`${this.url}/tareas/${id}`).pipe(
  //     catchError(this.handleError)
  //   );
  // }

  // //añadir tarea
  // postTarea(tarea:Tarea):Observable<{id:number}>{
  //   return this.http.post<{id:number}>(`${this.url}/tareas`,tarea).pipe(
  //     catchError(this.handleError)
  //   );

  // }

  // //editar tarea
  // putTarea(tarea:Tarea):Observable<{message:string}>{
  //   return this.http.put<{message:string}>(`${this.url}/tareas/${tarea.idTarea}`,tarea).pipe(
  //     catchError(this.handleError)
  //   );

  // }

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

  //leer todos los usuarios
  getUsuarios(): Observable<Usuario[]> {
    return this.http
      .get<Usuario[]>(`${this.url}/usuarios`)
      .pipe(catchError(this.handleError));
  }
}
