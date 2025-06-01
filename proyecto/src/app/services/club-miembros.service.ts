import {
  HttpClient,
  HttpErrorResponse,
  HttpHandler,
  HttpHeaders,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Usuario } from '../models/usuario';
import { MiembroClub } from '../models/club';

@Injectable({
  providedIn: 'root',
})
export class MiembrosClubService {
  public url: string = 'http://localhost:3000';
  //crear el objeto http
  public http = inject(HttpClient);

  //solicitar las clubs
  getMiembrosClub(id_club: Number): Observable<MiembroClub[]> {
    return this.http
      .get<MiembroClub[]>(`${this.url}/miembros/${id_club}`)
      .pipe(catchError(this.handleError));
  }

  //unirse a un club
  unirseClub(
    id_club: Number,
    id_usuario: Number,
    rol?: string
  ): Observable<{ message: string }> {
    let body;
    if (!rol) {
     body = {
      fecha_ingreso: new Date(),
      rol: 'miembro', //por defecto el rol es miembro
    };
  }else{
       body = {
        fecha_ingreso: new Date(),
        rol: rol,
      };
    }
    return this.http
      .post<{ message: string }>(
        `${this.url}/miembros/${id_club}/${id_usuario}`,
        body
      )
      .pipe(catchError(this.handleError));
  }

  //salirse de un club
  salirClub(
    id_club: Number,
    id_usuario: Number
  ): Observable<{ message: string }> {
    return this.http
      .delete<{ message: string }>(
        `${this.url}/miembros/${id_club}/${id_usuario}`
      )
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
}
